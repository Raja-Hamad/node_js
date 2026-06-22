
// CREATE
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const Cart = require("../models/Cart");

exports.createProduct = async (req, res) => {

    try {

        const { name, price } = req.body;

        let images = [];

        if (req.files && req.files.length > 0) {

            images = req.files.map(file => ({
                url: file.path,
                publicId: file.filename
            }));

        }

        const product = await Product.create({

            name,
            price,
            images,
            createdBy: req.user.userId

        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.myProducts = async (req, res) => {

    try {

        let { page = 1, limit = 10, search, minPrice, maxPrice, sort } = req.query;

        page = Number(page);
        limit = Number(limit);

        // 🔥 BASE FILTER (IMPORTANT: ownership fixed)
        let filter = {
            createdBy: req.user.userId
        };

        // 🔍 SEARCH (name based)
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        // 💰 PRICE FILTER
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // 🔃 SORT
        let sortOption = {};

        if (sort) {
            const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
            const sortOrder = sort.startsWith("-") ? -1 : 1;

            sortOption[sortField] = sortOrder;
        }

        // 📄 PAGINATION
        const skip = (page - 1) * limit;

        // 🔥 QUERY
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        // 📊 TOTAL COUNT (for frontend pagination UI)
        const total = await Product.countDocuments(filter);

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: products
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ONE
exports.getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
};

// UPDATE
exports.updateProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 🔥 OWNERSHIP CHECK
        if (product.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to update this product"
            });
        }

        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;

        await product.save();

        res.json({
            message: "Product updated",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// DELETE
exports.deleteProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Owner OR Admin can delete 

        if (product.createdBy.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not allowed to delete this product"

            });
        }

        await product.deleteOne();

        res.json({
            message: "Product deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// controller method for adding more images to the existing product
exports.addImagesToProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Ownership check
        if (product.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to update this product"
            });
        }

        // Optional limit
        if (product.images.length + req.files.length > 8) {
            return res.status(400).json({
                message: "Maximum 8 images allowed"
            });
        }

        const newImages = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));

        product.images.push(...newImages);

        await product.save();

        res.json({
            message: "Images added successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// controller method for deleting specific image from the existing product by using the product and image id: 

exports.deleteProductImage = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }


        // Ownership check
        if (product.createdBy.toString() !== req.user.userId) {

            return res.status(403).json({
                message: "You are not allowed"
            });

        }


        const image = product.images.id(req.params.imageId);

        if (!image) {

            return res.status(404).json({

                message: "Image not found"

            });

        }


        await cloudinary.uploader.destroy(

            image.publicId

        );


        product.images.pull(

            req.params.imageId

        );


        await product.save();


        res.json({

            message: "Image deleted successfully",

            product

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// Controller method for adding the products to cart:


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


