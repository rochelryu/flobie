import React, {FunctionComponent} from 'react';
import {
  BrowserRouter as Router,
  Route,Switch,
} from "react-router-dom";
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import SignupScreen from './Components/Signup/SignupScreen'
import './App.scss';
import Signin from './Components/Signin/Signin';
import Content from './Components/Content/Content';
import SplashScreen from './Components/SplashScreen/SplashScreen';
import {
  PrivateRoute
} from './Components/PrivateRoute/PrivateRoute';


const App:FunctionComponent = () =>{
  const theme = new Date().getFullYear() > 18 ? 'content' : 'contentNight'
  return (
    <Router>
          
              <TransitionGroup>
                <CSSTransition timeout={300} classNames="my-node">
                  <div className={theme}>
                    <Switch>
                      
                      <Route exact path="/" component={SplashScreen} />
                      <Route path="/signup" component={SignupScreen} />
                      <Route path="/signin" component={Signin} />
                      <PrivateRoute path='/home'  component={Content} />
                      {/* <Route path="/" component={SplashScreen} /> */}
                      {/* <Route path="*">
                          <Redirect to="/signin" />
                      </Route> */}
                      {/* <Route path="/pannier" component={PannierScreen} />
                      <Route path="/auth/:handle" component={AuthScreen} />
                      <Route path="/auth" component={AuthScreen} />
                      <Route path="/details/:handle" component={DetailScreen} />
                      <Route path="/catalog/:handle" component={ProductScreen} />
                      <Route path="/valid" component={ValidScreen} />
                      <Route path="/checkout" component={CheckOut} />
                      <Route path="/search" component={SearcScreen} />
                      <Route path="/Enchere" component={BidScreen} />
                      <PrivateRoute path="/profil" component={ProfilUserScreen} />
                      <Route path="/404" component={NotFoundScreen} />
                      <Route component={NotFoundScreen} /> */}

                    </Switch>
                  </div>
                </CSSTransition>
              </TransitionGroup>
          

    </Router>
    );
}

export default App;