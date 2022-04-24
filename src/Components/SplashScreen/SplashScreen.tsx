import React, {useEffect} from 'react';
import './SplashScreen.scss';
import { Props } from '../../Interfaces/Props/Navigation';
import { useNavigate } from "react-router-dom";
function SplashScreen(props: Props) {
    let navigate = useNavigate();
    const recovery = localStorage.getItem('recovery');
    useEffect(() => {
        setTimeout(() => {
            if(recovery) {
                navigate('/home');
            } else { navigate('/signin'); }
        }, 5000);
    }, [])
    return (
        <div className="box splashScreen">
            <div className="relative">
                <h1>FINDER CLIENT</h1>
            </div>
            <h4 className="absolute madeBy">Par ICORE</h4>
            
            
            {/* <div className="wave"></div>
            <div className="wave1"></div>
            <div className="wave2"></div>
            <div className="wave3"></div> */}
        </div>
    )
}

export default SplashScreen;