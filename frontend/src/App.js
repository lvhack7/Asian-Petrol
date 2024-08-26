import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DealsPage from './pages/DealsPage';
import { ReferencePage } from './pages/ReferencePage';
import Layout from './components/Layout';
import PassportPage from './pages/PassportPage';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout/>}>
					<Route index element={<DealsPage/>} />
					<Route path='reference' element={<ReferencePage/>} />
					<Route path='passport' element={<PassportPage/>} />
				</Route>
				<Route path="login" element={<LoginPage/>} />
				<Route path='*' element={<Navigate to='login' />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;