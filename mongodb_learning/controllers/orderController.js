// Controller method to place the order of cart items

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");
exports.placeOrder = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product")
            .session(session);

        if (!cart || cart.items.length === 0) {

            await session.abortTransaction();

            return res.status(400).json({
                message: "Cart is empty"
            });

        }

        let totalAmount = 0;

        for (const item of cart.items) {

            const product = item.product;

            if (product.stock < item.quantity) {

                await session.abortTransaction();

                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });

            }

            product.stock -= item.quantity;

            await product.save({ session });

            totalAmount += product.price * item.quantity;
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const order = await Order.create(
            [{
                user: userId,
                items: orderItems,
                totalAmount
            }],
            { session }
        );

        cart.items = [];

        await cart.save({ session });

        await session.commitTransaction();

        res.json({
            message: "Order placed successfully",
            order: order[0]
        });

    } catch (error) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        res.status(500).json({
            message: error.message
        });

    } finally {

        await session.endSession();

    }

};
// comtroller metod to get the current user orders


exports.getMyOrders = async (req, res) => {

    try {

        const userId = req.user.userId;

        const orders = await Order.find({ user: userId })
            .populate("items.product")
            .sort({ createdAt: -1 });

        if (!orders.length) {
            return res.json({
                message: "No orders found",
                orders: []
            });
        }

        const formattedOrders = orders.map(order => {

            return {

                orderId: order._id,
                items: order.items.map(item => ({

                    product: item.product,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.price * item.quantity

                })),

                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt

            };

        });

        res.json({
            totalOrders: orders.length,
            orders: formattedOrders
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

//Controller method to get all orders of all users by admin 

exports.getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json({
            totalOrders: orders.length,
            orders
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Controller method to update the status of specific order


exports.updateOrderStatus = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        order.status = status;
        await order.save();

        res.json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


exports.cancelOrder = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const order = await Order.findById(req.params.id)
            .session(session);

        if (!order) {

            await session.abortTransaction();

            return res.status(404).json({
                message: "Order not found"
            });

        }

        // Owner or admin can cancel
        if (
            order.user.toString() !== req.user.userId &&
            req.user.role !== "admin"
        ) {

            await session.abortTransaction();

            return res.status(403).json({
                message: "Not authorized"
            });

        }

        // Only pending or confirmed orders can be cancelled
        if (
            order.status === "shipped" ||
            order.status === "delivered" ||
            order.status === "cancelled"
        ) {

            await session.abortTransaction();

            return res.status(400).json({
                message: `Order cannot be cancelled because it is ${order.status}`
            });

        }

        // Restore stock
        for (const item of order.items) {

            const product = await Product.findById(item.product)
                .session(session);

            if (product) {

                product.stock += item.quantity;

                await product.save({ session });

            }

        }

        // Update order status
        order.status = "cancelled";

        await order.save({ session });

        await session.commitTransaction();

        res.json({

            message: "Order cancelled successfully",

            order

        });

    } catch (error) {

        if (session.inTransaction()) {

            await session.abortTransaction();

        }

        res.status(500).json({

            message: error.message

        });

    } finally {

        await session.endSession();

    }

};