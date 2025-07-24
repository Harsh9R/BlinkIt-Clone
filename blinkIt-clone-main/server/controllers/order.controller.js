import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

// Function to generate receipt
const generateReceipt = (order) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `
===========================================
            ORDER RECEIPT
===========================================
Order ID: ${order.orderId}
Date: ${date}
Time: ${time}
-------------------------------------------
Product: ${order.product_details.name}
-------------------------------------------
Subtotal: ₹${order.subTotalAmt}
Total Amount: ₹${order.totalAmt}
-------------------------------------------
Payment Status: ${order.payment_status}
===========================================
Thank you for your order!
===========================================
    `.trim();
};

export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        const payload = list_items.map(el => {
            const orderData = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: {
                    name: el.productId.name,
                    image: el.productId.image
                },
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                delivery_address: addressId,
                subTotalAmt: subTotalAmt,
                totalAmt: totalAmt,
            };
            
            // Generate receipt for each order
            orderData.invoice_receipt = generateReceipt(orderData);
            
            return orderData;
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId: userId })
        const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

        return response.json({
            message: "Order successfully",
            error: false,
            success: true,
            data: generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const pricewithDiscount = (price, dis = 1) => {
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request, response) {
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        console.log('Payment request received:', { userId, list_items, totalAmt, addressId, subTotalAmt })

        const user = await UserModel.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }

        console.log('User found:', user.email)

        const line_items = list_items.map(item => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.productId.name,
                        images: item.productId.image,
                        metadata: {
                            productId: item.productId._id
                        }
                    },
                    unit_amount: pricewithDiscount(item.productId.price, item.productId.discount) * 100
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            }
        })

        console.log('Line items created:', line_items)

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        }

        console.log('Creating Stripe session with params:', params)

        const session = await Stripe.checkout.sessions.create(params)
        console.log('Stripe session created:', session.id)

        return response.status(200).json(session)

    } catch (error) {
        console.error('Payment controller error:', error)
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const getOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    const productList = []

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product)

            const orderData = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                product_details: {
                    name: product.name,
                    image: product.images
                },
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100),
                totalAmt: Number(item.amount_total / 100),
            };
            
            // Generate receipt for each order
            orderData.invoice_receipt = generateReceipt(orderData);
            
            productList.push(orderData);
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event", event)

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
            const userId = session.metadata.userId
            const orderProduct = await getOrderProductItems(
                {
                    lineItems: lineItems,
                    userId: userId,
                    addressId: session.metadata.addressId,
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status,
                })
            
            const order = await OrderModel.insertMany(orderProduct)

            console.log(order)
            if (Boolean(order[0])) {
                const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
                    shopping_cart: []
                })
                const removeCartProductDB = await CartProductModel.deleteMany({ userId: userId })
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
}

export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address')

        return response.json({
            message: "order list",
            data: orderlist,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getOrderReceiptController(request, response) {
    try {
        const { orderId } = request.params;
        const userId = request.userId;

        console.log('Receipt request received:', { orderId, userId });

        if (!orderId) {
            return response.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false
            });
        }

        // Find the order by orderId and userId
        const order = await OrderModel.findOne({ 
            orderId: orderId,
            userId: userId 
        }).populate('delivery_address');

        console.log('Found order:', order ? 'Yes' : 'No');

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // If no receipt exists, generate one
        if (!order.invoice_receipt) {
            console.log('Generating new receipt for order');
            order.invoice_receipt = generateReceipt(order);
            await order.save();
        }

        const responseData = {
            message: "Receipt retrieved successfully",
            error: false,
            success: true,
            data: {
                receipt: order.invoice_receipt,
                orderDetails: {
                    orderId: order.orderId,
                    productName: order.product_details.name,
                    totalAmount: order.totalAmt,
                    paymentStatus: order.payment_status,
                    date: order.createdAt,
                    deliveryAddress: order.delivery_address
                }
            }
        };

        console.log('Sending response:', responseData);
        return response.json(responseData);

    } catch (error) {
        console.error('Receipt controller error:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
