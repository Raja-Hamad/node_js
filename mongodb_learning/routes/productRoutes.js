const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");

const orderController = require("../controllers/orderController");

const analyticsController = require("../controllers/analyticsController");
const reviewsController = require("../controllers/reviewsController");


const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/upload");

// Public
router.get("/", authMiddleware, productController.myProducts);

// Protected (any logged-in user)
router.post(
    "/create",
    authMiddleware,
    upload.array("images", 5),
    productController.createProduct
);
// 🔥 Admin only
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    productController.deleteProduct
);

// for adding the more images into the existing product

router.put(
    "/:id/add-images",
    authMiddleware,
    upload.array("images", 5),
    productController.addImagesToProduct
);

// for deleting the specific image from the existing product
router.delete(
    "/:id/image/:imageId",
    authMiddleware,
    productController.deleteProductImage
);
router.post(
    "/cart/add",
    authMiddleware,
    cartController.addToCart
);
router.get(
    "/cart/get",
    authMiddleware,
    cartController.getCart
);
router.delete(
    "/cart/item/:productId",
    authMiddleware,
    cartController.removeItem
);

// route for place order of cart Items POST API

router.post(
    "/order/place",
    authMiddleware,
    orderController.placeOrder
);

// route for get current user orders GET API
router.get(
    "/order/my-orders",
    authMiddleware,
    orderController.getMyOrders
);

// restricted route of get all the orders of all users by admin


router.get(
    "/order/all",
    authMiddleware,
    adminMiddleware,
    orderController.getAllOrders
);


router.put(
    "/order/:id/status",
    authMiddleware,
    adminMiddleware,
    orderController.updateOrderStatus
);

// route to cancel the order by admin or by the user who creeated that order

router.put(
    "/order/:id/cancel",
    authMiddleware,
    orderController.cancelOrder
);

// route for GET API for dashboard analytics for admin only dashboard

router.get(

    "/admin/analytics",

    authMiddleware,

    adminMiddleware,

    analyticsController.getAnalytics

);

// route for getting top-selling products by Admin
router.get(

    "/admin/top-products",

    authMiddleware,

    adminMiddleware,

    analyticsController.getTopProducts

);

// route or getting the revenues of the orders by months by Admin

router.get(

    "/admin/monthly-revenue",

    authMiddleware,

    adminMiddleware,

    analyticsController.getMonthlyRevenue

);

// route to add the reviews to the product
router.post(

    "/:id/review",

    authMiddleware,

    reviewsController.addReview

);
module.exports = router;



