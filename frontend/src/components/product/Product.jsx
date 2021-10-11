import React from 'react';
import { Link } from 'react-router-dom';

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const Product = ({ images, name, ratings, numOfReviews, price, id }) => {
	return (
		<div className='col-sm-12 col-md-6 col-lg-3 my-3'>
			<div className='card p-3 rounded'>
				<img
					alt=''
					className='card-img-top mx-auto'
					src={images[0].url}
				/>
				<div className='card-body d-flex flex-column'>
					<h5 className='card-title'>
						<Link to={`/product/${id}`}>{name}</Link>
					</h5>
					<div className='ratings mt-auto'>
						<div className='rating-outer'>
							<div
								className='rating-inner'
								style={{
									width: `${(ratings / 5) * 100}%`,
								}}
							/>
						</div>
						<span id='no_of_reviews'>({numOfReviews} Reviews)</span>
					</div>
					<p className='card-text'>${numberWithCommas(price)}</p>
					<Link
						to={`/product/${id}`}
						id='view_btn'
						className='btn btn-block'>
						View Details
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Product;
