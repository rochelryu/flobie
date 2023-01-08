import React, { useState, useEffect } from 'react'
import { Props } from '../../Interfaces/Props/Navigation';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import { Divider, Button, Grid, Typography, IconButton } from '@mui/material';
import { message,Select, Table, Tag} from 'antd';
import { makeStyles } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionActions from '@mui/material/AccordionActions';
import { ReconciliationTwoTone } from '@ant-design/icons';
import { colorPrimary } from '../../Constants/color';
import TextInputField from '../Components/TextInputField/TextInputField';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BoxLoadings from '../Components/Loading/BoxLoading';
import { level_role } from '../../Constants/function';
import { BuiltinRoleAdmin, Etat } from '../../Constants/Enum';
import { ConsumeApi } from '../../ServiceWorker/ConsumeApi';
import { useNavigate } from "react-router-dom";


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
const { Option } = Select;

function  arrayOptionForRole (role: string): {value: string}[] {
  const levelRole = level_role(role);
  if(levelRole === 0) {
    return [
      {
        value: BuiltinRoleAdmin.ADMIN_ACTUALITY,
      },
      {
        value: BuiltinRoleAdmin.ADMIN_DEALS,
      },
      {
        value: BuiltinRoleAdmin.ADMIN_EVENTS,
      },
      {
        value: BuiltinRoleAdmin.ADMIN_COVOITURAGES,
      },
      {
        value: BuiltinRoleAdmin.ADMIN_MOBILE_MONEY_BOOT,
      },
    ];
  } else if(levelRole === 1) {
    return [
      {
        value: 'EMPLOYER_' + role.split('_')[1]
      }
    ]
  } else {
    return [];
  }
}
function Reserve(props: Props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const consumeApi: ConsumeApi = new ConsumeApi();
    const role = localStorage.getItem('role') ?? '';
    const roleArray = arrayOptionForRole(role);
    const [piece, changePiece] = useState('');
    const [password, changePassword] = useState('');
    const [name, changeName] = useState('');
    const [numberClient, changeNumberClient] = useState('');
    const [roleChoie, changeRoleChoice] = useState('');
    const [isFetch, setIsFetch] = useState(true);
    const [employers, setEmployers] = useState<any[]>([]);
    const [viewPassWord, setViewPassWord] = useState(false);

    const loadData = async () => {
      const data = await consumeApi.getEmployer();
      
      if(data.etat === Etat.SUCCESS) {
        const result = data.result as any[];
      const dataWithKey = result.map(value => {
        return {...value, key: value.id}
      })
        setEmployers(dataWithKey);
        setIsFetch(false);
      } else {
        localStorage.clear();
        navigate('/signin');
        
      }
    }
    
    const connection = async () => {
      if (name.length > 4 && piece.length > 5 && password.length > 7 && numberClient.length === 10 && roleChoie !== '') {
          message.loading("Enregistrement en cours")
          .then(async () => {
            const createAdmin = await consumeApi.createAdmin(name,piece,'+225', roleChoie,numberClient,password);
                if(createAdmin.etat === Etat.SUCCESS) {
                    message.success(`Un nouvelle ${roleChoie} a été ajouté.`);
                    loadData();
                    changePiece('');
                    changePassword('');
                    changeName('');
                    changeNumberClient('');
                } else if(createAdmin.etat === Etat.ISEXIST) {
                    message.warning('Ce numero appartient à un autre employé');
                } else {
                  const error = createAdmin.error as Error;
                  message.error(error.message);
              }
          })
          
      }
      else {
          message.error("Veuillez remplir les champs convenablement")
      }
  }



    // Hooks Effet
    useEffect(() => {
      loadData();
    }, []);


    const columns = [
        { title: 'Name', dataIndex: 'name', key:'name',fixed: true },
        { title: 'Email', dataIndex: 'email', key:'email',fixed: true },
        { title: 'Prefix', dataIndex: 'prefix', key:'prefix',fixed: true },
        { title: 'Numero', dataIndex: 'numero', key:'numero',fixed: true },
        { title: 'Role', dataIndex: 'role', key:'role',fixed: true },
        { title: 'Locked', dataIndex: 'admissible', key:'admissible',fixed: true,render: (tags:any) => {
          const admissible = tags as boolean;
          if(admissible) {
            return (
              <Tag color={'green'}>
                Actif
              </Tag>
            );
          } else {
            return (
              <Tag color={'volcano'}>
                Verrouillé
              </Tag>
            );
          }
        }
        },
      ];

      const handleClickShowPassword = () => {
        const oldViewPassWord = viewPassWord
        setViewPassWord(!oldViewPassWord)
      };
    
      const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };

    


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
                        <MegaTitleProps title="Ajout Subordonné" size='md' />
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
                                        <Typography className={classes.secondaryHeading}>Créer un employé de section</Typography>
                                    </div>
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.details}>
                                        <Grid container spacing={1} style={{padding: 10}}>
                                            <Grid item xs={3}>
                                                <TextInputField
                                                                id='piece'
                                                                className='createPiece'
                                                                value={piece}
                                                                required={true}
                                                                variant="outlined"
                                                                label="email"
                                                                onChange={(e) => changePiece(e.target.value)}
                                                            />
                                                            <br />
                                                            <br />
                                                            <TextInputField
                                                                id='password'
                                                                className='createPassword'
                                                                value={password}
                                                                required={true}
                                                                variant="outlined"
                                                                label="Mot de passe"
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
                                                                onChange={(e) => changePassword(e.target.value)}
                                                            />
                                                            
                                                
                                                
                                            </Grid>
                                            <Grid item xs={8}>
                                            <Grid container spacing={1} >
                                                <Grid item xs={4}>
                                                    <TextInputField
                                                            id='name'
                                                            className='createName'
                                                            value={name}
                                                            required={true}
                                                            variant="outlined"
                                                            label="Nom et prénoms"
                                                            onChange={(e) => changeName(e.target.value)}
                                                        />
                                                        
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextInputField
                                                            id='number'
                                                            className='createNumber'
                                                            value={numberClient}
                                                            required={true}
                                                            variant="outlined"
                                                            prefix='+225'
                                                            type='number'
                                                            label="Numéro de téléphone"
                                                            onChange={(e) => changeNumberClient(e.target.value)}
                                                        />
                                                </Grid>
                                                <Grid item xs={4}>
                                                  <Select
                                                    showSearch
                                                    placeholder="Select ROLE"
                                                    style={{width: "100%"}}
                                                    optionFilterProp="children"
                                                    onChange={(value)=>{
                                                      const newRole = value?.toString() ?? '';
                                                      changeRoleChoice(newRole);
                                                    }}
                                                    
                                                  >
                                                    {roleArray.map((value, index) => (<Option key={index} value={value.value}>{value.value}</Option>))}
                                                  </Select>
                                                </Grid>
                                                
                                            </Grid>

                                          
                                            
                                            </Grid>
                                        </Grid>
                                        
                                    </AccordionDetails>
                                    <Divider />
                                    <AccordionActions>
                                    <Button size="small" color="primary" onClick={connection}>
                                        Enregistrer
                                    </Button>
                                    </AccordionActions>
                                </Accordion>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: 20}}>
                            <div className={classes.root}>
                              <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>List Subordonnée</Typography>
                                <Table columns={columns} dataSource={employers}/>
                              </div>
                            </div>
                        </Grid>
                    </div>
                </main>
            </>
        )
    }
}

export default Reserve;