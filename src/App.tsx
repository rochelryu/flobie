import React from 'react';
import { createBrowserHistory } from 'history';
import {
  Router,
  Route,Switch
} from "react-router-dom";
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import SignupScreen from './Components/Signup/SignupScreen'
import './App.scss';
import Signin from './Components/Signin/Signin';
import Content from './Components/Content/Content';

const history = createBrowserHistory();


function App() {
  const theme = (6 <= new Date().getHours() && new Date().getHours() <= 18) ? "content" : "contentNight";
  return (
    <Router history={history}>
          <Route render={({location})=>(
              <TransitionGroup>
                <CSSTransition key={location.key} timeout={300} classNames="my-node">
                  <div className={theme}>
                    <Switch location={location}>
                      <Route exact path="/signup" component={SignupScreen} />
                      <Route path="/signin" component={Signin} />
                      <Route path="/" component={Content} />
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
          )}/>

    </Router>
    );
}

export default App;