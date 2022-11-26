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

export default function DashbordAdminDeals(props: Props) {
    const navigate = useNavigate();
    const consumeApi: ConsumeApi = new ConsumeApi();
    const [checked, setChecked] = useState([false, false,false]);
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
                
                <div className="mt-50">
                    <Grid container spacing={1} style={{padding: 5}}>
                      <Grid item xs={12}>
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 20}}>
                          <Grid item xs={3}>
                              <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                <div className="flexbox space-around heigt80">
                                  <div className="container_icon">
                                    <MehTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                  </div>
                                  <h3>Total ventes</h3>
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
                                    <h3>Total articles acheté</h3>
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
                                    <h3>Total articles remboursés</h3>
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
                                        <h4>Chiffres des ventes</h4>
                                      </div>                          
                              </div>    
                          </Grid>
                          
                        </Grid>
                        
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 5}}>
                          
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
                          
                          
                        </Grid>
                        
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