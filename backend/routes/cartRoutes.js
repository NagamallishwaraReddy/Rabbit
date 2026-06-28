const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get cart by User ID or Guest ID
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// @route POST /api/cart
// @desc Add a product to cart
// @access Public
router.post("/", async (req, res) => {
    try {
        const { productId, quantity, size, color, guestId, userId } = req.body;

        const qty = Number(quantity);

        const product = await Product.findById(productId);
        console.log("Product from DB:", product);
        console.log("Product Price:", product?.price);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(
                (item) =>
                    item.productId.toString() === productId &&
                    item.size === size &&
                    item.color === color
            );

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += qty;
            } else {
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || "",
                    price: product.price,
                    size,
                    color,
                    quantity: qty,
                });
            }

            cart.totalPrice = cart.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            await cart.save();

            return res.status(200).json(cart);
        }

        cart = new Cart({
            user: userId || undefined,
            guestId: guestId || `guest_${Date.now()}`,
            products: [
                {
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || "",
                    price: product.price,
                    size,
                    color,
                    quantity: qty,
                },
            ],
            totalPrice: product.price * qty,
        });

        await cart.save();

        return res.status(201).json(cart);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message,
        });
    }
});
//@route PUT /api/cart
//@desc Update product quantity in the cart
//@access Public
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        const cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart",
            });
        }

        if (Number(quantity) > 0) {
            cart.products[productIndex].quantity = Number(quantity);
        } else {
            cart.products.splice(productIndex, 1);
        }

        cart.totalPrice = cart.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        await cart.save();

        return res.status(200).json(cart);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
});
//@route DELETE /api/cart
//@desc Remove a product from the cart
//@access Public
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        // Get the cart
        const cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart",
            });
        }

        // Remove the product
        cart.products.splice(productIndex, 1);

        // Recalculate total price
        cart.totalPrice = cart.products.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});
//@route PUT /api/cart/merge
//@desc Merge guest cart into logged-in user's cart
//@access Public
router.post("/merge", async (req, res) => {
    const { guestId } = req.body;

    try {

        const guestCart=await Cart.findOne({guestId});
        const userCart=await Cart.findOne({user:req.user._id});
     if(guestCart){
        if(guestCart.products.length===0){
            return res.status(400).json({message:"Guest card is empty"});
        }
        if(userCart){
            guestCart.products.forEach((guestItem)=>{
                const productIndex=userCart.products.findIndex((item)=>
                item.productId.toString()===guestItem.productId.toString()&&
                 item.size===guestItem.size&& item.color===guestItem.color
                
                );
                if(productIndex>-1){
                    userCart.products[productIndex].quantity+=guestItem.quantity;
                }
                else{
                    user.Cart.products.push(guestItem);
                }
             });
          userCart.totalPrice=userCart.products.reduce((acc,item)=> acc+item.price*item.quantity,0
             );
             await userCart.save();
             try{
                await Cart.findOneAndDelete({guestId});

             }catch (error){
                console.error("Error deleting guest cart:",error);

             }
             res.status(200).json(userCart);
            }else{
                guestCart.user=req.user._id;
                guestCart.guestId=undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
    }else{
        if(userCart){
            return res.status(200).json(userCart);
        }
        res.status(404).json({message:"Guest Card not found"});
    }

}catch(error){ 
    console.error(error);
    res.status(500).json({message:"Server Error"});
}
});

module.exports = router;