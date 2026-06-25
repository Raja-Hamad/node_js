const Product = require("../models/Product");

exports.addReview = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        const { rating, comment } = req.body;

        const existingReview = product.reviews.find(

            review => review.user.toString() === req.user.userId

        );

        if (existingReview) {

            existingReview.rating = rating;
            existingReview.comment = comment;

        } else {

            product.reviews.push({

                user: req.user.userId,

                rating,

                comment

            });

        }

        product.numReviews = product.reviews.length;

        product.averageRating = (

            product.reviews.reduce(

                (sum, review) => sum + review.rating,

                0

            ) / product.reviews.length

        );

        await product.save();

        res.json({

            message: existingReview
                ? "Review updated successfully"
                : "Review added successfully",

            product

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};