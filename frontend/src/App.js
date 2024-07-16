import { useEffect, useState } from "react";
import Deals from "./components/Deals";
import Login from "./components/Login";

function App() {

	const [loggedIn, setLoggedIn] = useState(false)

	useEffect(() => {
		if (localStorage.getItem('token')) setLoggedIn(true)
	}, [])


	return (
		<div style={{padding: '12px'}}>
			{
				loggedIn ? <Deals/> : <Login/>
			}
		</div>
	);
}

export default App;
