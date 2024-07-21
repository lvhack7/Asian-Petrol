import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DealsPage from './pages/DealsPage';

const App = () => {
  return (
	<BrowserRouter>
		<Routes>
			<Route path="/login" element={<LoginPage/>} />
			<Route path="/deals" element={<DealsPage/>} />
			<Route path="/" element={<LoginPage/>} />
		</Routes>
	</BrowserRouter>
  );
};

export default App;