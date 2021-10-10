import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import { Route } from 'react-router-dom';

import './App.css';

function App() {
	return (
		<div className='App'>
			<Header />
			<div className='container container-fluid'>
				<Route path='/' component={Home} exact />
			</div>
			<Footer />
		</div>
	);
}

export default App;
