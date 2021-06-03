import { Typography, CircularProgress } from "@material-ui/core";
import * as React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import configureStore from "./configureStore";

const { persistor, store } = configureStore();

export function ReduxRoot() {
	return (
		<Provider store={store}>
			<PersistGate
				loading={
					<div style={{ width: '100%', display: 'flex', marginTop: 50, justifyContent: 'center' }}>
						<CircularProgress />
					</div>}
				persistor={persistor}
			>
				<App />
			</PersistGate>
		</Provider>
	);
}
