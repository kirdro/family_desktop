
import './App.css';
import AppRouter from './routes';
import {useInitialReq} from "./hooks/useInitialReq.ts";

function App() {
	useInitialReq()
	return <AppRouter />;
}

export default App;
