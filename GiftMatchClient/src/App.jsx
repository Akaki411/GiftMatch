import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/functional/app-router.jsx"

function App()
{
    return (
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    );
}

export default App;