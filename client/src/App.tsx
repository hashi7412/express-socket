import React from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import useStore from './useStore';

import SignIn from './pages/auth/SignIn';

function App() {
	const { account } = useStore();

	return (
		<>
			<BrowserRouter>
				<Switch>
					{account ? (
						<>
							<Route exact path="/" component={SignIn} />
						</>
					) : (
						<>
							<Route path="/reset" exact component={SignIn} />
							<Route path="/*" component={SignIn} />
						</>
					)}
				</Switch>
			</BrowserRouter>
			{/* <ToastContainer /> */}
		</>
	);
}

export default App;
