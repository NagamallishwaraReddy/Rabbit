const express = require("express");
const router = express.Router();

const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

// Create Checkout
router.post("/", protect, async (req, res) => {
  try {
    const {
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
      return res.status(400).json({
        message: "No items in checkout",
      });
    }

    const checkout = new Checkout({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    const createdCheckout = await checkout.save();

    await Cart.findOneAndDelete({
      user: req.user._id,
    });

    res.status(201).json(createdCheckout);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Pay Checkout
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    checkout.isPaid = true;
    checkout.paymentStatus = req.body.paymentStatus || "Paid";
    checkout.paymentDetails = req.body.paymentDetails || {};
    checkout.paidAt = new Date();

    const updatedCheckout = await checkout.save();

    res.json(updatedCheckout);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Finalize Checkout
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({
        message: "Payment not completed",
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

    checkout.isFinalized = true;
    checkout.finalizeAt = new Date();

    await checkout.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;