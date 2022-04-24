import React, {useState} from 'react';
import { Props } from '../../Interfaces/Props/Navigation';
import { Grid, Avatar } from '@mui/material';
import { colorPrimary } from '../../Constants/color';
import Modals from '../Components/Modals/Modals';
import Buttons from '../Components/Buttons/Buttons';
import { btn_color_primary } from '../../Constants/ClassName/Buttons';
import {  Affix, Tabs } from 'antd';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import { MehTwoTone,  CarTwoTone, ShoppingTwoTone } from '@ant-design/icons';
import blur from '../../Assets/Images/svg/blur.svg'
import BoxLoadings from '../Components/Loading/BoxLoading';
const { TabPane } = Tabs;
const top = 10;

export default function DashboardAdmin(props: Props) {
    const [visible, setVisible] = useState(false);
    const [loading, setloading] = useState(false);
    const [isFetch, setIsFetch] = useState(true);

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
                    <MegaTitleProps title="Tableau de Bord ADMIN" size='md' />
                    <Grid container spacing={1} style={{padding: 10}}>
                      <Grid item xs={9}>
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 20}}>
                          <Grid item xs={3}>
                              <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                <div className="flexbox space-around heigt80">
                                  <div className="container_icon">
                                    <MehTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                  </div>
                                  <h3>Total Actualité</h3>
                                </div>
                                  <div className="absolute container_svg">
                                      <img src={blur} className='' alt='blur' />
                                  </div>
                                  <div className="absolute container_counter">
                                      <h1>0</h1>
                                  </div>

                              </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                  <div className="flexbox space-around heigt80">
                                    <div className="container_icon">
                                      <ShoppingTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                    </div>
                                    <h3>Total Categorie Actualité</h3>
                                  </div>
                                  <div className="absolute container_svg">
                                      <img src={blur} className='' alt='blur' />
                                  </div>
                                    <div className="absolute container_counter">
                                        <h1>0</h1>
                                    </div>                                
                              </div>
                            
                          </Grid>
                          <Grid item xs={3}>
                            <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                                  <div className="flexbox space-around heigt80">
                                    <div className="container_icon">
                                      <CarTwoTone twoToneColor={colorPrimary} style={{fontSize: 20}}/>
                                    </div>
                                    <h3>Total Admin Actuality</h3>
                                  </div>
                                  <div className="absolute container_svg">
                                      <img src={blur} className='' alt='blur' />
                                  </div>
                                    <div className="absolute container_counter">
                                        <h1>0</h1>
                                    </div>                                
                              </div>
                            
                          </Grid>
                          <Grid item xs={3}>
                            <div className="shadow_2  border_radius btn_color_primary heigt130 relative">
                                    
                                    <div className="absolute container_svg_second">
                                      <img src={blur} className='' alt='blur' />
                                    </div>
                                      <div className="absolute container_busy">
                                          <h4>40%</h4>
                                      </div>
                                      <div className="lastCardDahsbord">
                                        <h1>0</h1>
                                        <h4>Total Events</h4>
                                      </div>                          
                              </div>    
                          </Grid>
                          
                        </Grid>
                        <Grid container spacing={3} style={{padding: 0, marginBottom: 20}}>
                          
                        </Grid>
                        
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
                                    
                                    </Grid>
                                  </TabPane>
                                  <TabPane tab="Revenus" key="2">
                                  <Grid container spacing={1} style={{padding: 0}}>
                                    
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