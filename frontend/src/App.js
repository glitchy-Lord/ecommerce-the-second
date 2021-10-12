import { Route } from 'react-router-dom';

import './App.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './components/Home';
import ProductDetail from './components/product/ProductDetail';

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function App() {
	return (
		<div className='App'>
			<Header />
			<div className='container container-fluid'>
				<Route path='/' component={Home} exact />
				<Route
					path='/product/:id'
					numberWithCommas={numberWithCommas}
					component={ProductDetail}
					exact
				/>
			</div>
			<Footer />
		</div>
	);
}

export default App;
