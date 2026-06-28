import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          params: { userId, guestId },
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);
// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Update Cart Item
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { productId, quantity, guestId, userId, size, color },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          guestId,
          userId,
          size,
          color,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    { productId, guestId, userId, size, color },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        data: {
          productId,
          guestId,
          userId,
          size,
          color,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Merge Guest Cart into User Cart
export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async ({ guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        {
          guestId,
          userId,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },

  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })

      // Add To Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add item to cart";
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update cart";
      })

      // Remove From Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove item";
      })

      // Merge Guest Cart
      .addCase(mergeGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;