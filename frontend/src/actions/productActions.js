import axios from 'axios';

import {
	ALL_PRODUCTS_REQUEST,
	ALL_PRODUCTS_SUCCESS,
	ALL_PRODUCTS_FAIL,
	CLEAR_ERRORS,
	PRODUCT_DETAIL_REQUEST,
	PRODUCT_DETAIL_SUCCESS,
	PRODUCT_DETAIL_FAIL,
} from '../constants/productConstants';

export const getProducts = () => async (dispatch) => {
	try {
		dispatch({ type: ALL_PRODUCTS_REQUEST });

		const { data } = await axios.get('/api/products');

		dispatch({
			type: ALL_PRODUCTS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: ALL_PRODUCTS_FAIL,
			payload: error.response.data.errMessage,
		});
	}
};

export const getProductDetail = (id) => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_DETAIL_REQUEST });

		const { data } = await axios.get(`/api/product/${id}`);

		dispatch({
			type: PRODUCT_DETAIL_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAIL_FAIL,
			payload: error.response.data.errMessage,
		});
	}
};

//* Clear errors
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};
