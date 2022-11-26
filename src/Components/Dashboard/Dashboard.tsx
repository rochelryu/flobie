import React, {useState, useEffect, useCallback, useRef} from 'react';
import { Props } from '../../Interfaces/Props/Navigation';
import {Card, Grid, Avatar, Chip, IconButton } from '@mui/material';
import { colorPrimary, colorGreySmoothWith, colorError } from '../../Constants/color';
import Modals from '../Components/Modals/Modals';
import Buttons from '../Components/Buttons/Buttons';
import { btn_color_primary } from '../../Constants/ClassName/Buttons';
import { message, Affix, Table, Tabs, Tag } from 'antd';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import { MehTwoTone, DollarCircleOutlined, DownCircleOutlined, SearchOutlined, CarTwoTone, ShoppingTwoTone, CalendarTwoTone, CloudSyncOutlined } from '@ant-design/icons';
import blur from '../../Assets/Images/svg/blur.svg'
import TextInputField from '../Components/TextInputField/TextInputField';
import BoxLoadings from '../Components/Loading/BoxLoading';
import DisplayData from '../Components/DisplayData/DisplayData';
import { ConsumeApi } from '../../ServiceWorker/ConsumeApi';
import { Etat } from '../../Constants/Enum';
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Sector, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CheckBoxs from '../Components/CheckBox/CheckBoxs';
import { format } from 'date-fns';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import './Dashboard.scss'

