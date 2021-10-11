import React, { useEffect } from 'react';
import MetaData from './layout/MetaData';

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import { getProducts } from '../actions/productActions';
import Product from './product/Product';
import Loader from './layout/Loader';

const Home = () => {
	const dispatch = useDispatch();
	const alert = useAlert();

	const { loading, products, productCount, error } = useSelector(
		(state) => state.products
	);

	console.log(error);

	useEffect(() => {
		if (error) {
			alert.success('Success');
			return alert.error(error);
		}

		dispatch(getProducts());
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
