import {
	ALL_PRODUCTS_REQUEST,
	ALL_PRODUCTS_SUCCESS,
	ALL_PRODUCTS_FAIL,
	CLEAR_ERRORS,
	PRODUCT_DETAIL_REQUEST,
	PRODUCT_DETAIL_SUCCESS,
	PRODUCT_DETAIL_FAIL,
} from '../constants/productConstants';

export const productReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case ALL_PRODUCTS_REQUEST:
			return {
				loading: true,
				products: [],
			};

		case ALL_PRODUCTS_SUCCESS:
			return {
				loading: false,
				products: action.payload.products,
				productCount: action.payload.productCount,
			};

		case ALL_PRODUCTS_FAIL:
			return {
				loading: false,
				error: action.payload,
			};

		case CLEAR_ERRORS:
			return {
				...state,
				error: null,
			};

		default:
			return state;
	}
};

export const productDetailReducer = (state = { product: {} }, action) => {
	switch (action.type) {
		case PRODUCT_DETAIL_REQUEST: {
			return {
				loading: true,
				product: {},
				// ...state,
			};
		}

		case PRODUCT_DETAIL_SUCCESS: {
			return {
				loading: false,
				product: action.payload.product,
				// product: action.payload,
			};
		}

		case PRODUCT_DETAIL_FAIL: {
			return {
				loading: false,
				error: action.payload,
				// ...state,
			};
		}

		case CLEAR_ERRORS:
			return {
				...state,
				error: null,
			};

		default:
			return state;
	}
};
