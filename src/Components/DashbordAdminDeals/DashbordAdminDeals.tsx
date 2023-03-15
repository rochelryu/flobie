import React, { useState, useEffect, useCallback, useRef } from "react";
import { Props } from "../../Interfaces/Props/Navigation";
import {
  Card,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Divider,
  AccordionActions,
  Button,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import {
  colorPrimary,
  colorGreySmoothWith,
  colorError,
} from "../../Constants/color";
import Modals from "../Components/Modals/Modals";
import Buttons from "../Components/Buttons/Buttons";
import { btn_color_primary } from "../../Constants/ClassName/Buttons";
import { message, Affix, Table, Tabs, Tag, Form, Space, Input } from "antd";
import MegaTitleProps from "../Components/MegaTitle/MegaTitle";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  MehTwoTone,
  DollarCircleOutlined,
  DownCircleOutlined,
  SearchOutlined,
  CarTwoTone,
  ShoppingTwoTone,
  CalendarTwoTone,
  CloudSyncOutlined,
  MinusCircleOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ScheduleOutlined,
  DislikeOutlined,
  EyeInvisibleOutlined,
  ReconciliationTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import blur from "../../Assets/Images/svg/blur.svg";
import TextInputField from "../Components/TextInputField/TextInputField";
import BoxLoadings from "../Components/Loading/BoxLoading";
import DisplayData from "../Components/DisplayData/DisplayData";
import { ConsumeApi } from "../../ServiceWorker/ConsumeApi";
import { Etat } from "../../Constants/Enum";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CheckBoxs from "../Components/CheckBox/CheckBoxs";
import { format } from "date-fns";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: 15,
  },
  heading: {
    fontSize: 20,
  },
  secondaryHeading: {
    fontSize: 15,
    color: colorPrimary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid grey`,
    padding: 10,
  },
  link: {
    color: colorPrimary,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});
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
    value,
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
  const classes = useStyles();
  const navigate = useNavigate();
  const consumeApi: ConsumeApi = new ConsumeApi();
  const [checked, setChecked] = useState([false, false, false]);
  const [isFetch, setIsFetch] = useState(true);
  const [dataDashboard, setDataDashboard] = useState({
    countTotalAccount: 0,
    countTotalDealsApproved: 0,
    countTotalArticle: 0,
    countTotalCategorie: 0,
    countTotalDealsInWaitApprobation: 0,
    countTotalDealsInRejectAuto: 0,
    countTotalDealsNotSatisfait: 0,
    countTotalDealsInAuoValidate: 0,
    countTotalDealsNotApproved: 0,
    countTotalDealsInValidate: 0,
    allcategorie: [],
    dataLine: [],
    columnsDelivery: [],
    allProductNotFound: [],
  });
  const [address, changeAddress] = useState("");
  const [password, changePassword] = useState("");
  const [titleNotification, changeTitleNotification] = useState("");
  const [destinate, changeDestinate] = useState("");
  const [bodyNotification, changeBodyNotification] = useState("");
  const [imgUrlNotification, changeImgUrlNotification] = useState("");
  const [name, changeName] = useState("");
  const [numberClient, changeNumberClient] = useState("");
  const [viewPassWord, setViewPassWord] = useState(false);
  const [form] = Form.useForm();

  // Hooks Effet
  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async (values: any) => {
    console.log(values)
  };

  const createDelivery = async () => {
    if (
      name.length > 4 &&
      address.length > 5 &&
      password.length > 7 &&
      numberClient.length === 10
    ) {
      message.loading("Enregistrement en cours").then(async () => {
        const createAdmin = await consumeApi.createDelivery(
          name,
          address,
          numberClient,
          password
        );
        if (createAdmin.etat === Etat.SUCCESS) {
          message.success(`Un nouveau livreur a été ajouté.`);
          loadData();
          changeAddress("");
          changePassword("");
          changeName("");
          changeNumberClient("");
        } else if (createAdmin.etat === Etat.ISEXIST) {
          message.warning("Ce numero appartient à un autre livreur");
        } else {
          const error = createAdmin.error as Error;
          message.error(error.message);
        }
      });
    } else {
      message.error("Veuillez remplir les champs convenablement");
    }
  };

  const createNotificationCeter = async (values: any) => {
    if (
      titleNotification.length > 3 &&
      bodyNotification.length > 10 &&
      imgUrlNotification.length > 5
    ) {
      message.loading("Enregistrement en cours").then(async () => {
        let info:any = {};
        values.sights.map(( item : {key:string, value:string} ) => {
          info[item.key] = item.value;
        })
        console.log(destinate);
        console.log(destinate.split(','));
        const createNotification = await consumeApi.createNotificationCenter(
          titleNotification.trim(),
          bodyNotification.trim(),
          imgUrlNotification.trim(),
          info,
          destinate.split(',')[0] === "" ? []: destinate.split(',')
        );
        if (createNotification.etat === Etat.SUCCESS) {
          message.success(`Notification a été ajouté avec succès.`);
          loadData();
          changeTitleNotification("");
          changeBodyNotification("");
          changeImgUrlNotification("");
          changeDestinate("");
          form.resetFields();
        } else {
          const error = createNotification.error as Error;
          message.error(error.message);
        }
      });
    } else {
      message.error("Veuillez remplir les champs convenablement");
    }
  };

  const columnsDelivery = [
    { title: "Name", dataIndex: "name", key: "name", fixed: true },
    { title: "Prefix", dataIndex: "prefix", key: "prefix", fixed: true },
    { title: "Numero", dataIndex: "numero", key: "numero", fixed: true },
    { title: "Adresse", dataIndex: "address", key: "address", fixed: true },
    {
      title: "Progression Aujourd'hui",
      dataIndex: "_id",
      fixed: true,
      render: (_id: string, rowData: any) => {
        return (
          <Tag key={_id} color={"green"}>
            {rowData.allToday - rowData.doneToday}/{rowData.allToday}
          </Tag>
        );
      },
    },
    {
      title: "Total effectué",
      dataIndex: "allCourse",
      key: "allCourse",
      fixed: true,
    },
  ];

  const handleClickShowPassword = () => {
    const oldViewPassWord = viewPassWord;
    setViewPassWord(!oldViewPassWord);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function loadData() {
    const data = await consumeApi.getDahsboardAdminDeals();
    if (data.etat === Etat.SUCCESS) {
      setDataDashboard(data.result);
      setIsFetch(false);
    } else {
      localStorage.clear();
      navigate("/signin");
    }
  }

  const COLORS = ["#F8B195", "#F67280", "#99B898", "#355C7D"];

  if (isFetch) {
    return <BoxLoadings />;
  } else {
    return (
      <>
        <main>
          <div className="mt-50">
            <Grid container spacing={1} style={{ padding: 5 }}>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={3}
                  style={{ padding: 0, marginBottom: 20 }}
                >
                  <Grid item xs={3}>
                    <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                      <div className="flexbox space-around heigt80">
                        <div className="container_icon">
                          <ShopOutlined
                            color={colorPrimary}
                            style={{ fontSize: 20 }}
                          />
                        </div>
                        <h3>Total Article</h3>
                      </div>
                      <div className="absolute container_svg">
                        <img src={blur} className="" alt="blur" />
                      </div>
                      <div className="absolute container_counter">
                        <h1>{dataDashboard.countTotalArticle}</h1>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                      <div className="flexbox space-around heigt80">
                        <div className="container_icon">
                          <CheckCircleOutlined
                            color={colorPrimary}
                            style={{ fontSize: 20 }}
                          />
                        </div>
                        <h3>Articles Approuvés</h3>
                      </div>
                      <div className="absolute container_svg">
                        <img src={blur} className="" alt="blur" />
                      </div>
                      <div className="absolute container_counter">
                        <h1>{dataDashboard.countTotalDealsApproved}</h1>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                      <div className="flexbox space-around heigt80">
                        <div className="container_icon">
                          <LoadingOutlined
                            color={colorPrimary}
                            style={{ fontSize: 20 }}
                          />
                        </div>
                        <h3>Articles en attente</h3>
                      </div>
                      <div className="absolute container_svg">
                        <img src={blur} className="" alt="blur" />
                      </div>
                      <div className="absolute container_counter">
                        <h1>{dataDashboard.countTotalDealsNotApproved}</h1>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                      <div className="flexbox space-around heigt80">
                        <div className="container_icon">
                          <ScheduleOutlined
                            color={colorPrimary}
                            style={{ fontSize: 20 }}
                          />
                        </div>
                        <h3>Articles satisfaisant</h3>
                      </div>
                      <div className="absolute container_svg">
                        <img src={blur} className="" alt="blur" />
                      </div>
                      <div className="absolute container_counter">
                        <h1>{dataDashboard.countTotalDealsInValidate}</h1>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="shadow_1 border_radius btn_color_white heigt130 flexbox relative">
                      <div className="flexbox space-around heigt80">
                        <div className="container_icon">
                          <ScheduleOutlined
                            color={colorPrimary}
                            style={{ fontSize: 20 }}
                          />
                        </div>
                        <h3>Articles Auto-Validé</h3>
                      </div>
                      <div className="absolute container_svg">
                        <img src={blur} className="" alt="blur" />
                      </div>
                      <div className="absolute container_counter">
                        <h1>{dataDashboard.countTotalDealsInAuoValidate}</h1>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="shadow_2  border_radius btn_color_primary heigt130 relative">
                      <div className="absolute container_svg_second">
                        <img src={blur} className="" alt="blur" />
                      </div>
                      <div className="absolute container_busy">
                        <ShoppingTwoTone
                          twoToneColor={colorError}
                          style={{ fontSize: 20 }}
                        />
                      </div>
                      <div className="lastCardDahsbord">
                        <h1>
                          {dataDashboard.countTotalDealsInWaitApprobation}
                        </h1>
                        <h4>Article chez le client</h4>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="shadow_2  border_radius btn_color_primary heigt130 relative">
                      <div className="absolute container_svg_second">
                        <img src={blur} className="" alt="blur" />
                      </div>
                      <div className="absolute container_busy">
                        <DislikeOutlined
                          color={colorError}
                          style={{ fontSize: 20 }}
                        />
                      </div>
                      <div className="lastCardDahsbord">
                        <h1>{dataDashboard.countTotalDealsNotSatisfait}</h1>
                        <h4>Article retourné</h4>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="shadow_2  border_radius btn_color_primary heigt130 relative">
                      <div className="absolute container_svg_second">
                        <img src={blur} className="" alt="blur" />
                      </div>
                      <div className="absolute container_busy">
                        <EyeInvisibleOutlined
                          color={colorError}
                          style={{ fontSize: 20 }}
                        />
                      </div>
                      <div className="lastCardDahsbord">
                        <h1>{dataDashboard.countTotalDealsInRejectAuto}</h1>
                        <h4>Fournisseur introuvable</h4>
                      </div>
                    </div>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={3}
                  style={{ padding: 0, marginBottom: 5 }}
                >
                  <Grid item xs={12}>
                    <MegaTitleProps
                      title="Articles crées ces 30 jours"
                      size="sm"
                    />
                    <Card style={{ padding: 0 }}>
                      <LineChart
                        width={1300}
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
                        <Line
                          type="monotone"
                          name="Simple"
                          dataKey="simpleProduct"
                          stroke="#011f4b"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          name="VIP"
                          dataKey="vipProduct"
                          stroke="#82ca9d"
                        />
                        <Line
                          type="monotone"
                          name="Retourné"
                          dataKey="productNotStaisfait"
                          stroke="#fed766"
                        />
                        <Line
                          type="monotone"
                          name="Satisfait"
                          dataKey="productStaisfait"
                          stroke="#8884d8"
                        />
                        <Line
                          type="monotone"
                          name="Validé automatiquement"
                          dataKey="productOverideDate"
                          stroke="#f37736"
                        />
                        <Line
                          type="monotone"
                          name="Non récupéré"
                          dataKey="productNotRecup"
                          stroke="#fe4a49"
                        />
                      </LineChart>
                    </Card>
                  </Grid>
                </Grid>

                

                <div className="pt-10">
                  <MegaTitleProps title="Ajout Notification Center" size="md" />
                  <Grid container spacing={1} style={{ padding: 10 }}>
                    <div className={classes.root}>
                      <Accordion defaultExpanded>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1c-content"
                          id="panel1c-header"
                        >
                          <div className={classes.column}>
                            <ReconciliationTwoTone
                              twoToneColor={colorPrimary}
                              style={{ fontSize: 32 }}
                            />
                          </div>
                          <div className={classes.column}>
                            <Typography className={classes.secondaryHeading}>
                              Créer une notification In-App
                            </Typography>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                          <Grid container spacing={1} style={{ padding: 10 }}>
                            <Grid item xs={3}>
                              <TextInputField
                                id="createTitle"
                                className="createTitle"
                                value={titleNotification}
                                required={true}
                                variant="outlined"
                                label="Titre"
                                
                                type="text"
                                onChange={(e) => changeTitleNotification(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={8}>
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <TextInputField
                                    id="bodyNotification"
                                    className="bodyNotification"
                                    value={bodyNotification}
                                    required={true}
                                    variant="outlined"
                                    label="Description"
                                    onChange={(e) => changeBodyNotification(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextInputField
                                    id="imgUrlNotification"
                                    className="imgUrlNotification"
                                    value={imgUrlNotification}
                                    required={true}
                                    variant="outlined"
                                    type="text"
                                    label="Lien image"
                                    onChange={(e) =>
                                      changeImgUrlNotification(e.target.value)
                                    }
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <Form
                                    form={form}
                                    name="control-hooks"
                                    onFinish={createNotificationCeter}
                                  >
                                    <Form.List name="sights">
                                      {(fields, { add, remove }) => (
                                        <>
                                          {fields.map((field) => (
                                            <Space key={field.key} align="baseline">
                                              <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, curValues) =>
                                                  prevValues.area !== curValues.area ||
                                                  prevValues.sights !== curValues.sights
                                                }
                                              >
                                                {() => (
                                                  <Form.Item
                                                    {...field}
                                                    label="Key"
                                                    name={[field.name, "key"]}
                                                    fieldKey={[field.key, "key"]}
                                                    rules={[
                                                      {
                                                        required: false,
                                                        message: "D",
                                                      },
                                                    ]}
                                                  >
                                                   <Input />
                                                  </Form.Item>
                                                )}
                                              </Form.Item>
                                              <Form.Item
                                                {...field}
                                                label="Value"
                                                name={[field.name, "value"]}
                                                fieldKey={[field.key, "value"]}
                                                rules={[{ required: false }]}
                                              >
                                                <Input />
                                              </Form.Item>

                                              <MinusCircleOutlined
                                                onClick={() => remove(field.name)}
                                              />
                                            </Space>
                                          ))}

                                          <Form.Item>
                                            <Buttons
                                              key="addItemTable"
                                              id="addItemTable"
                                              type="ghost"
                                              title="Ajouter"
                                              onClick={() => add()}
                                            />
                                          </Form.Item>
                                        </>
                                      )}
                                    </Form.List>
                                  </Form>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <TextInputField
                                  id="createDestinate"
                                  className="createDestinate"
                                  value={destinate}
                                  required={true}
                                  variant="outlined"
                                  label="Destinate Client"
                                  
                                  type="text"
                                  onChange={(e) => changeDestinate(e.target.value)}
                                />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                        <Divider />
                        <AccordionActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={()=> {form.submit()}}
                          >
                            Enregistrer
                          </Button>
                        </AccordionActions>
                      </Accordion>
                    </div>
                  </Grid>
                  <Grid container spacing={1} style={{ padding: 20 }}>
                    <div className={classes.root}>
                      <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>
                          Liste Livreur
                        </Typography>
                        <Table
                          columns={columnsDelivery}
                          dataSource={dataDashboard.columnsDelivery}
                          rowKey="numero"
                        />
                      </div>
                    </div>
                  </Grid>
                </div>

                <div className="pt-10">
                  <MegaTitleProps title="Ajout Livreur" size="md" />
                  <Grid container spacing={1} style={{ padding: 10 }}>
                    <div className={classes.root}>
                      <Accordion defaultExpanded>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1c-content"
                          id="panel1c-header"
                        >
                          <div className={classes.column}>
                            <ReconciliationTwoTone
                              twoToneColor={colorPrimary}
                              style={{ fontSize: 32 }}
                            />
                          </div>
                          <div className={classes.column}>
                            <Typography className={classes.secondaryHeading}>
                              Créer un livreur de section
                            </Typography>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                          <Grid container spacing={1} style={{ padding: 10 }}>
                            <Grid item xs={3}>
                              <TextInputField
                                id="password"
                                className="createPassword"
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
                                    {!viewPassWord ? (
                                      <Visibility />
                                    ) : (
                                      <VisibilityOff />
                                    )}
                                  </IconButton>
                                }
                                type={viewPassWord ? "text" : "password"}
                                onChange={(e) => changePassword(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={8}>
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <TextInputField
                                    id="name"
                                    className="createName"
                                    value={name}
                                    required={true}
                                    variant="outlined"
                                    label="Nom et prénoms"
                                    onChange={(e) => changeName(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextInputField
                                    id="number"
                                    className="createNumber"
                                    value={numberClient}
                                    required={true}
                                    variant="outlined"
                                    prefix="+225"
                                    type="number"
                                    label="Numéro de téléphone"
                                    onChange={(e) =>
                                      changeNumberClient(e.target.value)
                                    }
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextInputField
                                    id="address"
                                    className="createAddress"
                                    value={address}
                                    required={true}
                                    variant="outlined"
                                    label="Adresse"
                                    onChange={(e) =>
                                      changeAddress(e.target.value)
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                        <Divider />
                        <AccordionActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={createDelivery}
                          >
                            Enregistrer
                          </Button>
                        </AccordionActions>
                      </Accordion>
                    </div>
                  </Grid>
                  <Grid container spacing={1} style={{ padding: 20 }}>
                    <div className={classes.root}>
                      <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>
                          Liste Livreur
                        </Typography>
                        <Table
                          columns={columnsDelivery}
                          dataSource={dataDashboard.columnsDelivery}
                          rowKey="numero"
                        />
                      </div>
                    </div>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
        </main>
      </>
    );
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
