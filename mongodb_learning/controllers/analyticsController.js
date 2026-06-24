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