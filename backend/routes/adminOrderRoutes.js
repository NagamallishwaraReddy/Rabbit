const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/admin/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get("/admin/orders", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
/*
@route   PUT /api/admin/orders/:id
@desc    Update order status (Admin only)
@access  Private/Admin
*/
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // update status
    if (status) {
      order.status = status;
    }

    // if delivered
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
/*
@route   PUT /api/admin/orders/:id
@desc    Update order status (Admin only)
@access  Private/Admin
*/
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // update status
    if (status) {
      order.status = status;
    }

    // if delivered
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});


module.exports = router;