import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/app-router.jsx"

function App()
{
    return (
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    );
}

export default App;