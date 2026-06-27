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

// controller method api to get the reviews of the product that are given by the users
exports.getProductReviews = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id)
            .populate("reviews.user", "name email");

        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }

        res.json({

            averageRating: product.averageRating,

            numReviews: product.numReviews,

            reviews: product.reviews

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// conrroller method to delete the user;s own review 

exports.deleteMyReview = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }


        const review = product.reviews.find(

            review => review.user.toString() === req.user.userId

        );


        if (!review) {

            return res.status(404).json({

                message: "Review not found"

            });

        }


        product.reviews.pull(review._id);


        product.numReviews = product.reviews.length;


        if (product.numReviews === 0) {

            product.averageRating = 0;

        }

        else {

            product.averageRating = Number(

                (

                    product.reviews.reduce(

                        (sum, review) => sum + review.rating,

                        0

                    ) / product.numReviews

                ).toFixed(1)

            );

        }


        await product.save();


        res.json({

            message: "Review deleted successfully",

            product

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};