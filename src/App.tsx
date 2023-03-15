import React, { FunctionComponent } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.scss";
import Signin from "./Components/Signin/Signin";
import Content from "./Components/Content/Content";
import SplashScreen from "./Components/SplashScreen/SplashScreen";
import { PrivateRoute } from "./Components/PrivateRoute/PrivateRoute";

const App: FunctionComponent = () => {
  const theme = new Date().getFullYear() > 18 ? "content" : "contentNight";
  return (
    <Router>
      <TransitionGroup>
        <CSSTransition timeout={300} classNames="my-node">
          <div className={theme}>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/signin" element={<Signin />} />
              <Route
                path="/home/*"
                element={
                  <PrivateRoute>
                    <Content />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Router>
  );
};

export default App;
