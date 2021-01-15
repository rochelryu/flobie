import React, { useState, useEffect } from 'react'
import { Props } from '../../Interfaces/Props/Navigation';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import { Divider, Chip, Button, Grid, Typography } from '@material-ui/core';
import { message, DatePicker, Table, Affix, Tabs, Cascader} from 'antd';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import { ReconciliationTwoTone, FolderOpenTwoTone } from '@ant-design/icons';
import { colorPrimary } from '../../Constants/color';
import TextInputField from '../Components/TextInputField/TextInputField';
import Buttons from '../Components/Buttons/Buttons';
import { btn_color_primary } from '../../Constants/ClassName/Buttons';
import { PermIdentity } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BoxLoadings from '../Components/Loading/BoxLoading';

const { RangePicker } = DatePicker;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: 15
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
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
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }),
);

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
function Reserve(props: Props) {
    const classes = useStyles();

    const connection = async () => {
        if (name.length > 4) {
            message.loading("Recherche en cours")
            const data = totalClient;
            data.push(`${name} | ${numberClient.length === 8 ? numberClient : "N/A"}`)
            changeTotalClient(data)
            changeName('');
            changeNumberClient('');
        }
        else {
            message.error("Veuillez faire entrer quelque chose à de valide")
        }
    }

    const [piece, changePiece] = useState('');
    const [name, changeName] = useState('');
    const [numberClient, changeNumberClient] = useState('');
    const [totalClient, changeTotalClient] = useState(['']);
    const [isFetch, setIsFetch] = useState(true);


    const columns = [
        { title: 'Name', field: 'name' },
        { title: 'Surname', field: 'surname' },
        { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
        {
          title: 'Birth Place',
          field: 'birthCity',
          lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
        },
      ];
    const data = [
        { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
        {
          name: 'Zerya Betül',
          surname: 'Baran',
          birthYear: 2017,
          birthCity: 34,
        },
      ];

    const displayRender = (label: any) => {
      return label[label.length - 1];
    } 
    const onDeleteChip = (index: number) => {
        const data = totalClient;
        const entry = data[index].split('|')
        data.splice(index, 1);
        changeTotalClient(data);
        changeName(entry[0].trim());
        changeNumberClient(entry[1].trim() === 'N/A' ? '' : entry[1].trim() );
    }

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
        // }<MaterialTables title={"Toutes les réservations"} columns={columns} data={data} />
  
      });

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
                        <MegaTitleProps title="Réservations" size='md' />
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
                                        <Typography className={classes.secondaryHeading}>Créer une réservation</Typography>
                                    </div>
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.details}>
                                        <Grid container spacing={1} style={{padding: 10}}>
                                            <Grid item xs={4}>
                                                <TextInputField
                                                                id='piece'
                                                                className='createPiece'
                                                                value={piece}
                                                                required={true}
                                                                variant="outlined"
                                                                label="Numero pièce"
                                                                onChange={(e) => changePiece(e.target.value)}
                                                            />
                                                            <br />
                                                <Typography variant="caption">
                                                    Choisir la periode de debut et fin de la reservation
                                                    <br />
                                                </Typography>
                                                <RangePicker showTime onChange={(date, dateString)=> {
                                                    console.log(date, dateString)
                                                }} placeholder={["Date debut", "Date fin"]} />
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
                                                    <Cascader
                                                          options={options}
                                                          expandTrigger="click"
                                                          displayRender={displayRender}
                                                          onChange={(value)=> message.success(value)}
                                                        />
                                                </Grid>
                                                
                                            </Grid>

                                            <Grid container spacing={1} style={{padding: 5, overflow: 'auto'}}>
                                            {totalClient.map((value, index) => index > 0 ? <Grid key={index} item xs={4}><Chip label={value} variant="outlined" size="small" icon={<PermIdentity />} onDelete={()=> {onDeleteChip(index)}} /></Grid> : null)}
                                            </Grid>
                                            
                                            </Grid>
                                        </Grid>
                                        
                                    </AccordionDetails>
                                    <Divider />
                                    <AccordionActions>
                                    <Button size="small" color="primary">
                                        Enregistrer
                                    </Button>
                                    </AccordionActions>
                                </Accordion>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: 20}}>
                            <div className={classes.root}>
                            
                            </div>
                        </Grid>
                    </div>
                </main>
            </>
        )
    }
}

export default Reserve;