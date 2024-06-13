export const updateCart = (state) => {
  // Calculate Items Price
  state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price, 0);

  // Calculate Subtotal Price
  state.subtotal = state.itemsPrice - 250;

  // Calculate Shipping Price (If order is over ₱450 then free, else ₱100 shipping fee)
  state.shippingPrice = state.itemsPrice > 450 ? 0 : 100;

  // Calculate Total Price
  state.totalPrice = state.subtotal + state.shippingPrice;

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
