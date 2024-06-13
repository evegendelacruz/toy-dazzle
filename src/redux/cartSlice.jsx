import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

// Define the initial state of the cart, retrieving it from localStorage if available
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingInformation: {}, paymentMethod: "COD" };

export const cartSlice = createSlice({
  name: "cart", // Specify the name of the slice
  initialState, // Set the initial state
  reducers: {
    // Reducer for adding items to the cart
    addToCart(state, action) {
      // Retrieve the new item from the action payload
      const newItem = action.payload;
      // Check if the item is already in the cart
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );
      // If the item exists, update its quantity and price
      if (existingItem) {
        // If the item with the same ID , update its quantity
        state.cartItems = state.cartItems.map((item) =>
          item.id === existingItem.id
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
                price: (item.quantity + newItem.quantity) * newItem.price,
              }
            : item
        );
      } else {
        // If the item is not in the cart, add it with quantity and price
        state.cartItems = [
          ...state.cartItems,
          {
            ...newItem,
            price: newItem.price * newItem.quantity,
            isEditing: false,
          },
        ];
      }

      // Update the cart after modifying the items
      return updateCart(state);
    },
    // Reducer for increasing item quantity in the cart
    increaseQuantity(state, action) {
      const { id } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              price: item.price + item.price / item.quantity,
            }
          : item
      );
      return updateCart(state);
    },
    // Reducer for decreasing item quantity in the cart
    decreaseQuantity(state, action) {
      const { id } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              price: item.price - item.price / item.quantity,
            }
          : item
      );
      return updateCart(state);
    },
    // Reducer for toggling edit mode for item quantity in the cart
    toggleEditQuantity(state, action) {
      const { id } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              isEditing: !item.isEditing, // Toggle the isEditing property
            }
          : item
      );
    },
    // Reducer for removing an item from the cart
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((item) => !(item.id === id));

      // Check if the cart is empty after removing the item
      if (state.cartItems.length === 0) {
        state.cartItems = [];
        state.itemsPrice = null;
        state.shippingPrice = null;
        state.totalPrice = null;
        state.subtotal = null;
        localStorage.removeItem("cart");
      } else {
        // If the cart is not empty, update the cart prices
        updateCart(state);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  toggleEditQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
