const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
exports.getAnalytics = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();


        const revenue = await Order.aggregate([

            {
                $match: {
                    status: {
                        $ne: "cancelled"
                    }
                }
            },

            {
                $group: {

                    _id: null,

                    totalRevenue: {

                        $sum: "$totalAmount"

                    }

                }

            }

        ]);


        const totalRevenue = revenue.length > 0
            ? revenue[0].totalRevenue
            : 0;


        res.json({

            totalUsers,

            totalProducts,

            totalOrders,

            totalRevenue

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// controller method for top -selling orders

exports.getTopProducts = async (req, res) => {

    try {

        const topProducts = await Order.aggregate([

            {
                $match: {
                    status: {
                        $ne: "cancelled"
                    }
                }
            },

            // 1️⃣ items array ko separate documents mein convert karo
            {
                $unwind: "$items"
            },

            // 2️⃣ Same product ids ko group karo aur sold quantity add karo
            {
                $group: {
                    _id: "$items.product",
                    sold: {
                        $sum: "$items.quantity"
                    }
                }
            },

            // 3️⃣ Product collection se details lao
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },

            // 4️⃣ product array ko object mein convert karo
            {
                $unwind: "$product"
            },

            // 5️⃣ Sirf required fields return karo
            {
                $project: {
                    _id: 0,
                    productId: "$product._id",
                    name: "$product.name",
                    sold: 1
                }
            },

            // 6️⃣ Sabse zyada bikne wala product sabse upar
            {
                $sort: {
                    sold: -1
                }
            }

        ]);

        res.json({

            totalProducts: topProducts.length,

            products: topProducts

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};