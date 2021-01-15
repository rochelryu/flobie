import React, {useState, useEffect} from 'react';
import { Props } from '../../Interfaces/Props/Navigation';
import { Card, Grid, Avatar } from '@material-ui/core';
import { colorPrimary } from '../../Constants/color';
import Modals from '../Components/Modals/Modals';
import Buttons from '../Components/Buttons/Buttons';
import { btn_color_primary } from '../../Constants/ClassName/Buttons';
import { message, Table, Affix, Tabs } from 'antd';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import { HomeTwoTone, TagsTwoTone, SearchOutlined } from '@ant-design/icons';
import blur from '../../Assets/Images/svg/blur.svg'
import TextInputField from '../Components/TextInputField/TextInputField';
import BoxLoadings from '../Components/Loading/BoxLoading';
import {Bar} from 'react-chartjs-2';
import DisplayData from '../Components/DisplayData/DisplayData'
const { TabPane } = Tabs;
const top = 10;
export default function Dashboard(props: Props) {
    const [searchItems, setSearchItems] = useState('')
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [loading, setloading] = useState(false)
    const [isFetch, setIsFetch] = useState(true)
    
    


    // Hooks Effet
    useEffect(() => {
      /*function waitForAction(state: boolean) {
          setTimeout(()=> setIsFetch(state), 2000)
      }
      waitForAction(false)*/
      setTimeout(()=> {
        setIsFetch(false)
      }, 2000)
      // return () => {
      //   setTimeout(()=> {
      //     setIsFetch(false)
      //   }, 2000)
      //   setIsFetch(true)
      // }

    });


    const handleOk = () => {
        setloading(true)
        setTimeout(()=>{
            setloading(false)
            setVisible(false)
        }, 2500)
    }
    const handleCancel = () => {
            setVisible(false)
    }

    const datas = {
      labels: ['1', '2', '3', '4', '5', '6', '7'],
      datasets: [
        {
          label: 'Revenus',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: [35000, 59000, 80000, 81000, 56000, 55000, 40000]
        }
      ]
    };

    const datass = {
      labels: ['1', '2', '3', '4', '5', '6', '7'],
      datasets: [
        {
          label: 'Réservations',
          backgroundColor: 'rgba(249,168,38,0.2)',
          borderColor: 'rgba(249,168,38,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(249,168,38,0.4)',
          hoverBorderColor: 'rgba(249,168,38,1)',
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };

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



    const columns = [
        {
          title: 'PIÈCE',
          
          dataIndex: 'cni',
          key: 'cni',
          fixed: true,
        },{
            title: 'Nom',
            
            dataIndex: 'name',
            key: 'name',
            fixed: true,
            sorter: {
              compare: (a: any, b: any) => a.name - b.name,
              multiple: 3,
            },
          },{
            title: 'Prénoms',
            
            dataIndex: 'firstname',
            key: 'firstname',
          },
        {
          title: 'Contact',
          
          dataIndex: 'contact',
          key: 'contact',
        },
        {
            title: 'Chambre',
            
            dataIndex: 'chambre',
            key: 'chambre',
            sorter: {
              compare: (a: any, b: any) => a.chambre - b.chambre,
              multiple: 2,
            },
          },
          {
            title: 'Temps',
            
            dataIndex: 'temps',
            key: 'temps',
          },
        {
          title: "Date d'entrée",
          key: 'register_date',
          dataIndex: 'register_date',
          sorter: {
            compare: (a: any, b: any) => a.register_date - b.register_date,
            multiple: 1,
          },
          
        },
      ];
      
      const data = [];
      for (let i = 0; i < 100; i++) {
        data.push({
          key: i,
          name: `Edrward ${i}`,
          firstname: `Edrward Edrward Edrward Edrward Edrward Edrward${i}`,
          chambre: `Edrward ${i}`,
          temps: `${i} heures`,
          cni: `Edrward Edrward ${i}`,
          register_date: `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`,
          contact: '+225 32 87 09 98',
        });
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
                <Modals
                 visible={visible}
                 loading={loading}
                 title={'Ajouter une nouvelle réservation'}
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
                            key="create"
                            id='create'
                            title="Créer"
                            shape="round"
                            className={btn_color_primary}
                            onClick={handleOk}
                        />
                     ]
                 }
                 childreen={
                     <>
                     
                     </>
                 }
                 />
                <div className="pt-10">
                    <MegaTitleProps title="Tableau de Bord" size='md' />
                    <Grid container spacing={1} style={{padding: 10}}>
                      <Grid item xs={9}>
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 20}}>
                          <Grid item xs={4}>
                              <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                <div className="flexbox space-around heigt80">
                                  <div className="container_icon">
                                    <TagsTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                  </div>
                                  <h3>Total Réservation</h3>
                                </div>
                                  <div className="absolute container_svg">
                                      <img src={blur} className='' alt='blur' />
                                  </div>
                                  <div className="absolute container_counter">
                                      <h1>59</h1>
                                  </div>

                              </div>
                          </Grid>
                          <Grid item xs={4}>
                            <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                  <div className="flexbox space-around heigt80">
                                    <div className="container_icon">
                                      <HomeTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                    </div>
                                    <h3>Total Chambre</h3>
                                  </div>
                                  <div className="absolute container_svg">
                                      <img src={blur} className='' alt='blur' />
                                  </div>
                                    <div className="absolute container_counter">
                                        <h1>19</h1>
                                    </div>                                
                              </div>
                            
                          </Grid>
                          <Grid item xs={4}>
                            <div className="shadow_2  border_radius btn_color_primary heigt130 relative">
                                    
                                    <div className="absolute container_svg_second">
                                      <img src={blur} className='' alt='blur' />
                                    </div>
                                      <div className="absolute container_busy">
                                          <h4>40%</h4>
                                      </div>
                                      <div className="lastCardDahsbord">
                                        <h1>8</h1>
                                        <h4>Chambre occupées</h4>
                                      </div>                          
                              </div>    
                          </Grid>
                        </Grid>
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 20}}>
                          <Grid item xs={2}>
                              <MegaTitleProps title="Réservations" size='xs' />
                          </Grid>
                          <Grid item xs={7}>
                            <div className="container shadow border-radius btn_color_white flexbox flex-center">
                                    <TextInputField
                                        id='searchItems'
                                        className='searchItemsDashbord'
                                        value={searchItems}
                                        required={true}
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
                                  id='recherche'
                                  title='Rechercher'
                                  shape="round"
                                  block={true}
                                  type="dashed"
                                  className={!disabled ? btn_color_primary : ''}
                                  disabled={disabled}
                                  onClick={connection}
                                  icon={<SearchOutlined color={'#fff'} />}
                                  tooltip='Lancer la recherche'
                            />
                          </Grid>
                        </Grid>
                        <DisplayData columns={columns} dataSource={data} />
                          {/* <Table columns={columns} dataSource={data} scroll={ {y: 400}} /> */}
                      </Grid>
                      <Grid item xs={3}>
                        <Affix offsetTop={top}>
                          <div className="shadow btn_color_white allHeight allWidth border_radius">
                            <Grid container spacing={1} style={{padding: 10}}>
                              <MegaTitleProps title="Aujourd'hui" size='sm' />

                              <Grid item xs={5}>
                                  <div className="flexbox flex-center flex-column">
                                  <Avatar className={btn_color_primary}>37</Avatar>
                                  <p className="color_grey">Rsv</p>
                                  </div>
                              </Grid>
                              <Grid item xs={7}>
                              <div className="flexbox flex-center flex-column">
                              <MegaTitleProps title="99 000 frs" size='sm' color={colorPrimary} />
                                <p className="color_grey">Rev</p>
                              </div>
                                
                              </Grid>
                            
                            </Grid>

                            <Grid container spacing={1} style={{padding: 10}}>
                              <MegaTitleProps title="Cette semaine" size='sm' />

                              <div className="mt-10 allWidth">
                                <Tabs defaultActiveKey="1">
                                  <TabPane tab="Réservations" key="1">
                                  <Grid container spacing={1} style={{padding: 0}}>
                                    <Bar
                                      data={datass}
                                      width={100}
                                      height={150}
                                      options={{
                                        maintainAspectRatio: true
                                      }}
                                    />
                                    </Grid>
                                  </TabPane>
                                  <TabPane tab="Revenus" key="2">
                                  <Grid container spacing={1} style={{padding: 0}}>
                                    <Bar
                                      data={datas}
                                      width={100}
                                      height={150}
                                      options={{
                                        maintainAspectRatio: true
                                      }}
                                    />
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