const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");

const orderController = require("../controllers/orderController");


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
module.exports = router;


// restricted route of get all the orders of all users by admin


router.get(
    "/all",
    authMiddleware,
    adminMiddleware,
    orderController.getAllOrders
);


router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    orderController.updateOrderStatus
);

