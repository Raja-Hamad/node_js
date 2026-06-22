const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/upload");

// Public
router.get("/", authMiddleware,productController.myProducts);

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
    productController.addToCart
);
router.get(
    "/cart/get",
    authMiddleware,
    productController.getCart
);
router.delete(
    "/cart/item/:productId",
    authMiddleware,
    productController.removeItem
);

module.exports = router;