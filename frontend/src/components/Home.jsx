import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import { getProducts, clearErrors } from '../actions/productActions';
import MetaData from './layout/MetaData';
import Product from './product/Product';
import Loader from './layout/Loader';

const Home = () => {
	const dispatch = useDispatch();
	const alert = useAlert();

	const { loading, products, productCount, error } = useSelector(
		(state) => state.products
	);

	useEffect(() => {
		dispatch(getProducts());

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
	}, [dispatch, error, alert]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<MetaData title='Buy Best Products Online' />

					<h1 id='products_heading'>Latest Products</h1>

					<section id='products' className='container mt-5'>
						<div className='row'>
							{products &&
								products.map((product) => (
									<Product
										key={product._id}
										images={product.images}
										name={product.name}
										ratings={product.ratings}
										numOfReviews={product.numOfReviews}
										price={product.price}
										id={product._id}
									/>
								))}
						</div>
					</section>
				</>
			)}
		</>
	);
};

export default Home;
