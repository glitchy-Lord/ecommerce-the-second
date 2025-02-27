import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { Carousel } from 'react-bootstrap';

import { getProductDetail, clearErrors } from '../../actions/productActions';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';

function numberWithCommas(x) {
	if (x) {
		return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	return 'Product Unavailable';
}

const ProductDetail = ({ match }) => {
	const dispatch = useDispatch();
	const alert = useAlert();

	const { loading, product, error } = useSelector(
		(state) => state.productDetail
	);

	useEffect(() => {
		dispatch(getProductDetail(match.params.id));

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
	}, [dispatch, match, alert, error]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<MetaData title={product.name} />
					<div className='row f-flex justify-content-around'>
						<div
							className='col-12 col-lg-5 img-fluid'
							id='product_image'>
							<Carousel pause='hover'>
								{product.images &&
									product.images.map((image) => (
										<Carousel.Item key={image.public_id}>
											<img
												src={image.url}
												alt={product.title}
												className='d-block w-100'
											/>
										</Carousel.Item>
									))}
							</Carousel>
						</div>
						<div className='col-12 col-lg-5 mt-5'>
							<h3>{product.name}</h3>
							<p id='product_id'>Product #{product._id}</p>
							<hr />
							<div className='rating-outer'>
								<div
									className='rating-inner'
									style={{
										width: `${
											(product.ratings / 5) * 100
										}%`,
									}}
								/>
							</div>
							<span id='no_of_reviews'>
								({product.numOfReview} Reviews)
							</span>
							<hr />
							<p id='product_price'>
								{numberWithCommas(product.price)}
							</p>
							<div className='stockCounter d-inline'>
								<span className='btn btn-danger minus'>-</span>
								<input
									type='number'
									className='form-control count d-inline'
									defaultValue={1}
									readOnly
								/>
								<span className='btn btn-primary plus'>+</span>
							</div>
							<button
								type='button'
								id='cart_btn'
								className='btn btn-primary d-inline ml-4'>
								Add to Cart
							</button>
							<hr />
							<p>
								Status:
								<span
									id='stock_status'
									className={
										product.stock > 0
											? 'greenColor'
											: 'redColor'
									}>
									{product.stock > 0
										? 'In Stock'
										: 'Out of Stock'}
								</span>
							</p>
							<hr />
							<h4 className='mt-2'>Description:</h4>
							<p>{product.description}</p>
							<hr />
							<p id='product_seller mb-3'>
								Sold by: <strong>{product.seller}</strong>
							</p>
							<button
								id='review_btn'
								type='button'
								className='btn btn-primary mt-4'
								data-toggle='modal'
								data-target='#ratingModal'>
								Submit Your Review
							</button>
							<div className='row mt-2 mb-5'>
								<div className='rating w-50'>
									<div
										className='modal fade'
										id='ratingModal'
										tabIndex={-1}
										role='dialog'
										aria-labelledby='ratingModalLabel'
										aria-hidden='true'>
										<div
											className='modal-dialog'
											role='document'>
											<div className='modal-content'>
												<div className='modal-header'>
													<h5
														className='modal-title'
														id='ratingModalLabel'>
														Submit Review
													</h5>
													<button
														type='button'
														className='close'
														data-dismiss='modal'
														aria-label='Close'>
														<span aria-hidden='true'>
															×
														</span>
													</button>
												</div>
												<div className='modal-body'>
													<ul className='stars'>
														<li class='star'>
															<i className='fa fa-star' />
														</li>
														<li className='star'>
															<i className='fa fa-star' />
														</li>
														<li className='star'>
															<i className='fa fa-star' />
														</li>
														<li className='star'>
															<i className='fa fa-star' />
														</li>
														<li className='star'>
															<i className='fa fa-star' />
														</li>
													</ul>
													<textarea
														name='review'
														id='review'
														className='form-control mt-3'
													/>
													<button
														className='btn my-3 float-right review-btn px-4 text-white'
														data-dismiss='modal'
														aria-label='Close'>
														Submit
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default ProductDetail;
