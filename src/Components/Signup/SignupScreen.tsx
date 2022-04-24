import React, {useState} from 'react'
import {Container, Grid, Card, IconButton} from '@mui/material';
import logo from '../../Assets/Images/png/logo_transparent.png';
import welcome from '../../Assets/Images/svg/welcome.svg';
import './SignupScreen.scss';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import TextInputField from '../Components/TextInputField/TextInputField';
import Buttons from '../Components/Buttons/Buttons';
import { message } from 'antd';
import { btn_color_primary } from '../../Constants/ClassName/Buttons';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import { ConsumeApi } from '../../ServiceWorker/ConsumeApi';
import { Etat } from '../../Constants/Enum';











function SignupScreen() {
    const consumeApi: ConsumeApi = new ConsumeApi();
    const [viewPassWord, setViewPassWord] = useState<boolean>(false);
    const [password, changePassword] = useState<string>('');
    const [newPassword, changeNewPassword] = useState<string>('');

    
    const connection = async () => {
        
        if (!disabled) {
            message.loading("Connexion en cours")
            .then(async () => {
                const info = await consumeApi.changePassword(password, newPassword);
                if(info.etat === Etat.SUCCESS) {
                    localStorage.setItem('recovery', info.result.recovery);
                    message.success("Mot de passe changé avec succès");
                    changeNewPassword('');
                    changePassword('');
                } else {
                    message.error(info.error, 7);
                }
            })
            
            
        }
        else {
            message.error("Rassurez vous que votre numero est dans le bon format")
        }
        
    }

   
    const handleClickShowPassword = () => {
        const oldViewPassWord = viewPassWord
        setViewPassWord(!oldViewPassWord)
      };
    
      const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };
    const disabled =  !(newPassword.length >= 6 && password.length >= 6 && newPassword !== password)


    return (
        <div className="signup_screen flexbox flex-center">
            <React.Fragment>
                    <Container maxWidth="md">
                        <Card raised={true}>
                            <Grid container spacing={3} style={{padding: 20}}>
                                <Grid item xs={3}>
                                    <img src={logo} className='logoApp-2x App-logo' alt='Logo' />
                                </Grid>
                                
                                <MegaTitleProps title='Change Password' size='md' />
                                <Grid item xs={7}>
                                    <Container>
                                        <Grid container>
                                        <Grid item xs={12} style={{paddingBottom: 40}}>
                                            <TextInputField
                                                    id='password'
                                                    className='passwordHotel'
                                                    value={password}
                                                    required={true}
                                                    variant="outlined"
                                                    suffix={
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {!viewPassWord ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    }
                                                    type={viewPassWord ? 'text' : 'password'}
                                                    label='Ancien mot de passe'
                                                    onChange={(e) => changePassword(e.target.value.toString())}
                                                />
                                            </Grid>
                                            <Grid item xs={12} style={{paddingBottom: 10}}>
                                            <TextInputField
                                                    id='newPassword'
                                                    className='passwordHotel'
                                                    value={newPassword}
                                                    required={true}
                                                    variant="outlined"
                                                    suffix={
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {!viewPassWord ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    }
                                                    type={viewPassWord ? 'text' : 'password'}
                                                    label='Nouveau mot de passe'
                                                    onChange={(e) => changeNewPassword(e.target.value.toString())}
                                                />
                                            </Grid>
                                           
                                            
                                            <Grid item xs={12} style={{marginTop: 10}}>
                                                <Buttons
                                                    id='signup'
                                                    title="S'enregistrer"
                                                    shape="round"
                                                    block={false}
                                                    className={!disabled ? btn_color_primary : ''}
                                                    disabled={disabled}
                                                    onClick={connection}
                                                 />
                                            </Grid>
                                            
                                        </Grid>
                                    </Container>
                                    
                                </Grid>
                                <Grid item xs={5}>
                                    <div className="flexbox flex-center">
                                        <img src={welcome} className='imgWelcome' alt='welcome' />
                                    </div>
                                </Grid>
                        </Grid>
                        </Card>
                    </Container>
            </React.Fragment>
        </div>
    );
}


export default SignupScreen;