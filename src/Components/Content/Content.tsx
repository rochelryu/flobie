import React from 'react';
import {
  BrowserRouter as Router,
  Route,Switch,
  useRouteMatch
} from "react-router-dom";
import Dashboard from '../Dashboard/Dashboard';
import Reserve from '../Reserve/Reserve';
import MenuLeft from '../Components/MenuLeft/MenuLeft';
import './Content.scss'

// const PrivateRoute = ({component: Component, ...rest}) =>(
//   <Route {...rest} render={props => localStorage.getItem("authToken") ? (<Component {...props}/>) :
//       (<Redirect to={{pathname:'/auth',state:{from:props.location}}}/>)}/>);

function Content() {
  let { path, url } = useRouteMatch();
  return (
    <Router>
        <div>
          <MenuLeft url={url} />
              <div className="content-home">
              <Switch >
                
                <Route path={`${path}/reserve`} component={Reserve} />
                <Route exact path={path}  component={Dashboard} />
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
        </div>
          

    </Router>
    );
}

export default Content;
