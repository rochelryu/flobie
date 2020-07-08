import React, {useState} from 'react'
import {Container, Grid, Card, IconButton} from '@material-ui/core';
import logo from '../../logo.svg'
import welcome from '../../Assets/Images/svg/welcome.svg'
import './SignupScreen.scss'
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import TextInputField from '../Components/TextInputField/TextInputField';
import Buttons from '../Components/Buttons/Buttons';
import { Rate, message, notification } from 'antd';
import { colorPrimary } from '../../Constants/color';
import { PushpinTwoTone, SmileTwoTone } from '@ant-design/icons';
import { btn_color_primary } from '../../Constants/ClassName/Buttons';
import CheckBoxs from '../Components/CheckBox/CheckBoxs';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import Links from '../Components/Links/Links';











function SignupScreen() {
    const labels = ["J'accepte que mes données soient utilisées à des fins de verification de mon identité"]

    const [name, changeName] = useState('');
    const [viewPassWord, setViewPassWord] = useState(false);
    const [numberHotel, changeNumberHotel] = useState('');
    const [password, changePassword] = useState('');
    const [numberLotis, changeNumberLotis] = useState('');


    const [etoile, changeEtoile] = useState(0)
    const [checbox, changeChecbox] = useState({
        contrat:false
    })
    const [location, setLocation] = useState({latitude: 0, longitude: 0})

    const getLocation = async () => {
        await navigator.geolocation.getCurrentPosition((position) => { 
           const {latitude, longitude} = position.coords
           setLocation({latitude, longitude})
           message.success("Nous avons pu vous localiser. Vous pouvez continuer", 4000)
         }, (error) => { 
            message.error("Veuillez vous assurer que votre connexion internet est fonctionnelle")
            })
    }
    
    const connection = async () => {
        
        if(location.latitude === 0) {
            message.error("Veuillez cliquer sur le boutton de localisation D'abord")
        }
        else if (!contrat) {
            message.warning("Veuillez cocher la case de notre contrat d'utilisation D'abord")
        } else if (!disabled) {
            message.loading("Votre processus d'enregistrement est en cours")
            setTimeout(()=> {
                notification.info({
                    message: `Dossier enregistré`,
                    description:
                      "L'unité de sécurité la plus proche est chargé de valider votre demande",
                    icon: <SmileTwoTone twoToneColor={colorPrimary} />,
                    placement: 'topLeft'
                  });
            }, 3000)
        }
    }

    const onChecked = async ( event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.name, event.target.checked)
        changeChecbox({ ...checbox, [event.target.name]: event.target.checked });
    }
    const handleClickShowPassword = () => {
        const oldViewPassWord = viewPassWord
        setViewPassWord(!oldViewPassWord)
      };
    
      const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };
    const {contrat} = checbox
    const disabled =  (name.length > 4 && numberHotel.length === 8 && numberLotis.length > 3 && etoile !== 0 && location.latitude !== 0 && password.length > 3 && contrat) ? false : true


    return (
        <div className="signup_screen flexbox flex-center">
            <React.Fragment>
                    <Container maxWidth="md">
                        <Card raised={true}>
                            <Grid container spacing={3} style={{padding: 20}}>
                                <Grid item xs={3}>
                                    <img src={logo} className='logoApp-2x App-logo' alt='Logo' />
                                </Grid>
                                <Grid item xs={9}>
                                    <div className="flexbox flex-end">
                                        <h5>Vous avez déjà un compte ? <Links to='/signin' content="Oui" tooltip="Alors cliquez ici pour vous connecter" /> </h5>
                                    </div>
                                </Grid>
                                <MegaTitleProps title='Inscription' size='md' />
                                <Grid item xs={7}>
                                    <Container>
                                        <Grid container>
                                            <Grid item xs={6} style={{paddingBottom: 20}}>
                                                <TextInputField
                                                    id='name'
                                                    className='createName'
                                                    value={name}
                                                    required={true}
                                                    variant="outlined"
                                                    label="Nom de l'hotel"
                                                    onChange={(e) => changeName(e.target.value)}
                                                />
                                                
                                            </Grid>
                                            <Grid item xs={6} style={{paddingBottom: 20}}>
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
                                            <Grid item xs={6} style={{paddingBottom: 20}}>
                                                <TextInputField
                                                    id='identifiant'
                                                    className='identifiantLot'
                                                    value={numberLotis}
                                                    required={true}
                                                    variant="outlined"
                                                    label='Identiant de Lotis'
                                                    onChange={(e) => changeNumberLotis(e.target.value)}
                                                />
                                                
                                            </Grid>
                                            <Grid item xs={6} style={{paddingBottom: 20}}>
                                                <h5>Nombre d'étoile votre hotel</h5>
                                                <Rate defaultValue={etoile} onChange={(value) => changeEtoile(value)} />
                                            </Grid>
                                            <Grid item xs={9} style={{paddingBottom: 10}}>
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
                                            <Grid item xs={3} style={{paddingBottom: 10}} >
                                                <div className='flexbox flex-center'>
                                                    <Buttons
                                                        id='Locate'
                                                        title='Localisation'
                                                        shape="round"
                                                        type="dashed"
                                                        onClick={getLocation}
                                                        icon={<PushpinTwoTone twoToneColor={colorPrimary} />}
                                                        tooltip='Nous recupérons votre position exacte pour un meilleur service'
                                                    />
                                                </div>
                                                
                                            </Grid>
                                            <Grid item xs={12} style={{marginTop: 10}}>
                                                <CheckBoxs
                                                    row={true}
                                                    labels={labels}
                                                    items={
                                                        [
                                                            {
                                                                checked:contrat,
                                                                id:'contrat',
                                                                name:'contrat',
                                                                className: 'checkbox contrat',
                                                            }
                                                        ]
                                                    }
                                                    onChange={onChecked}
                                                />
                                            </Grid>
                                            <Grid item xs={12} style={{marginTop: 10}}>
                                                <Buttons
                                                    id='signup'
                                                    title="S'enregistrer"
                                                    shape="round"
                                                    block={true}
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