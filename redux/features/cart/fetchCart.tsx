import { createSlice } from "@reduxjs/toolkit";
import { getCartItems } from "../../../graphql/customer";
import { Cart } from "../../../Typescript/types";
import { graphQLClient } from "../../../utils/client";

export interface IinitialState {
  cart: Cart[];
  cartLength: number;
  loading: boolean;
  error: string;
}

let initialState: IinitialState = {
  cart: [],
  cartLength: 0,
  loading: true,
  error: "",
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCart(state, action: { payload: Cart[]; type: string }) {
      let data = action.payload;
      state.cart = data;
      state.cartLength = data.length;
      state.loading = false;
    },
    errorResponse(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default cartSlice.reducer;
export const { getCart, errorResponse } = cartSlice.actions;

// get cart items thunk
export function cartItems(Token) {
  return async (dispatch) => {
    try {
      if (Token) {
        graphQLClient.setHeader("authorization", `bearer ${Token}`);
      }
      const res = await graphQLClient.request(getCartItems);
      const data: Cart[] = res.getCartItems;
      if (data) {
        dispatch(getCart(data));
      }
    } catch (err) {
      let error = err?.response?.errors[0].message || err.message;
      if (Token && err) {
        dispatch(errorResponse(error));
      }
      if (err.message === "Network request failed") {
        dispatch(errorResponse(error));
      }
      if (error === "jwt must be provided" || error === "You have to Log In") {
        dispatch(errorResponse(error));
      }
    }
  };
}
