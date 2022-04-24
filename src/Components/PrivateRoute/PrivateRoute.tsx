import React from 'react';
import {
  Navigate,
  useLocation
} from "react-router-dom";



export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  let location = useLocation();
  const recovery = localStorage.getItem('recovery');
    if(recovery) return children;
    return <Navigate to="/signin" state={{ from: location }} />;
};