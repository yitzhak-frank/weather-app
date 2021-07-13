import thunkMiddleware from 'redux-thunk';
import { favoritesReducer } from "./favorites_reducer";
import { applyMiddleware, createStore } from "redux";

const store = createStore(favoritesReducer, applyMiddleware(thunkMiddleware));

export default store;
