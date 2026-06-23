const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {

    try {

        const userId = req.user.userId;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });

        // Agar cart exist nahi karta
        if (!cart) {

            cart = await Cart.create({
                user: userId,
                items: [{
                    product: productId,
                    quantity: quantity || 1
                }]
            });

            return res.json({
                message: "Product added to cart",
                cart
            });
        }

        // Agar cart already exist karta hai

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {

            existingItem.quantity += quantity || 1;

        } else {

            cart.items.push({
                product: productId,
                quantity: quantity || 1
            });

        }

        await cart.save();

        res.json({
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// controller method to get the cart items of current user

exports.getCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user.userId
        }).populate("items.product");

        if (!cart) {
            return res.json({
                message: "Cart is empty",
                items: []
            });
        }

        let totalPrice = 0;

        const formattedItems = cart.items.map(item => {

            const subtotal =
                item.product.price * item.quantity;

            totalPrice += subtotal;

            return {
                product: item.product,
                quantity: item.quantity,
                subtotal
            };
        });

        res.json({
            items: formattedItems,
            totalPrice
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Controller method for deleting the specific product from cart

exports.removeItem = async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user.userId
    });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found"
        });
    }

    cart.items = cart.items.filter(item =>

        item.product.toString() !== req.params.productId

    );

    await cart.save();

    res.json({

        message: "Item removed successfully",

        cart

    });

};