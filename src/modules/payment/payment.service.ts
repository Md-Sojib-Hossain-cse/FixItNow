import { BookingStatus, PaymentProvider, PaymentStatus } from "../../../generated/prisma/enums"
import config from "../../config"
import AppError from "../../errors/appError"
import { prisma } from "../../lib/prisma"
import httpStatus from "http-status"
import { v4 as uuidv4 } from 'uuid';
import SSLCommerzPayment from "sslcommerz-lts";

const initiatePayment = async (userId : string , bookingId : string) => {
    let transactionId : string;

    const booking = await prisma.bookings.findFirst({
        where : {
            id : bookingId
        },
        include : {
            customer : {
                omit : {
                    password : true
                }
            },
            service : {
                select : {
                    category : {
                        select : {
                            name : true
                        }
                    },
                    title : true
                }
            },
        }
    })

    if(!booking){
        throw new AppError(httpStatus.NOT_FOUND , "Booking not Found!")
    }

    if(booking.customerId !== userId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only make payment of your own bookings!")
    }

    if(booking.status !== BookingStatus.ACCEPTED){
        throw new AppError(httpStatus.BAD_REQUEST , "You can only make payment for accepted bookings!")
    }

    const payment = await prisma.payments.findUnique({
        where : {
            bookingId
        }
    })

    if(payment?.status === PaymentStatus.SUCCESS){
        throw new AppError(httpStatus.BAD_REQUEST , "This booking has already been paid.")
    } 

    transactionId =payment?.transactionId ?? `TRNX_ID${uuidv4()}`;



    const data = {
        total_amount: Number(booking?.totalPrice),
        currency: 'BDT',
        tran_id: transactionId, // use unique tran_id for each api call
        success_url: `${config.backend_url}/api/payments/${transactionId}/success`,
        fail_url: `${config.backend_url}/api/payments/${transactionId}/failed`,
        cancel_url: `${config.backend_url}/api/payments/${transactionId}/cancel`,
        ipn_url: `${config.backend_url}/ipn`,
        shipping_method: 'Courier',
        product_name: booking.service.title,
        product_category: booking.service.category.name,
        product_profile: 'general',
        cus_name: booking.customer.name,
        cus_email: booking.customer.email,
        cus_add1: booking.customer.address || "N/A",
        cus_add2: booking.customer.address || "N/A",
        cus_city: booking.customer.address || "N/A",
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: booking.customer.phone || '01906479901',
        cus_fax: booking.customer.phone || '01906479901',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };


    const sslcz = new SSLCommerzPayment(config.ssl_commerz_store_id, config.ssl_commerz_store_password, false)
    const apiResponse = await sslcz.init(data);

    if (!apiResponse?.GatewayPageURL) {
        throw new AppError(httpStatus.BAD_GATEWAY,"Failed to initiate payment.");
    }

    const gatewayPageURL = apiResponse.GatewayPageURL;

    const createPaymentPayload = {
        bookingId,
        transactionId : transactionId,
        amount : Number(booking.totalPrice),
        provider : PaymentProvider.SSLCOMMERZ,
        status : PaymentStatus.PENDING,
        meta : {
            data ,
            gatewayPageURL
        }
    }

    const updatePaymentPayload = {
        transactionId,
        status : PaymentStatus.PENDING,
        provider : PaymentProvider.SSLCOMMERZ,
        meta : {
            data ,
            gatewayPageURL
        }
    }

    await prisma.payments.upsert({
        where: {
            bookingId,
        },
        create: createPaymentPayload,
        update: updatePaymentPayload,
    });

    return {
        url: gatewayPageURL,
    };
}

const successPayment = async(transactionId : string) => {

    const result = await prisma.$transaction(async (px) => {
        const payment = await px.payments.findUnique({
            where : {
                transactionId : transactionId,
            }
        })

        if(!payment){
            throw new AppError(httpStatus.BAD_REQUEST , "for payment you're try to initiate not found!")
        }

        const successfulPayment = await px.payments.update({
            where : {
                transactionId 
            },
            data : {
                status : PaymentStatus.SUCCESS,
                paidAt : new Date()
            }
        })

        if(!successfulPayment){
            throw new AppError(httpStatus.BAD_GATEWAY , "Something went wrong during payment!")
        }

        await px.bookings.update({
            where : {
                id : successfulPayment.bookingId
            },
            data : {
                status : BookingStatus.PAID
            }
        })

        return {
            url : `${config.payment_success_url}/${transactionId}`
        }
    })
    
    return result
}

const failPayment = async(transactionId : string) => {

    const result = await prisma.$transaction(async (px) => {
        const payment = await px.payments.findUnique({
            where : {
                transactionId : transactionId,
            }
        })

        if(!payment){
            throw new AppError(httpStatus.BAD_REQUEST , "for payment you're try to initiate not found!")
        }

        const failedPayment = await px.payments.update({
            where : {
                transactionId 
            },
            data : {
                status : PaymentStatus.FAILED,
            }
        })

        if(!failedPayment){
            throw new AppError(httpStatus.BAD_GATEWAY , "Something went wrong during payment!")
        }

        await px.bookings.update({
            where : {
                id : failedPayment.bookingId
            },
            data : {
                status : BookingStatus.ACCEPTED
            }
        })

        return {
            url : `${config.payment_fail_url}/${transactionId}`
        }
    })
    
    return result
}

const cancelPayment = async(transactionId : string) => {

    const result = await prisma.$transaction(async (px) => {
        const payment = await px.payments.findUnique({
            where : {
                transactionId : transactionId,
            }
        })

        if(!payment){
            throw new AppError(httpStatus.BAD_REQUEST , "for payment you're try to initiate not found!")
        }

        const cancelPayment = await px.payments.update({
            where : {
                transactionId 
            },
            data : {
                status : PaymentStatus.CANCELLED,
            }
        })

        if(!cancelPayment){
            throw new AppError(httpStatus.BAD_GATEWAY , "Something went wrong during payment!")
        }

        await px.bookings.update({
            where : {
                id : cancelPayment.bookingId
            },
            data : {
                status : BookingStatus.ACCEPTED
            }
        })

        return {
            url : `${config.payment_cancel_url}/${transactionId}`
        }
    })
    
    return result
}

export const paymentService = {
    initiatePayment,
    successPayment,
    failPayment,
    cancelPayment
}