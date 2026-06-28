const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Checkout = require("../models/Checkout");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   POST /api/orders
// @desc    Create order from checkout
// @access  Private
router.post("/", protect, async (req, res) => {
    try {
        const { checkoutId } = req.body;

        const checkout = await Checkout.findById(checkoutId);

        if (!checkout) {
            return res.status(404).json({
                message: "Checkout not found",
            });
        }

        const order = new Order({
            user: checkout.user,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: checkout.isPaid,
            paidAt: checkout.paidAt,
            paymentStatus: checkout.paymentStatus,
        });

        const createdOrder = await order.save();

        await Checkout.findByIdAndDelete(checkoutId);

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get("/my-orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by id
// @access  Private
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
});

// @route   PUT /api/orders/:id/pay
// @desc    Mark order as paid
// @access  Private
router.put("/:id/pay", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.isPaid = true;
        order.paymentStatus = "Paid";
        order.paidAt = Date.now();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
});

// @route   PUT /api/orders/:id/deliver
// @desc    Mark order as delivered
// @access  Private/Admin
router.put("/:id/deliver", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = "Delivered";

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
});

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;