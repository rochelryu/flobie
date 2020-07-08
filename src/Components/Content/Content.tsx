import React from 'react';
import { createBrowserHistory } from 'history';
import {
  Router,
  Route, Switch, useRouteMatch
} from "react-router-dom";
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import Dashboard from '../Dashboard/Dashboard'
import MenuLeft from '../Components/MenuLeft/MenuLeft';
import './Content.scss'

const history = createBrowserHistory();
// const PrivateRoute = ({component: Component, ...rest}) =>(
//   <Route {...rest} render={props => localStorage.getItem("authToken") ? (<Component {...props}/>) :
//       (<Redirect to={{pathname:'/auth',state:{from:props.location}}}/>)}/>);

function Content() {
  let { path, url } = useRouteMatch();
  return (
    <Router history={history}>
        <div>
        <MenuLeft url={url} />
          <Route render={({location})=>(
              <TransitionGroup>
                <CSSTransition key={location.key} timeout={300} classNames="my-node">
                  <div className="content-home">
                    <Switch location={location} >
                      <Route exact path={`${path}/`} component={Dashboard} />
                      <Route exact path={`${path}/home`} component={Dashboard} />
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
        </div>
          

    </Router>
    );
}

export default Content;
