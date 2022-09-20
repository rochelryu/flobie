import React, { useState, useEffect } from 'react'
import { Props } from '../../Interfaces/Props/Navigation';
import MegaTitleProps from '../Components/MegaTitle/MegaTitle';
import { Divider, Grid, Typography } from '@mui/material';
import { message,Select, Table, Tag, Form, Input, Button,Space, Popconfirm} from 'antd';
import { makeStyles } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionActions from '@mui/material/AccordionActions';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import { ReconciliationTwoTone, SaveOutlined,MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
import { colorPrimary } from '../../Constants/color';
import Buttons from '../Components/Buttons/Buttons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BoxLoadings from '../Components/Loading/BoxLoading';
import { Etat } from '../../Constants/Enum';
import { ConsumeApi } from '../../ServiceWorker/ConsumeApi';
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';


const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: 15
  },
  gridAction: {
    width: "150px !important",
    margin: 15,
    padding: 5
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

const sights = [
    { label: 'ONLY_TEXT', value: 'only_text' },
    { label: 'PICTURE_TEXT', value: 'picture_text' },
    { label: 'SUBTITLE_TEXT', value: 'subtitle_text' },
    { label: 'ONLY_PICTURE', value: 'only_picture' },
  ];
function AddActuality(props: Props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const consumeApi: ConsumeApi = new ConsumeApi();
    const [form] = Form.useForm();
    const [isFetch, setIsFetch] = useState(true);
    const [actualities, setActualities] = useState<any[]>([]);
    const [categorieActualities, setCategorieActualities] = useState<any[]>([]);

    const loadData = async () => {
      const data = await consumeApi.getActualities();
      const resultActuality = data.result.allActuality as any[];
      const resultCategorie = data.result.allCategorieForActuality as any[];
      const allActuality = resultActuality.map(value => {
        return {...value, key: value._id}
      });
      const categories = resultCategorie.map(value => {
        return {...value, key: value._id}
      });
      if(data.etat === Etat.SUCCESS) {
        setActualities(allActuality);
        setCategorieActualities(categories);
        setIsFetch(false);
      } else {
        localStorage.clear();
        navigate('/signin');
        
      }
    }
    const onFinish = async (values: any) => {
        const createActuality = await consumeApi.createActuality(values.autherName.trim(),values.authorProfil.trim(),values.categorie.trim(), values.imageCover.trim(),values.title.trim(),values.sights);
        if(createActuality.etat === Etat.SUCCESS) {
            message.success(`Un article a été ajouté.`);
            loadData();
            form.resetFields();
        } else {
            const error = createActuality.error as Error;
            message.error(error.message);
        }
      };
    
      const onReset = () => {
        form.resetFields();
      };



    // Hooks Effet
    useEffect(() => {
      loadData();
    }, []);


    const columns = [
        { title: 'Action', dataIndex: '_id', key:'_id',fixed: true,render: (element:string,rowData:any) => {
            return  <Grid container spacing={1} className={classes.gridAction}>
                        <Grid item xs={6}>
                            <Buttons
                                key={`view${rowData._id}`}
                                id={`view${rowData._id}`}
                                shape="round"
                                type="dashed"
                                icon={<VisibilityTwoToneIcon color='primary' />}
                                tooltip="Voir"
                                onClick={() => {
                                    /*changePictureEditActuality(rowData.cover);
                                    changeTitleActuality(rowData.title);
                                    changeidItemEdit(rowData.id);
                                    changeContenAcituality(rowData.content);
                                    setModalActualityVisible(true);*/
                                    
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Popconfirm
                                title="Êtes-vous sûr de vouloir supprimer"
                                onConfirm={async() => {await delItem(rowData._id)}}
                                onCancel={() => {}}
                                okText="Oui"
                                cancelText="Non"
                            >
                                <DeleteTwoToneIcon color='warning' />
                            </Popconfirm>
                        </Grid>
                    </Grid>
                } },
        { title: 'Title', dataIndex: 'title', key:'title' },
        { title: 'Autheur', dataIndex: 'autherName', key:'email' },
        { title: 'Categorie', dataIndex: 'categorieName', key:'categorieName' },
        { title: 'Nbre Vue', dataIndex: 'numberVue', key:'numberVue' },
        
        { title: 'Popularité', dataIndex: 'popularity', key:'popularity',render: (info:any) => {
          const popularity = info as number;
          if(popularity === 2) {
            return (
              <Tag color={'green'}>
                Populaire
              </Tag>
            );
          } else {
            return (
              <Tag color={'geekblue'}>
                En cours
              </Tag>
            );
          }
        }
        },
        { title: 'Date Enr', dataIndex: 'registerDate', key:'registerDate',render: (info:any) => {
            const registerDate = info as string;
            return <p>{format(new Date(registerDate), 'dd/MM/yyyy')} à {format(new Date(registerDate), 'HH:mm')}</p>;
          } },
      ];

      const onCategorieChange = (value: string) => {
        form.setFieldsValue({ categorie: value });
      };

      const onSearch = (value: string) => {
        console.log('search:', value);
      };

      const delItem = async (itemId:string) => {
        message.loading("Suppression en cours")
        .then(async () => {
            console.log(itemId);
          const deleteItem = await consumeApi.deleteActuality(itemId);
          console.log(deleteItem);
              if(deleteItem.etat === Etat.SUCCESS) {
                  await loadData();
                  message.success(`Suppression effectué`);
              } else {
                const error = deleteItem!.error as Error;
                message.error(error.message);
            }
        })
      
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
                        <MegaTitleProps title="Add Actuality" size='md' />
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
                                        <Typography className={classes.secondaryHeading}>Créer un article</Typography>
                                    </div>
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.details}>
                                        <Grid container spacing={1} style={{padding: 10}}>
                                            <Form form={form} name="control-hooks" onFinish={onFinish}>
                                            
                                                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="imageCover" label="Article Cover" rules={[{ required: true }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="autherName" label="Auther Name" rules={[{ required: true }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="authorProfil" label="Auther Profil" rules={[{ required: true }]}>
                                                    <Input />
                                                </Form.Item>
                                                
                                                <Form.Item name="categorie" label="Categorie" rules={[{ required: true }]}>
                                                    <Select
                                                    placeholder="Select categorie"
                                                    onChange={onCategorieChange}
                                                    allowClear
                                                    optionFilterProp="children"
                                                    onSearch={onSearch}
                                                    filterOption={(input, option) =>
                                                      (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    
                                                    >
                                                    {categorieActualities.map(value => (<Option key={value._id} value={value._id}>{value.name}</Option>))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.List name="sights">
                                                    {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(field => (
                                                        <Space key={field.key} align="baseline">
                                                            <Form.Item
                                                            noStyle
                                                            shouldUpdate={(prevValues, curValues) =>
                                                                prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                                            }
                                                            >
                                                            {() => (
                                                                <Form.Item
                                                                {...field}
                                                                label="Type"
                                                                name={[field.name, 'isContentType']}
                                                                fieldKey={[field.key, 'isContentType']}
                                                                rules={[{ required: true, message: 'Missing Type' }]}
                                                                >
                                                                <Select style={{ width: 130 }}>
                                                                    {sights.map(item => (
                                                                    <Option key={item.value} value={item.value}>
                                                                        {item.label}
                                                                    </Option>
                                                                    ))}
                                                                </Select>
                                                                </Form.Item>
                                                            )}
                                                            </Form.Item>
                                                            <Form.Item
                                                            {...field}
                                                            label="Title Section"
                                                            name={[field.name, 'inTitle']}
                                                            fieldKey={[field.key, 'inTitle']}
                                                            rules={[{ required: false}]}
                                                            >
                                                            <Input />
                                                            </Form.Item>
                                                            <Form.Item
                                                            {...field}
                                                            label="Image Section"
                                                            name={[field.name, 'inImage']}
                                                            fieldKey={[field.key, 'inImage']}
                                                            rules={[{ required: false}]}
                                                            >
                                                            <Input />
                                                            </Form.Item>

                                                            <Form.Item
                                                            {...field}
                                                            label="Content Section"
                                                            name={[field.name, 'inContent']}
                                                            fieldKey={[field.key, 'inContent']}
                                                            rules={[{ required: false}]}
                                                            >
                                                            <Input.TextArea />
                                                            </Form.Item>

                                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                        </Space>
                                                        ))}

                                                        <Form.Item>
                                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                            Add Paragraphe
                                                        </Button>
                                                        </Form.Item>
                                                    </>
                                                    )}
                                                </Form.List>
                                                <Form.Item>
                                                </Form.Item>
                                            </Form>
                                        </Grid>
                                        
                                    </AccordionDetails>
                                    <Divider />
                                    <AccordionActions>
                                    <Buttons
                                        key="createArticle"
                                        id='createArticle'
                                        shape="round"
                                        type="primary"
                                        title="Enregistrer"
                                        icon={<SaveOutlined color={'#fff'} />}
                                        tooltip='Enregistrer cet Article'
                                        onClick={()=> {
                                            form.submit()
                                        }}
                                    />
                                    <Buttons
                                        key="resetArticle"
                                        id='resetArticle'
                                        shape="round"
                                        type="dashed"
                                        title="Vider"
                                        tooltip='Vider le formulaire'
                                        onClick={onReset}
                                    />
                                    </AccordionActions>
                                </Accordion>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: 20}}>
                            <div className={classes.root}>
                              <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>List Actualité</Typography>
                                <Table columns={columns} dataSource={actualities} />
                              </div>
                            </div>
                        </Grid>
                    </div>
                </main>
            </>
        )
    }
}

export default AddActuality;