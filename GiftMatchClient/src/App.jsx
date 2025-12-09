import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/functional/app-router.jsx"
import {useContext, useEffect, useState} from "react";
import {Context} from "./main.jsx";
import {check} from "./http/auth-api.js";
import {BarLoader} from "react-spinners";
import {observer} from "mobx-react-lite";

const App = observer(() =>
{
    const {user} = useContext(Context)
    const [loader, setLoader] = useState(true)
    const [auth, setAuth] = useState(false)

    useEffect(() => {
        if(auth) return
        setAuth(true)
        check().then(response => {
            if (response.data?.isValid)
            {
                const userData = JSON.parse(localStorage.getItem("user"))
                user.setUser(userData)
                user.setIsAuth(true)
                user.setRole(userData.role)
            }
        }).catch().finally(() => {
            setAuth(false)
            setLoader(false)
        })
    }, [])

    if(loader)
    {
        return (
            <div className="client-wrapper center">
                <BarLoader/>
            </div>
        )
    }
    return (
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    )
})

export default App;