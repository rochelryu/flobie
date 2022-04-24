import React, {useEffect} from 'react';
import {
  Route,Routes, useNavigate
} from "react-router-dom";
import Dashboard from '../Dashboard/Dashboard';
import Reserve from '../Reserve/Reserve';
import MenuLeft from '../Components/MenuLeft/MenuLeft';
import './Content.scss'
import DashboardAdmin from '../DashboardAdmin/DashboardAdmin';
import AddActuality from '../AddActuality/AddActuality';
import EmployerDash from '../EmployerDash/EmployerDash';
import AdminCovoiturage from '../AdminCovoiturage/AdminCovoiturage';
import MobilePayement from '../MobilePayement/MobilePayement';
import EmployerCovoiturage from '../EmployerCovoiturage/EmployerCovoiturage';
import SignupScreen from '../Signup/SignupScreen';

// const PrivateRoute = ({component: Component, ...rest}) =>(
//   <Route {...rest} render={props => localStorage.getItem("authToken") ? (<Component {...props}/>) :
//       (<Redirect to={{pathname:'/auth',state:{from:props.location}}}/>)}/>);

function Content() {

  return (
        <div>
          <MenuLeft />
              <div className="content-home">
              <Routes >
                <Route path={'/'}  element={<Dashboard />} /> {/* Route Supper Admin */}
                <Route path={'/mobilepayement'}  element={<MobilePayement />} /> {/* Route Supper Admin */}
                <Route path={'/actuality'} element={<DashboardAdmin />} /> {/* Route Admin Actualite */}
                <Route path={'/dealsEmployer'} element={<EmployerDash />} /> {/* Route employer Deals */}
                <Route path={'/covoiturage'} element={<AdminCovoiturage />} /> {/* Route Admin Covoiturage */}
                <Route path={'/actualityEmployer'} element={<AddActuality />} />{/* Route employer Actualite */}
                <Route path={'/covoiturageEmployer'} element={<EmployerCovoiturage />} />{/* Route employer Actualite */}
                <Route path={'/reserve'} element={<Reserve />} />
                <Route path={'/setting'} element={<SignupScreen />} />
                <Route path={'/logout'} element={<Logout />} />
                
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

              </Routes>
            </div>
        </div>
          

    );
}
function Logout() {
  let navigate = useNavigate();
  useEffect(()=>{
    localStorage.clear();
    navigate('/signin');
  }, [])

  return(<></>)
}

export default Content;