const { TabPane } = Tabs;
const top = 10;

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`$${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const columnsTravel = [
  { title: 'Depart', key: 'beginCity', render: (element:string,rowData:any) => <Tag color={colorGreySmoothWith} key={"beginCity"+rowData._id}>{rowData.beginCity.toUpperCase()}</Tag> },
  { title: 'Arrivé', key: 'endCity', render: (element:string,rowData:any) => <Tag color={colorPrimary} key={"endCity"+rowData._id}>{rowData.endCity.toUpperCase()}</Tag> },
  { title: 'Prix', dataIndex: 'price', key: 'price', },
  { title: 'Argent Cumul', dataIndex: 'cumulPrice', key: 'cumulPrice', },
  { title: 'Pourcentage', key: 'percentage', render: (element:string,rowData:any) => <p key={"percentage"+rowData._id}>{rowData.percentage*100}%</p>  },
  
  { title: 'Place', key: 'userPayCheck',render: (element:string,rowData:any) => <p key={"userPayCheck"+rowData._id}>{rowData.userPayCheck.length}/{rowData.placePosition.length}</p>  },
  { title: 'Date Voy.', dataIndex: 'travelDate',key: 'travelDate', render: (element:string) => <p key={element}>{format(new Date(element), "dd/MMM/yyyy HH:mm")}</p>  },
  { title: 'Date Enr.', dataIndex: 'registerDate',key: 'registerDate', render: (element:string) => <p key={element}>{format(new Date(element), "dd/MMM/yyyy HH:mm")}</p>  },                                          
  
];

export default function Dashboard(props: Props) {
    const navigate = useNavigate();
    const consumeApi: ConsumeApi = new ConsumeApi();
    const [searchItems, setSearchItems] = useState('');
    const [titleCategorieUpdate, changeTitleCategorieUpdate] = useState('');
    const [idCategorieUpdate, changeIdCategorieUpdate] = useState('');
    const [domaineCategorieUpdate, changeDomaineCategorieUpdate] = useState<string[]>([]);
    const [titleCategorie, changeTitleCategorie] = useState('');
    const [visible, setVisible] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [checked, setChecked] = useState([false, false,false]);
    const [loading, setloading] = useState(false);
    const [isFetch, setIsFetch] = useState(true);
    const [dataDashboard, setDataDashboard] = useState({
      countTotalAccount: 0,
      countTotalAdmin: 0,
      countTotalArticle: 0,
      countTotalCategorie: 0,
      countTotalDeals: 0,
      countTotalEvent: 0,
      countTotalTravel: 0,
      allcategorie: [],

      reserveEvent: 0,
      reserveRecharge: 0,
      reserveDeals: 0,
      reserveTravel: 0,
      dataForRechargement: [],
      dataForRetrait: [],
      dataRadard: [],
      dataLine: [],
      allTravelInWait: [],
    });
    const [activeIndex, setActiveIndex] = useState(0);
    const [amountRetraitRecharge, setAmountRetraitRecharge] = useState(0);
    const [amountRetraitTravel, setAmountRetraitTravel] = useState(0);
    const [amountRetraitEvent, setAmountRetraitEvent] = useState(0);
    const [amountRetraitDeals, setAmountRetraitDeals] = useState(0);
    const onPieEnter = useCallback(
      (_:any, index:any) => {
         setActiveIndex(index);
      },
      [setActiveIndex]
    );

    const onChecked = async ( event: React.ChangeEvent<HTMLInputElement>) => {
      if(event.target.name === 'actu'){
        const oldChecked = checked[0];
        setChecked([!oldChecked, checked[1], checked[2]])
      } else if (event.target.name === 'deals'){
        const oldChecked = checked[1];
        setChecked([checked[0], !oldChecked, checked[2]])
      } else if (event.target.name === 'event'){
        const oldChecked = checked[2];
        setChecked([checked[0], checked[1], !oldChecked])
      }
      //changeChecbox({ ...checbox, [event.target.name]: event.target.checked });
  }
    


    // Hooks Effet
    useEffect(() => {
      loadData();
    }, []);

    async function loadData() {
      const data = await consumeApi.getDahsboard();
      if(data.etat === Etat.SUCCESS) {
        setDataDashboard(data.result);
        setIsFetch(false);
      } else {
        localStorage.clear();
        navigate('/signin');
      }
    }


    const handleOk = async () => {
            if(idCategorieUpdate !== '' && titleCategorieUpdate.length >= 3){
                message.loading("Modification en cours")
                .then(async () => {
                  
                  const datas = await consumeApi.updateCategorie(titleCategorieUpdate, idCategorieUpdate);
                  if(datas.etat === Etat.SUCCESS) {
                    setVisible(false);
                    setloading(false);
                    changeIdCategorieUpdate("");
                    changeDomaineCategorieUpdate([]);
                    changeTitleCategorieUpdate("");
                    
                    await loadData();
                    message.success("Modification effectué");
                  } else {
                    localStorage.clear();
                    navigate('/signin');
                  }
                })
            } else {
                setloading(false)
                setVisible(false)
                message.error("le titre doit contenir au moins 3 caracteères");
              
          };
    }
    const handleCancel = () => {
            setVisible(false)
    }

    const connection = async () => {
      if (!disabled) {
          message.loading("Recherche en cours")
          setTimeout(()=>{
            setDisabled(!disabled)
          }, 3000)
      }
      else {
          message.error("Veuillez faire entrer quelque chose à rechercher")
      }
    }
    const retraitReserve = (type:string) => {
      if((type === "recharge" && amountRetraitRecharge <= 0) || (type === "deals" && amountRetraitDeals <= 0) || (type === "event" && amountRetraitEvent <= 0) || (type === "travel" && amountRetraitTravel <= 0)){
        message.error("Veuillez faire entrer le montant adequat pour le retrait sur " + type.toLocaleUpperCase());
      } else {
        message.loading("Retrait en cours")
          .then(async () => {
            let data = {typeDeReserve:0, amountUsd:0}
            if(type === "recharge") data = {typeDeReserve:1, amountUsd:amountRetraitRecharge}
            else if(type === "deals") data = {typeDeReserve:4, amountUsd:amountRetraitDeals}
            if(type === "event") data = {typeDeReserve:2, amountUsd:amountRetraitEvent}
            if(type === "travel") data = {typeDeReserve:3, amountUsd:amountRetraitTravel}
            const datas = await consumeApi.retraitReserve(data.typeDeReserve, data.amountUsd);
            if(datas.etat === Etat.SUCCESS) {
              setAmountRetraitDeals(0);
              setAmountRetraitEvent(0);
              setAmountRetraitTravel(0);
              setAmountRetraitRecharge(0);
              message.success("Retrait effectué");
              await loadData();
            } else {
              localStorage.clear();
              navigate('/signin');
            }
          })
        
      }
    };
  
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };


    

    const createCategorie = async (popularity:number) => {
      if (titleCategorie.length > 3 && checked.indexOf(true) !== -1) {
          message.loading("Enregistrement en cours")
          .then(async () => {
            const domaine = checked.map((value,index) => {
              if(value) {
                return index;
              }
            });
            const data = await consumeApi.createCategorie(titleCategorie, domaine as number[], popularity);
            if(data.etat === Etat.SUCCESS) {
              message.success("Categorie ajoutée");
              changeTitleCategorie('');
              setChecked([false, false,false]);
              await loadData();
            } else {
              localStorage.clear();
              navigate('/signin');
            }
          })
      }
      else {
          message.error("Veuillez renseigner correctement les champs");
      }
    }

    const togglePopularityCategorie = async (categoryId:string) => {
      message.loading("Changement de popularité en cours")
          .then(async () => {
            
            const data = await consumeApi.togglePopularityCategorie(categoryId);
            if(data.etat === Etat.SUCCESS) {
              message.success("Popularité changé");
            
              await loadData();
            } else {
              localStorage.clear();
              navigate('/signin');
            }
          })
    }

    const handleEdition = (categoryId:string, domaines: [number], categoryName: string) => {
        changeIdCategorieUpdate(categoryId);
        changeTitleCategorieUpdate(categoryName);
        const domaineUpdate = domaines.map(domaine => {
            
            if(domaine === 0) return "Actualité";
            else if (domaine === 1) return "E-commerce";
            else return "Évènement";
        });
        changeDomaineCategorieUpdate(domaineUpdate);
        setVisible(true);
    }



    const COLORS = ['#F8B195', '#F67280', '#99B898', '#355C7D'];


    if(isFetch) {
        return (
          <BoxLoadings />
        )
      }
    else {
      return (
        <>
            <main>
                <Modals
                 visible={visible}
                 loading={loading}
                 title={'Modification categorie'}
                 handleOk={handleOk}
                 handleCancel={handleCancel}
                 footer={
                     [
                        <Buttons
                            key="back"
                            id='back'
                            type='link'
                            title="retour"
                            onClick={handleCancel}
                        />,
                        <Buttons
                            key="delete"
                            id='delete'
                            title="Supprimer"
                            shape="round"
                            danger
                            onClick={handleCancel}
                        />,
                        <Buttons
                            key="create"
                            id='create'
                            title="Modifier"
                            shape="round"
                            className={btn_color_primary}
                            onClick={handleOk}
                        />
                     ]
                 }
                 childreen={
                    <Grid container spacing={1} style={{padding: 10}}>
                        <Grid item xs={6}>
                            <TextInputField
                                id='titleCategorie'
                                className='titleCategorie'
                                value={titleCategorieUpdate}
                                required={true}
                                variant="outlined"
                                label="Titre categorie"
                                onChange={(e) => changeTitleCategorieUpdate(e.target.value)}
                        />
                        </Grid>
                        <Grid item xs={6}>
                            {domaineCategorieUpdate.map((value,index)=>(
                            <Tag key={index} color="magenta">{value}</Tag>)
                            )}
                        </Grid>
                     </Grid>
                 }
                 />
                <div className="mt-50">
                    <Grid container spacing={1} style={{padding: 5}}>
                      <Grid item xs={9}>
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 20}}>
                          <Grid item xs={3}>
                              <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                <div className="flexbox space-around heigt80">
                                  <div className="container_icon">
                                    <MehTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                  </div>
                                  <h3>Total Users</h3>
                                </div>
                                  <div className="absolute container_svg">
                                      <img src={blur} className='' alt='blur' />
                                  </div>
                                  <div className="absolute container_counter">
                                      <h1>{dataDashboard.countTotalAccount}</h1>
                                  </div>

                              </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                  <div className="flexbox space-around heigt80">
                                    <div className="container_icon">
                                      <ShoppingTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                    </div>
                                    <h3>Total Deals</h3>
                                  </div>
                                  <div className="absolute container_svg">
                                      <img src={blur} className='' alt='blur' />
                                  </div>
                                    <div className="absolute container_counter">
                                        <h1>{dataDashboard.countTotalDeals}</h1>
                                    </div>                                
                              </div>
                            
                          </Grid>
                          <Grid item xs={3}>
                            <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                  <div className="flexbox space-around heigt80">
                                    <div className="container_icon">
                                      <CarTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                    </div>
                                    <h3>Total Travel</h3>
                                  </div>
                                  <div className="absolute container_svg">
                                      <img src={blur} className='' alt='blur' />
                                  </div>
                                    <div className="absolute container_counter">
                                        <h1>{dataDashboard.countTotalTravel}</h1>
                                    </div>                                
                              </div>
                            
                          </Grid>
                          <Grid item xs={3}>
                            <div className="shadow_2  border_radius btn_color_primary heigt130 relative">
                                    
                                    <div className="absolute container_svg_second">
                                      <img src={blur} className='' alt='blur' />
                                    </div>
                                      <div className="absolute container_busy">
                                        <CalendarTwoTone twoToneColor={colorError} style={{fontSize: 20}}/>
                                      </div>
                                      <div className="lastCardDahsbord">
                                        <h1>{dataDashboard.countTotalEvent}</h1>
                                        <h4>Total Events</h4>
                                      </div>                          
                              </div>    
                          </Grid>
                          
                        </Grid>
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 5}}>
                          <Grid item xs={2}>
                              <MegaTitleProps title="Transactions" size='xs' />
                          </Grid>
                          <Grid item xs={7}>
                            <div className="container shadow border-radius btn_color_white flexbox flex-center">
                                    <TextInputField
                                        id='searchItems'
                                        className='searchItemsDashbord'
                                        value={searchItems}
                                        required={true}
                                        variant='standard'
                                        placeholder='Recherche nom, chambre, pièce'
                                        onChange={(e) => {
                                          setSearchItems(e.target.value);
                                          if(e.target.value.length > 3) {
                                            setDisabled(false)
                                          }
                                          else {
                                            setDisabled(true)
                                          }
                                        }}
                                    />
                            </div>
                          </Grid>
                          <Grid item xs={3}>
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
                                            message.success('Actualisation terminé');
                                        })
                                    }}
                                />
                          </Grid>
                        </Grid>
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 5}}>
                          <Grid item xs={12}>
                            <DisplayData dataSourceTabsOne={dataDashboard.dataForRechargement} dataSourceTabsTwo={dataDashboard.dataForRetrait} />
                          </Grid>
                          <Grid item xs={6} style={{paddingTop:57}}>
                          <MegaTitleProps title="Evènements du mois" size='sm' />
                            <Card>
                            
                              <RadarChart
                                  cx={195}
                                  cy={175}
                                  outerRadius={100}
                                  width={450}
                                  height={350}
                                  data={dataDashboard.dataRadard}
                                >
                                  <PolarGrid />
                                  <PolarAngleAxis dataKey="forfait" />
                                  <PolarRadiusAxis />
                                  <Radar
                                    dataKey="value"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.6}
                                  />
                                </RadarChart>
                              </Card>
                          </Grid>
                          <Grid item xs={6} style={{paddingTop:57}}>
                          <MegaTitleProps title="Vision Globale" size='sm' />
                            <Card style={{padding:0}}>
                              <PieChart width={470} height={210}>
                                            <Pie
                                              activeIndex={activeIndex}
                                              activeShape={renderActiveShape}
                                              data={[
                                                { name: 'Recharges', value: dataDashboard.reserveRecharge },
                                                { name: 'Events', value: dataDashboard.reserveEvent },
                                                { name: 'Deals', value: dataDashboard.reserveDeals },
                                                { name: 'Travels', value: dataDashboard.reserveTravel },
                                              ]}
                                              cx={220}
                                              cy={95}
                                              innerRadius={60}
                                              outerRadius={80}
                                              fill={colorPrimary}
                                              dataKey="value"
                                              onMouseEnter={onPieEnter}
                                              
                                            >
                                              {COLORS.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry} />
                                              ))}
                                            </Pie>
                              </PieChart>
                            </Card>
                            
                          </Grid>

                          <Grid item xs={12}>
                            <MegaTitleProps title="Articles crées ces 30 jours" size='sm' />
                            <Card style={{padding:0}}>
                                <LineChart
                                  width={1000}
                                  height={300}
                                  data={dataDashboard.dataLine}
                                  margin={{
                                    top: 15,
                                    right: 0,
                                    left: 0,
                                    bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Line type="monotone" name='Simple' dataKey="simpleProduct" stroke="#011f4b" activeDot={{ r: 8 }} />
                                  <Line type="monotone" name='VIP' dataKey="vipProduct" stroke="#82ca9d" />
                                  <Line type="monotone" name='Retourné' dataKey="productNotStaisfait" stroke="#fed766" />
                                  <Line type="monotone" name='Satisfait' dataKey="productStaisfait" stroke="#8884d8" />
                                  <Line type="monotone" name='Validé automatiquement' dataKey="productOverideDate" stroke="#f37736" />
                                  <Line type="monotone" name='Non récupéré' dataKey="productNotRecup" stroke="#fe4a49" />
                                </LineChart>
                              </Card>
                          </Grid>

                          <Grid item xs={12}>
                          <MegaTitleProps title="Voyages en attente" size='sm' />
                            <Table
                              columns={columnsTravel}
                              dataSource={dataDashboard.allTravelInWait} 
                            />
                          </Grid>
                          
                          
                        </Grid>
                        
                      </Grid>
                      <Grid item xs={3}>
                        <Affix offsetTop={top}>
                          <div className="shadow btn_color_white allHeight allWidth border_radius">
                            <Grid container spacing={1} style={{padding: 10}}>
                              <div className="allWidth">
                              <Tabs defaultActiveKey="gestion">
                                
                                <TabPane tab="Gestion" key="gestion">
                                  <Grid container spacing={1} style={{padding: 10}}>
                                      <Grid item xs={5} style={{padding: 0, marginBottom: 10}}>
                                                  <TextInputField
                                                    id='reserveRecharge'
                                                    className='reserveRecharge'
                                                    value={dataDashboard.reserveRecharge}
                                                    required={true}
                                                    variant="outlined"
                                                    type='number'
                                                    suffix={<DollarCircleOutlined />}
                                                    disabled={true}
                                                    label='Recharge'
                                                    />
                                      </Grid>
                                      <Grid item xs={5} style={{padding: 0, marginBottom: 10}}>
                                                  <TextInputField
                                                    id='retraitRecharge'
                                                    className='retraitRecharge'
                                                    value={amountRetraitRecharge}
                                                    required={true}
                                                    variant="outlined"
                                                    type='number'
                                                    label='Montant'
                                                    onChange={(e) => setAmountRetraitRecharge(e.target.value.length >0 ? parseInt(e.target.value, 10): 0)}
                                                />
                                      </Grid>
                                      <Grid item xs={2} style={{padding: 0, marginBottom: 10}}>
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>retraitReserve("recharge")}
                                            onMouseDown={handleMouseDown}
                                            edge="end"
                                            >
                                              <DownCircleOutlined />
                                            </IconButton>
                                      </Grid>


                                      <Grid item xs={5} style={{padding: 0, marginBottom: 10}}>
                                                  <TextInputField
                                                    id='reserveDeals'
                                                    className='reserveDeals'
                                                    value={dataDashboard.reserveDeals}
                                                    required={true}
                                                    variant="outlined"
                                                    type='number'
                                                    suffix={<DollarCircleOutlined />}
                                                    disabled={true}
                                                    label='Deals'
                                                    />
                                      </Grid>
                                      <Grid item xs={5} style={{padding: 0, marginBottom: 10}}>
                                                  <TextInputField
                                                    id='retraitDeals'
                                                    className='retraitDeals'
                                                    value={amountRetraitDeals}
                                                    required={true}
                                                    variant="outlined"
                                                    type='number'
                                                    label='Montant'
                                                    onChange={(e) => setAmountRetraitDeals(e.target.value.length >0 ? parseInt(e.target.value, 10): 0)}
                                                />
                                      </Grid>
                                      <Grid item xs={2} style={{padding: 0, marginBottom: 10}}>
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>retraitReserve("deals")}
                                            onMouseDown={handleMouseDown}
                                            edge="end"
                                            >
                                              <DownCircleOutlined />
                                            </IconButton>
                                      </Grid>



                                      <Grid item xs={5} style={{padding: 0, marginBottom: 10}}>
                                                  <TextInputField
                                                    id='reserveEvent'
                                                    className='reserveEvent'
                                                    value={dataDashboard.reserveEvent}
                                                    required={true}
                                                    variant="outlined"
                                                    type='number'
                                                    suffix={<DollarCircleOutlined />}
                                                    disabled={true}
                                                    label='Event'
                                                    />
                                      </Grid>
                                      <Grid item xs={5} style={{padding: 0, marginBottom: 10}}>
                                                  <TextInputField
                                                    id='retraitEvent'
                                                    className='retraitEvent'
                                                    value={amountRetraitEvent}
                                                    required={true}
                                                    variant="outlined"
                                                    type='number'
                                                    label='Montant'
                                                    onChange={(e) => setAmountRetraitEvent(e.target.value.length >0 ? parseInt(e.target.value, 10): 0)}
                                                />
                                      </Grid>
                                      <Grid item xs={2} style={{padding: 0, marginBottom: 10}}>
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>retraitReserve("event")}
                                            onMouseDown={handleMouseDown}
                                            edge="end"
                                            >
                                              <DownCircleOutlined />
                                            </IconButton>
                                      </Grid>


                                      <Grid item xs={5} style={{padding: 0, marginBottom: 10}}>
                                                  <TextInputField
                                                    id='reserveTravel'
                                                    className='reserveTravel'
                                                    value={dataDashboard.reserveTravel}
                                                    required={true}
                                                    variant="outlined"
                                                    type='number'
                                                    suffix={<DollarCircleOutlined />}
                                                    disabled={true}
                                                    label='Travel'
                                                    />
                                      </Grid>
                                      <Grid item xs={5} style={{padding: 0, marginBottom: 10}}>
                                                  <TextInputField
                                                    id='retraitTravel'
                                                    className='retraitTravel'
                                                    value={amountRetraitTravel}
                                                    required={true}
                                                    variant="outlined"
                                                    type='number'
                                                    label='Montant'
                                                    onChange={(e) => setAmountRetraitTravel(e.target.value.length >0 ? parseInt(e.target.value, 10): 0)}
                                                />
                                      </Grid>
                                      <Grid item xs={2} style={{padding: 0, marginBottom: 10}}>
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>retraitReserve("travel")}
                                            onMouseDown={handleMouseDown}
                                            edge="end"
                                            >
                                              <DownCircleOutlined />
                                            </IconButton>
                                      </Grid>                                      
                                  </Grid>
                                </TabPane>
                                <TabPane tab="Catégories" key="categories">
                                <Grid container spacing={1} style={{paddingLeft: 10}}>
                             
                             <div className="mt-10 allWidth">
                               <Tabs defaultActiveKey="1">
                                 <TabPane tab="Création" key="1">
                                   <Grid container spacing={1} style={{padding: 10}}>
                                         <Grid item xs={12} style={{paddingBottom: 20}}>
                                               <TextInputField
                                                   id='titleCategorie'
                                                   className='titleCategorie'
                                                   value={titleCategorie}
                                                   required={true}
                                                   variant="outlined"
                                                   type='text'
                                                   label='Titre categorie'
                                                   onChange={(e) => changeTitleCategorie(e.target.value)}
                                               />
                                               
                                           </Grid>
                                           <Grid item xs={12} style={{paddingBottom: 20}}>
                                               <CheckBoxs
                                                       row={true}
                                                       labels={["Actualité", "Deals", "Event"]}
                                                       items={
                                                           [
                                                               {
                                                                   checked:checked[0],
                                                                   id:'actu',
                                                                   name:'actu',
                                                                   className: 'actu',
                                                               },
                                                               {
                                                                 checked:checked[1],
                                                                 id:'deals',
                                                                 name:'deals',
                                                                 className: 'deals',
                                                             },
                                                             {
                                                               checked:checked[2],
                                                               id:'event',
                                                               name:'event',
                                                               className: 'event',
                                                           },
                                                           ]
                                                       }
                                                       onChange={onChecked}
                                                   />
                                           </Grid>
                                           <Grid item xs={6} style={{paddingBottom: 20}}>
                                             <Buttons
                                                   id='activationSimple'
                                                   title="Activer"
                                                   shape="round"
                                                   block={true}
                                                   type='dashed'
                                                   onClick={()=> createCategorie(0)}
                                                />
                                           </Grid>
                                           <Grid item xs={6} style={{paddingBottom: 20}}>
                                             <Buttons
                                                   id='activationPopulaire'
                                                   title="Activer & Populaire"
                                                   shape="round"
                                                   block={true}
                                                   className={btn_color_primary}
                                                   onClick={()=> createCategorie(1)}
                                                />
                                           </Grid>
                                   </Grid>
                                 </TabPane>
                                 <TabPane tab="Actualité" key="2">
                                   <Grid container className='categorieList' spacing={1} style={{padding: 10}}>
                                       {dataDashboard.allcategorie.map((value:any, index) =>{
                                         if(value.domaine.indexOf(0) !== -1) {
                                           return <Chip deleteIcon={<EditTwoToneIcon color={value.popularity === 1 ? 'warning': 'inherit'} />} onDelete={()=> handleEdition(value._id, value.domaine, value.name)} onClick={()=> togglePopularityCategorie(value._id)} key={value._id} label={value.name} avatar={<Avatar sx={{bgcolor: value.popularity === 1 ? colorPrimary: colorGreySmoothWith}}>{value.name.substring(0,1).toUpperCase()}</Avatar>} color="warning" variant="outlined" sx={{marginRight: 1, marginBottom:1}} />
                                         }
                                       })}
                                       
                                     </Grid>
                                 </TabPane>
                                 <TabPane tab="Deals" key="3">
                                     <Grid container className='categorieList' spacing={1} style={{padding: 10}}>
                                       {dataDashboard.allcategorie.map((value:any, index) =>{
                                         if(value.domaine.indexOf(1) !== -1) {
                                           return <Chip deleteIcon={<EditTwoToneIcon color={value.popularity === 1 ? 'warning': 'inherit'} />} onDelete={()=> handleEdition(value._id, value.domaine, value.name)} onClick={()=> togglePopularityCategorie(value._id)} key={value._id} label={value.name} avatar={<Avatar sx={{bgcolor: value.popularity === 1 ? colorPrimary: colorGreySmoothWith}}>{value.name.substring(0,1).toUpperCase()}</Avatar>} color="warning" variant="outlined" sx={{marginRight: 1, marginBottom:1}} />
                                         }
                                       })}
                                       
                                     </Grid>
                                 </TabPane>
                                 <TabPane tab="Event" key="4">
                                     <Grid container className='categorieList' spacing={1} style={{padding: 10}}>
                                       {dataDashboard.allcategorie.map((value:any) =>{
                                         if(value.domaine.indexOf(2) !== -1) {
                                           return <Chip deleteIcon={<EditTwoToneIcon color={value.popularity === 1 ? 'warning': 'inherit'} />} onDelete={()=> handleEdition(value._id, value.domaine, value.name)} onClick={()=> togglePopularityCategorie(value._id)} key={value._id} label={value.name} avatar={<Avatar sx={{bgcolor: value.popularity === 1 ? colorPrimary: colorGreySmoothWith}}>{value.name.substring(0,1).toUpperCase()}</Avatar>} color="warning" variant="outlined" sx={{marginRight: 1, marginBottom:1}} />
                                         }
                                       })}
                                       
                                     </Grid>
                                 </TabPane>
                                 
                               </Tabs>
                             </div>
                           </Grid>
                                </TabPane>
                              </Tabs>
                              </div>
                              
                              
                              
                            
                            </Grid>
                          </div>
                        </Affix>     
                      </Grid>
                     </Grid>
                  </div>
                </main>
        </>
      )
    }
}

/*<Fab
            onMouseOver={(event) => {
                    event.stopPropagation()
                    setMessages('Ajouter une nouvelle réservation')
                }
            }
            onClick={() => {
                setVisible(true)
            }}
            onMouseLeave={(event) => {
                event.stopPropagation()
                setMessages('')
                }
            }
            aria-label="add Reservation"
            className={className([classes.fab, classes.fabGreen])}
            color={'inherit' as 'inherit'}
            variant={messages.length > 1 ? "extended" : "round"}>
                <Add />
                {message}
            </Fab>*/