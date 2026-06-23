// Controller method to place the order of cart items

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");


exports.placeOrder = async (req, res) => {

    try {

        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;

        const orderItems = cart.items.map(item => {

            const subtotal = item.product.price * item.quantity;

            totalAmount += subtotal;

            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            };
        });

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount
        });

        // 🧹 Clear cart after order
        cart.items = [];
        await cart.save();

        res.json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

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
