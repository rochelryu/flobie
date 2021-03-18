import React, {useState} from 'react'
import {Container, Grid, Card, IconButton} from '@material-ui/core';
import logo from '../../Assets/Images/png/logo_transparent.png'
import welcome from '../../Assets/Images/svg/good people.svg'
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import TextInputField from '../Components/TextInputField/TextInputField';
import Buttons from '../Components/Buttons/Buttons';
import { message } from 'antd';
import { btn_color_primary } from '../../Constants/ClassName/Buttons';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import Links from '../Components/Links/Links';
import './Signin.scss';
import { Props } from '../../Interfaces/Props/Navigation';

function Signin(props: Props) {
    const [viewPassWord, setViewPassWord] = useState(false);
    const [numberHotel, changeNumberHotel] = useState('');
    const [password, changePassword] = useState('');



    const connection = async () => {
        if (!disabled) {
            message.loading("Connexion en cours")
            setTimeout(()=>{
                props.history.push('/home')
            }, 3000)
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
    const disabled =  (numberHotel.length === 8 && password.length > 3) ? false : true

    return (
        <div className="signin flexbox flex-center">
            <React.Fragment>
                    <Container maxWidth="md">
                        <Card raised={true}>
                            <Grid container spacing={3} style={{padding: 20}}>
                                <Grid item xs={3}>
                                    <img src={logo} className='logoApp-2x App-logo' alt='Logo' />
                                </Grid>
                                
                                <MegaTitleProps title='Connexion' size='md' />
                                <Grid item xs={7}>
                                    <Container>
                                        <Grid container>

                                            <Grid item xs={12} style={{paddingBottom: 20}}>
                                                <TextInputField
                                                    id='number'
                                                    className='numberHotel'
                                                    value={numberHotel}
                                                    required={true}
                                                    variant="outlined"
                                                    prefix='+225'
                                                    type='number'
                                                    label='Numéro de reception'
                                                    onChange={(e) => changeNumberHotel(e.target.value.toString())}
                                                />
                                                
                                            </Grid>
                                            <Grid item xs={12} style={{paddingBottom: 10}}>
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
                                                    label='Créer un mot de passe'
                                                    onChange={(e) => changePassword(e.target.value.toString())}
                                                />
                                            </Grid>
                                            <Grid item xs={12} style={{marginTop: 10}}>
                                                <Buttons
                                                    id='signup'
                                                    title="Se Connecter"
                                                    shape="round"
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

export default Signin;