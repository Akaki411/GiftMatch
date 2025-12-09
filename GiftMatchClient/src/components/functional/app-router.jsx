import React, {useContext} from 'react';
import {Route, Navigate, Routes} from 'react-router-dom'
import {secureRoutes, publicRoutes} from "../../routes.jsx";
import {HOME_ROUTE} from "../../utils/consts.js";
import {Context} from "../../main.jsx";

const AppRouter = () => {
    const {user} = useContext(Context)
    return (
        <Routes>
            {["ADMIN", "MODER", "SUPPORT"].includes(user.role) && secureRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={Component} exact/>
            )}
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={Component} exact/>
            )}
            <Route path="*" element={<Navigate to={HOME_ROUTE} replace={true} />}/>
        </Routes>
    );
};

export default AppRouter;