import React, { useEffect } from 'react';
import MetaData from './layout/MetaData';

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import Product from './product/Product';

const Home = () => {
	const dispatch = useDispatch();

	const { loading, products, productCount, error } = useSelector(
		(state) => state.products
	);

	useEffect(() => {
		dispatch(getProducts());
	}, [dispatch]);

	return (
		<>
			{loading ? (
				<h1>Loading...</h1>
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
