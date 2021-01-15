import React from 'react';
import {
  Redirect,
  Route
} from "react-router-dom";



export const PrivateRoute = ({component, isAuthenticated, ...rest}: any) => {
    const routeComponent = (props: any) => (
        1 === 1
            ? React.createElement(component, props)
            : <Redirect to={{pathname: '/signin'}}/>
    );
    return <Route {...rest} render={routeComponent}/>;
};