import React, { useState, useEffect } from 'react'
import { Props } from '../../Interfaces/Props/Navigation';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import { Divider, Grid, Typography } from '@mui/material';
import { message,Select,Table, Space, Steps, Image, DatePicker, Empty, Skeleton, Card} from 'antd';
import { makeStyles } from '@mui/styles';import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionActions from '@mui/material/AccordionActions';
import { ReconciliationTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import { colorPrimary } from '../../Constants/color';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BoxLoadings from '../Components/Loading/BoxLoading';
import { Etat } from '../../Constants/Enum';
import { ConsumeApi } from '../../ServiceWorker/ConsumeApi';
import { useNavigate } from "react-router-dom";
import Buttons from '../Components/Buttons/Buttons';
import Cards from '../Components/Cards/Cards';


const useStyles = makeStyles({
    root: {
      width: '100%',
      margin: 15
    },
    heading: {
      fontSize: 20,
    },
    secondaryHeading: {
      fontSize: 15,
      color: colorPrimary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '33.33%',
    },
    helper: {
      borderLeft: `2px solid grey`,
      padding: 10,
    },
    link: {
      color: colorPrimary,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  });

function AdminCovoiturage(props: Props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const consumeApi: ConsumeApi = new ConsumeApi();
    const role = localStorage.getItem('role') ?? '';
    const [itemSelect, setItemSelect] = React.useState('');
    const [assuranceExpiration, setAssuranceExpiration] = React.useState('');
    const [techniqueExpiration, setTechniqueExpiration] = React.useState('');

    const [selected, setSelected] = React.useState(0);
    const [traveller, setTraveller] = React.useState({
        assuranceVehicule: [],
        carteGrise: [],
        permisDeConduire: [],
        visiteTechnique: [],
        vehiculeCover: '',
        profilConducteurCover: '',
        name: '',
        placeTotalVehicule: 0,
        position: '',
        hobiesCovoiturage: []
    });
    
    const [isFetch, setIsFetch] = useState(true);
    const [travellersDemandes, setTravellersDemandes] = useState<any[]>([]);

    const onChangeAssurance = (date: any, dateString: string) => {
        setAssuranceExpiration(dateString);
      }
    const onChangeTechnique = (date: any, dateString: string) => {
        setTechniqueExpiration(dateString);
      }

    const sectionDetails = (selectedItem:number) => {
        if(selectedItem === 0) {
            return (
                <Empty />
            )
        } else if(selectedItem === 1) {
            return(
                <Skeleton active />
            )
        } else {
                return (
                    <Grid container spacing={1} style={{padding: 20}}>
                            <Grid item xs={3}>
                                <Cards
                                    tooltip={`Conducteur: ${traveller.name}`}
                                    avatar={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.profilConducteurCover}`}
                                    title={`Demande Conducteur de ${traveller.name}`}
                                    id='vendeur'
                                    cover={<img
                                        alt="example"
                                        src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.vehiculeCover}`}
                                      />}
                                    description={`Position ${traveller.position ?? 'N/A'}, \n Nbre de place du vehicule: ${traveller.placeTotalVehicule}`}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <div className={classes.column}>
                                    <Typography className={classes.secondaryHeading}>Carte Grise</Typography>
                                </div>
                                <Grid container spacing={1} style={{padding: 5}}>
                                    <Grid item xs={6}>
                                        <Card style={{ width: '100%' }}>
                                            <Image
                                                width={'100%'}
                                                src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.carteGrise[0]}`}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card style={{ width: '100%' }}>
                                            <Image
                                                width={'100%'}
                                                src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.carteGrise[1]}`}
                                            />
                                        </Card>
                                    </Grid>
                                </Grid>
                                
                                
                            </Grid>
                            <Grid item xs={3}>
                                <div className={classes.column}>
                                    <Typography className={classes.secondaryHeading}>Carte Visite Technique</Typography>
                                </div>
                                <Grid container spacing={1} style={{padding: 5}}>
                                    <Grid item xs={6}>
                                        <Card style={{ width: '100%' }}>
                                            <Image
                                                width={'100%'}
                                                src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.visiteTechnique[0]}`}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card style={{ width: '100%' }}>
                                            <Image
                                                width={'100%'}
                                                src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.visiteTechnique[1]}`}
                                            />
                                        </Card>
                                    </Grid>
                                </Grid>
                                
                                
                            </Grid>
                            <Grid item xs={3}>
                                <div className={classes.column}>
                                    <Typography className={classes.secondaryHeading}>Permis</Typography>
                                </div>
                                <Grid container spacing={1} style={{padding: 5}}>
                                    <Grid item xs={6}>
                                        <Card style={{ width: '100%' }}>
                                            <Image
                                                width={'100%'}
                                                src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.permisDeConduire[0]}`}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card style={{ width: '100%' }}>
                                            <Image
                                                width={'100%'}
                                                src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.permisDeConduire[1]}`}
                                            />
                                        </Card>
                                    </Grid>
                                </Grid>
                                
                                
                            </Grid>
                            <Grid item xs={3}>
                                <div className={classes.column}>
                                    <Typography className={classes.secondaryHeading}>Assurance</Typography>
                                </div>
                                <Grid container spacing={1} style={{padding: 5}}>
                                    <Grid item xs={6}>
                                        <Card style={{ width: '100%' }}>
                                            <Image
                                                width={'100%'}
                                                src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.assuranceVehicule[0]}`}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card style={{ width: '100%' }}>
                                            <Image
                                                width={'100%'}
                                                src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.assuranceVehicule[1]}`}
                                            />
                                        </Card>
                                    </Grid>
                                </Grid>
                                
                                
                            </Grid>
                            <Grid item xs={3}>
                                <Space direction="vertical">
                                    <div className={classes.column}>
                                        <Typography className={classes.secondaryHeading}>Expiration Assurance</Typography>
                                    </div>
                                    <DatePicker style={{width: '100%'}} onChange={onChangeAssurance} />
                                    <div className={classes.column}>
                                        <Typography className={classes.secondaryHeading}>Expiration Visite Technique</Typography>
                                    </div>
                                    <DatePicker style={{width: '100%'}} onChange={onChangeTechnique} />
                                </Space>
                                
                            </Grid>
                            
                            
                    </Grid>
                );
        }
    }
    const loadData = async () => {
      const data = await consumeApi.getTravellersDemandes();
      
      
      if(data.etat === Etat.SUCCESS) {
        const resultTravellersDemandes = data.result.allTravellersDemandes as any[];
        const allTravellersDemandes = resultTravellersDemandes.map(value => {
          return {...value, key: value._id}
        });
        setTravellersDemandes(allTravellersDemandes);
        setIsFetch(false);
      } else {
        localStorage.clear();
        navigate('/signin');
        
      }
    }
    
    // Hooks Effet
    useEffect(() => {
        loadData();
    }, []);


    const columns = [
        { title: 'N° Identitifiant', dataIndex: '_id', key:'_id',fixed: true, render: (info:any) => {
            const _id = info as string;
            return (
                <Buttons
                                        key={`select_${_id}`}
                                        id={`select_${_id}`}
                                        type="dashed"
                                        title={_id}
                                        tooltip={'Cliquez ici pour le gerer'}
                                        onClick={async ()=> {
                                            setItemSelect(_id);
                                            setSelected(1);
                                            const data = await consumeApi.getDetailsTravellerDemande(_id);
                                            if(data.etat === Etat.SUCCESS) {
                                                setTraveller(data.result);
                                                setSelected(2);
                                            } else {
                                                localStorage.clear();
                                                navigate('/signin');
                                            }
                                        }}
                                    />
            )
        } },
        { title: 'Nom', dataIndex: 'name', key:'name' },
        { title: 'Lieu Recent', dataIndex: 'position', key:'position' },
        { title: 'Contact', dataIndex: 'numero', key:'numero' },
        
        { title: 'Nbre Voyage', dataIndex: 'numberTravel', key:'numberTravel'},
    ];

    const dropTravelDemande = () => {
        message.loading("Annulation en cours")
            .then(async () => {
                const data = await consumeApi.dropTravelDemande(itemSelect);
                if(data.etat === Etat.SUCCESS) {
                    message.success("Annulation terminé");
                    setItemSelect('');

                    setSelected(0);
                    const resultTravellersDemandes = data.result.allTravellersDemandes as any[];
                    const allTravellersDemandes = resultTravellersDemandes.map(value => {
                    return {...value, key: value._id}
                    });
                    setTravellersDemandes(allTravellersDemandes);
                } else {
                    const error = data.error as Error;
                    message.error(error.message);
                }
            })
    }

    const validateTravelDemande = () => {
        if(assuranceExpiration.length > 6 && techniqueExpiration.length > 6) {
            message.loading("Validation en cours")
            .then(async () => {
                const data = await consumeApi.validateTravelDemande(itemSelect, assuranceExpiration,techniqueExpiration );
                if(data.etat === Etat.SUCCESS) {
                    message.success("Validation terminé");
                    setItemSelect('');

                    setSelected(0);
                    const resultTravellersDemandes = data.result.allTravellersDemandes as any[];
                    const allTravellersDemandes = resultTravellersDemandes.map(value => {
                    return {...value, key: value._id}
                    });
                    setTravellersDemandes(allTravellersDemandes);
                } else {
                    const error = data.error as Error;
                    message.error(error.message);
                }
            })
        } else {
            message.error("Les dates d'expirations ne sont pas renseignées correctement");
        }
    }

    if(isFetch) {
        return (
          <BoxLoadings />
        )
      }
    else {
        return (
            <>
                <main>
                    <div className="pt-10">
                        <MegaTitleProps title="Product Command" size='md' />
                        <Grid container spacing={1} style={{padding: 10}}>
                            <div className={classes.root}>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1c-content"
                                    id="panel1c-header"
                                    >
                                    <div className={classes.column}>
                                        <ReconciliationTwoTone twoToneColor={colorPrimary} style={{fontSize: 32}}/>
                                    </div>
                                    <div className={classes.column}>
                                        <Typography className={classes.secondaryHeading}>Detail Conducteur</Typography>
                                    </div>
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.details}>
                                        <Grid container spacing={1} style={{padding: 10}}>
                                            {sectionDetails(selected)}
                                        </Grid>
                                        
                                    </AccordionDetails>
                                    <Divider />
                                    <AccordionActions>
                                        <Buttons
                                            key="annuler"
                                            id='annuler'
                                            shape="round"
                                            type="ghost"
                                            danger= {true}
                                            title="Annuler"
                                            icon={<CloseCircleOutlined color={'#fff'} />}
                                            tooltip='Annuler Demande'
                                            onClick={dropTravelDemande}
                                        />
                                        <Buttons
                                            key="doneCommand"
                                            id='doneCommand'
                                            shape="round"
                                            type="primary"
                                            title="Valider"
                                            tooltip='Terminé'
                                            onClick={validateTravelDemande}
                                        />

                                    </AccordionActions>
                                </Accordion>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: 20}}>
                            <div className={classes.root}>
                              <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>List Demande Conducteur en cours</Typography>
                                <Table columns={columns} dataSource={travellersDemandes} />
                              </div>
                            </div>
                        </Grid>
                    </div>
                </main>
            </>
        )
    }
}

export default AdminCovoiturage;