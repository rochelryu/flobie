import React, { useState, useEffect } from 'react'
import { Props } from '../../Interfaces/Props/Navigation';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import { Divider, Grid, Typography } from '@mui/material';
import { message,Select, Tag,Table, Form, Steps, Radio, Input, Empty, Skeleton, InputNumber} from 'antd';
import { makeStyles } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionActions from '@mui/material/AccordionActions';
import { ReconciliationTwoTone, SwapRightOutlined, WalletOutlined,CloudSyncOutlined, UploadOutlined } from '@ant-design/icons';
import { colorError, colorPrimary } from '../../Constants/color';

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
    errorTitle: {
      fontSize: 20,
      fontWeight: 900,
      color: colorError,
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
const { Option } = Select;
const { Step } = Steps;

const options = [
    { label: 'Intra Ville', value: 'Intra Ville' },
    { label: 'Extra Ville', value: 'Extra Ville' },
  ];
const steps = [
    {
      title: 'Vendeur',
    },
    {
      title: 'En route',
    },
    {
      title: 'Central',
    },
    {
      title: 'Acheteur',
    },
  ];
  
function EmployerDash(props: Props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const consumeApi: ConsumeApi = new ConsumeApi();
    const [form] = Form.useForm();
    const [current, setCurrent] = React.useState(0);
    const [levelDelivery, setLevelDelivery] = React.useState(0);
    const [itemSelect, setItemSelect] = React.useState('');
    const [travelId, setTavelId] = React.useState('');

    const [selected, setSelected] = React.useState(0);
    const [typeCommand, changeTypeCommand] = useState(options[0].value);
    
    const [isFetch, setIsFetch] = useState(true);
    const [commandes, setCommandes] = useState<any[]>([]);
    const [travels, setTravels] = useState<any[]>([]);

    const [seller, setSeller] = React.useState({
        name: '',
        avatar: '',
        description: '',
        wallet: 0,
    });
    const [buyer, setBuyer] = React.useState({
        name: '',
        avatar: '',
        description: '',
        wallet: 0,
    });
    const [product, setProduct] = React.useState({
        name: '',
        cover: '',
        description: '',
        wallet: 0,
    });

    const [restReservation, setRestReservation] = React.useState({
        citySeller: '',
          cityBuyer: '',
          travelId: '',
          state: 0,
          priceDelivery: 0,
          deliveryManInfo: '',
          descriptionConvoyeur: ''
    });

    const next = () => {
        if(current === 0){
            if(restReservation.cityBuyer === '' || restReservation.citySeller === ''){
                message.error("Veuillez remplir les lieux pour la reception et le depot du colis d'abord");
            } else {
                message.loading("Enregistrement en cours")
                .then(async () => {
                    const data = await consumeApi.setDeleveryProductLevelOne(restReservation.cityBuyer, restReservation.citySeller, itemSelect, travelId);
                    if(data.etat === Etat.SUCCESS) {
                        message.success("Enregistrement terminé, toutes les parties ont été informé")
                        setCurrent(current + 1);
                    } else {
                        const error = data.error as Error;
                        message.error(error.message);
                    }
                })
                
            }
        } else if(current === 1){
            message.loading("Enregistrement en cours")
                .then(async () => {
                    const data = await consumeApi.setDeleveryProductLevelTwo(itemSelect);
                    if(data.etat === Etat.SUCCESS) {
                        message.success("Enregistrement terminé, toutes les parties ont été informé")
                        setCurrent(current + 1);
                    } else {
                        const error = data.error as Error;
                        message.error(error.message);
                    }
                })
        } else if(current === 2) {
            message.loading("Enregistrement en cours")
                .then(async () => {
                    const data = await consumeApi.setDeleveryProductLevelThree(restReservation.cityBuyer,itemSelect, restReservation.priceDelivery, restReservation.deliveryManInfo);
                    if(data.etat === Etat.SUCCESS) {
                        message.success("Enregistrement terminé, toutes les parties ont été informé");
                        setItemSelect('');
                        setSelected(0);

                    } else {
                        const error = data.error as Error;
                        message.error(error.message);
                    }
                })
        }
      };

    const rembourser = (levelDelivery:number) => {
        message.loading("Enregistrement en cours")
                .then(async () => {
                    const data = await consumeApi.rembourseClient(itemSelect, levelDelivery);
                    if(data.etat === Etat.SUCCESS) {
                        await loadData();
                        setItemSelect('');
                        setSelected(0);
                    } else {
                        const error = data.error as Error;
                        message.error(error.message);
                    }
                })
    }

    const reformatContent = (currentIndex:number) => {
        if(currentIndex === 0) {
            return (
                <Grid container spacing={1} style={{padding: 20}}>
                        <Grid item xs={3}>
                            <Cards
                            tooltip={`Vendeur: ${seller.name}`}
                            avatar={`${consumeApi.AssetProfilServer}${seller.avatar}`}
                            title='Vendeur'
                            id='vendeur'
                            description={seller.description}
                            actions={[<Grid container spacing={1} style={{padding: 10}}>
                                <Grid item xs={3}>
                                    <WalletOutlined />
                                </Grid>
                                <Grid item xs={9}>
                                    {seller.wallet}
                                </Grid>
                            </Grid>]}
                            />
                        </Grid>
                        <Grid item xs={2}>
                        <Cards
                            tooltip={`Produit: ${product.name}`}
                            cover={<img
                                alt="example"
                                src={`${consumeApi.AssetProductServer}${product.cover}`}
                              />}
                            title={product.name}
                            id='produit'
                            description={product.description}
                            />
                        </Grid>
                        <Grid item xs={3}>
                        <Cards
                            tooltip={`Acheteur: ${buyer.name}`}
                            avatar={`${consumeApi.AssetProfilServer}${buyer.avatar}`}
                            title='Acheteur'
                            id='acheteur'
                            description={buyer.description}
                            actions={[<Grid container spacing={1} style={{padding: 10}}>
                                <Grid item xs={3}>
                                    <WalletOutlined />
                                </Grid>
                                <Grid item xs={9}>
                                    {buyer.wallet}
                                </Grid>
                            </Grid>]}
                            />
                        </Grid>
                        <Grid item xs={4}>
                        <Radio.Group
                            options={options}
                            onChange={(e)=> changeTypeCommand(e.target.value)}
                            value={typeCommand}
                            optionType="button"
                            />
                            {typeCommand === options[1].value ?
                                <Select
                                showSearch
                                style={{width:'100%', marginTop: 10}}
                                placeholder="Select travel"
                                onChange={(value)=> setTavelId(value?.toString() ?? '')}
                                allowClear
                                
                                >
                                {travels.map(value => (<Option key={value._id} value={value._id}>{value.description}</Option>))}
                                </Select>
                                :
                                <></>
                            }
                            <Grid container spacing={1} style={{padding: 5}}>
                                <Grid item xs={6}>
                                <Input
                                value={restReservation.citySeller}
                                placeholder="Lieu Vendeur"
                                onChange={(e)=> {
                                    setRestReservation({...restReservation, citySeller: e.target.value});
                                }}
                                />
                                </Grid>
                                <Grid item xs={6}>
                                <Input
                                value={restReservation.cityBuyer}
                                placeholder="Lieu Acheteur"
                                onChange={(e)=> {
                                    setRestReservation({...restReservation, cityBuyer: e.target.value});
                                }}
                                />
                                </Grid>

                            </Grid>
                        </Grid>
                </Grid>
            )
        } else if(currentIndex === 2) {
            return (
            <Grid container spacing={1} style={{padding: 20}}>
                <Grid item xs={3}>
                            <Cards
                            tooltip={`Vendeur: ${seller.name}`}
                            avatar={`${consumeApi.AssetProfilServer}${seller.avatar}`}
                            title='Vendeur'
                            id='vendeur'
                            description={seller.description}
                            actions={[<Grid container spacing={1} style={{padding: 10}}>
                                <Grid item xs={3}>
                                    <WalletOutlined />
                                </Grid>
                                <Grid item xs={9}>
                                    {seller.wallet}
                                </Grid>
                            </Grid>]}
                            />
                </Grid>
                <Grid item xs={2}>
                        <Cards
                            tooltip={`Produit: ${product.name}`}
                            cover={<img
                                alt="example"
                                src={`${consumeApi.AssetProductServer}${product.cover}`}
                              />}
                            title={product.name}
                            id='produit'
                            description={product.description}
                            />
                </Grid>
                <Grid item xs={3}>
                        <Cards
                            tooltip={`Acheteur: ${buyer.name}`}
                            avatar={`${consumeApi.AssetProfilServer}${buyer.avatar}`}
                            title='Acheteur'
                            id='acheteur'
                            description={buyer.description}
                            actions={[<Grid container spacing={1} style={{padding: 10}}>
                                <Grid item xs={3}>
                                    <WalletOutlined />
                                </Grid>
                                <Grid item xs={9}>
                                    {buyer.wallet}
                                </Grid>
                            </Grid>]}
                            />
                </Grid>
                <Grid item xs={4}>
                
                    <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{restReservation.descriptionConvoyeur}</Typography>
                            </div>
                    <Grid container spacing={1} style={{padding: 5}}>
                        <Grid item xs={6}>
                        <Input
                        disabled
                        value={restReservation.citySeller}
                        placeholder="Lieu Sel: 220 Logements"
                        
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <Input
                        value={restReservation.cityBuyer}
                        placeholder="Lieu Buy: Rivera Palmerai"
                        onChange={(e)=> {
                            setRestReservation({...restReservation, cityBuyer: e.target.value});
                        }}
                        />
                        </Grid>

                        <Grid item xs={6}>
                        <InputNumber
                        min={0}
                        value={restReservation.priceDelivery}
                        placeholder="prix livraison"
                        onChange={(value)=> {
                            setRestReservation({...restReservation, priceDelivery: value});
                        }}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <Input
                        value={restReservation.deliveryManInfo}
                        placeholder="Nom Livreur/Contact(+225 xxxxxxxxx)"
                        onChange={(e)=> {
                            setRestReservation({...restReservation, deliveryManInfo: e.target.value});
                        }}
                        />
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
            )
        } else if(currentIndex === 3) {
            return (
            <Grid container spacing={1} style={{padding: 20}}>
                <Grid item xs={3}>
                            <Cards
                            tooltip={`Vendeur: ${seller.name}`}
                            avatar={`${consumeApi.AssetProfilServer}${seller.avatar}`}
                            title='Vendeur'
                            id='vendeur'
                            description={seller.description}
                            actions={[<Grid container spacing={1} style={{padding: 10}}>
                                <Grid item xs={3}>
                                    <WalletOutlined />
                                </Grid>
                                <Grid item xs={9}>
                                    {seller.wallet}
                                </Grid>
                            </Grid>]}
                            />
                </Grid>
                <Grid item xs={2}>
                        <Cards
                            tooltip={`Produit: ${product.name}`}
                            cover={<img
                                alt="example"
                                src={`${consumeApi.AssetProductServer}${product.cover}`}
                              />}
                            title={product.name}
                            id='produit'
                            description={product.description}
                            />
                </Grid>
                <Grid item xs={3}>
                        <Cards
                            tooltip={`Acheteur: ${buyer.name}`}
                            avatar={`${consumeApi.AssetProfilServer}${buyer.avatar}`}
                            title='Acheteur'
                            id='acheteur'
                            description={buyer.description}
                            actions={[<Grid container spacing={1} style={{padding: 10}}>
                                <Grid item xs={3}>
                                    <WalletOutlined />
                                </Grid>
                                <Grid item xs={9}>
                                    {buyer.wallet}
                                </Grid>
                            </Grid>]}
                            />
                </Grid>
                <Grid item xs={4}>
                
                    <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{restReservation.descriptionConvoyeur}</Typography>
                            </div>
                    <Grid container spacing={1} style={{padding: 5}}>
                        <Grid item xs={6}>
                        <Input
                        disabled
                        value={restReservation.citySeller}
                        placeholder="Lieu Sel: 220 Logements"
                        
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <Input
                        disabled
                        value={restReservation.cityBuyer}
                        placeholder="Lieu Buy: Rivera Palmeraie"
                        onChange={(e)=> {
                            setRestReservation({...restReservation, cityBuyer: e.target.value});
                        }}
                        />
                        </Grid>

                        <Grid item xs={6}>
                        <InputNumber
                        disabled
                        value={restReservation.priceDelivery}
                        placeholder="prix livraison"
                        
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <Input
                        disabled
                        value={restReservation.deliveryManInfo}
                        placeholder="Nom Livreur/Contact(+225 xxxxxxxxx)"
                        
                        />
                        </Grid>
                        {levelDelivery === 4 ? 
                        (
                            <Grid item xs={12}>
                                <div className={classes.column}>
                                    <Typography className={classes.errorTitle}>L'acheteur demande un remboursement</Typography>
                                </div>
                            </Grid>
                        ): null}

                    </Grid>
                </Grid>
            </Grid>
            )
        } else {
            return (
                    <Grid container spacing={1} style={{padding: 20}}>
                        <Grid item xs={3}>
                            <Cards
                            tooltip={`Vendeur: ${seller.name}`}
                            avatar={`${consumeApi.AssetProfilServer}${seller.avatar}`}
                            title='Vendeur'
                            id='vendeur'
                            description={seller.description}
                            actions={[<Grid container spacing={1} style={{padding: 10}}>
                                <Grid item xs={3}>
                                    <WalletOutlined />
                                </Grid>
                                <Grid item xs={9}>
                                    {seller.wallet}
                                </Grid>
                            </Grid>]}
                            />
                        </Grid>
                        <Grid item xs={2}>
                        <Cards
                            tooltip={`Produit: ${product.name}`}
                            cover={<img
                                alt="example"
                                src={`${consumeApi.AssetProductServer}${product.cover}`}
                              />}
                            title={product.name}
                            id='produit'
                            description={product.description}
                            />
                        </Grid>
                        <Grid item xs={3}>
                        <Cards
                            tooltip={`Acheteur: ${buyer.name}`}
                            avatar={`${consumeApi.AssetProfilServer}${buyer.avatar}`}
                            title='Acheteur'
                            id='acheteur'
                            description={buyer.description}
                            actions={[<Grid container spacing={1} style={{padding: 10}}>
                                <Grid item xs={3}>
                                    <WalletOutlined />
                                </Grid>
                                <Grid item xs={9}>
                                    {buyer.wallet}
                                </Grid>
                            </Grid>]}
                            />
                        </Grid>
                        <Grid item xs={4}>
                        
                            <div className={classes.column}>
                                        <Typography className={classes.secondaryHeading}>{restReservation.descriptionConvoyeur}</Typography>
                                    </div>
                            <Grid container spacing={1} style={{padding: 5}}>
                                <Grid item xs={6}>
                                <Input
                                disabled
                                value={restReservation.citySeller}
                                placeholder="Lieu Sel: 220 Logements"
                                
                                />
                                </Grid>
                                <Grid item xs={6}>
                                <Input
                                disabled
                                value={restReservation.cityBuyer}
                                placeholder="Lieu Buy: Rivera Palmerai"
                                
                                />
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
            )
        }
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
            return(
                <>
                    <Steps current={current}>
                    {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    {reformatContent(current)}
                </>
            )
        }
    }
    const loadData = async () => {
      const data = await consumeApi.getCommandes();
      const resultCommandes = data.result.allCommande as any[];
      const resultTravels = data.result.allTravel as any[];
      const allCommande = resultCommandes.map(value => {
        return {...value, key: value._id}
      });
      const allTravel = resultTravels.map(value => {
        return {...value, key: value._id}
      });
      if(data.etat === Etat.SUCCESS) {
        setCommandes(allCommande);
        setTravels(allTravel);
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
        { title: 'N° Commande', dataIndex: '_id', key:'_id',fixed: true, render: (info:any) => {
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
                                            const data = await consumeApi.getDetailsCommandes(_id);
                                            if(data.etat === Etat.SUCCESS) {
                                                setSeller(data.result.seller);
                                                setBuyer(data.result.buyer);
                                                setProduct(data.result.product);
                                                setRestReservation(data.result.restReservation);
                                                const newCurrent = data.result.restReservation.state <= 3 ? data.result.restReservation.state : 3;
                                                setLevelDelivery(data.result.restReservation.state);
                                                setCurrent(newCurrent);
                                                setSelected(2);
                                            } else {
                                                localStorage.clear();
                                                navigate('/signin');
                                            }
                                        }}
                                    />
            )
        } },
        { title: 'Prix Final', dataIndex: 'price', key:'price' },
        { title: 'Lieu Vendeur', dataIndex: 'citySeller', key:'citySeller' },
        { title: 'Lieu Acheteur', dataIndex: 'cityBuyer', key:'cityBuyer' },
        
        { title: 'Niveau', dataIndex: 'state', key:'state',render: (info:any) => {
          const state = info as number;
          if(state === 0) {
            return (
              <Tag color={'error'}>
                Chez Le vendeur
              </Tag>
            )
          } else if(state === 1) {
            return (
              <Tag color={'geekblue'}>
                Convoyeur Attribué
              </Tag>
            )
          } else if(state === 2) {
            return (
              <Tag color={'blue'}>
                Au Siège
              </Tag>
            )
          }
          else if(state === 3) {
            return (
              <Tag color={'gold'}>
                Chez l'acheteur
              </Tag>
            )
          }
          else if(state === 4) {
            return (
              <Tag color={'error'}>
                Acheteur Non content
              </Tag>
            )
          }
        }
        },
        { title: 'Date Enr', dataIndex: 'registerDate', key:'registerDate',fixed: true },
    ];
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
                                        <Typography className={classes.secondaryHeading}>Detail Commande</Typography>
                                    </div>
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.details}>
                                        <Grid container spacing={1} style={{padding: 10}}>
                                            {sectionDetails(selected)}
                                        </Grid>
                                        
                                    </AccordionDetails>
                                    <Divider />
                                    <AccordionActions>
                                    {current < steps.length - 1 && (
                                    <Buttons
                                    key="next"
                                    id='next'
                                    shape="round"
                                    type="primary"
                                    title="Suivant"
                                    icon={<SwapRightOutlined color={'#fff'} />}
                                    tooltip='Etape Suivante'
                                    onClick={()=> next()}
                                />
                                    )}
                                    
                                    
                                    {(levelDelivery === 1 || levelDelivery === 4) && (
                                        <Buttons
                                            key="rembourser"
                                            id='rembourser'
                                            shape="round"
                                            type="ghost"
                                            title="Rembourser"
                                            icon={<UploadOutlined color={'#fff'} />}
                                            tooltip='Etape Suivante'
                                            onClick={()=> rembourser(levelDelivery)}
                                        />
                                    )}
                                    </AccordionActions>
                                </Accordion>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: 20}}>
                            <div className={classes.root}>
                              <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>List Commandes en cours</Typography>
                                <Buttons
                                    key="reload"
                                    id='reload'
                                    shape="round"
                                    type="ghost"
                                    title="Actualiser"
                                    icon={<CloudSyncOutlined color={'#fff'} />}
                                    tooltip='Actualiser'
                                    onClick={()=> {
                                        message.loading('Actualisation...')
                                        .then(async ()=> {
                                            await loadData();
                                            setItemSelect('');
                                            setSelected(0);
                                            message.success('Actualisation terminé');
                                        })
                                    }}
                                />
                                <Table columns={columns} dataSource={commandes} />
                              </div>
                            </div>
                        </Grid>
                    </div>
                </main>
            </>
        )
    }
}

export default EmployerDash;