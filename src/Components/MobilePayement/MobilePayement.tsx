import React, { useState, useEffect } from "react";
import { Props } from "../../Interfaces/Props/Navigation";
import MegaTitleProps from "../Components/MegaTitle/MegaTitle";
import { Divider, Grid, Typography } from "@mui/material";
import { message, Select, Tag, Table, Tabs } from "antd";
import { makeStyles } from "@mui/styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionActions from "@mui/material/AccordionActions";
import {
  CloudSyncOutlined,
  ReconciliationTwoTone,
  SaveOutlined,
} from "@ant-design/icons";
import { colorPrimary } from "../../Constants/color";
import UploadTwoToneIcon from "@mui/icons-material/UploadTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BoxLoadings from "../Components/Loading/BoxLoading";
import { Etat } from "../../Constants/Enum";
import { ConsumeApi } from "../../ServiceWorker/ConsumeApi";
import { useNavigate } from "react-router-dom";
import Buttons from "../Components/Buttons/Buttons";
import TextInputField from "../Components/TextInputField/TextInputField";
import { format } from "date-fns";

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
const { Option } = Select;
const reseau = ["orange", "mtn", "wave", "moov"];

function MobilePayement(props: Props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const consumeApi: ConsumeApi = new ConsumeApi();

  const [isFetch, setIsFetch] = useState(true);
  const [name, changeName] = useState("");
  const [numberClient, changeNumberClient] = useState("");
  const [numeroRechargement, changeNumeroRechargement] = useState("");
  const [ref, changeRef] = useState("");
  const [amount, changeAmount] = useState("");
  const [typeReseau, changeReseau] = useState(reseau[0]);
  const [mobileMoney, setMobileMoney] = useState<any[]>([]);
  const [retrait, setRetrait] = useState<any[]>([]);
  const [rechargement, setRechargement] = useState<any[]>([]);

  const loadData = async () => {
    const data = await consumeApi.getManagementMobileMoney();

    if (data.etat === Etat.SUCCESS) {
      const allMobileMoney = data.result.allMobileMoney as any[];
      const verifyTxHashInWait = data.result.verifyTxHashInWait as any[];
      const retraitClientInWait = data.result.retraitClientInWait as any[];
      const allMobileMoneys = allMobileMoney.map((value) => {
        return { ...value, key: value._id };
      });
      const verifyTxHashInWaits = verifyTxHashInWait.map((value) => {
        return { ...value, key: value._id };
      });
      const retraitClientInWaits = retraitClientInWait.map((value) => {
        return { ...value, key: value._id };
      });
      setMobileMoney(allMobileMoneys);
      setRetrait(retraitClientInWaits.reverse());
      setRechargement(verifyTxHashInWaits.reverse());
      setIsFetch(false);
    } else {
      localStorage.clear();
      navigate("/signin");
    }
    setIsFetch(false);
  };

  const submit = async () => {
    if (name.length > 2 && numberClient.length === 10) {
      message.loading("Enregistrement en cours").then(async () => {
        const createAdmin = await consumeApi.createReseau(name, numberClient);
        if (createAdmin.etat === Etat.SUCCESS) {
          message.success(`Un nouveau reseau a été ajouté.`);
          loadData();
          changeName("");
          changeNumberClient("");
        } else if (createAdmin.etat === Etat.ISEXIST) {
          message.warning("Ce numero appartient à un autre employé");
        } else {
          const error = createAdmin.error as Error;
          message.error(error.message);
        }
      });
    } else {
      message.error("Veuillez remplir les champs convenablement");
    }
  };

  const submitRetrait = async (retraitId: string) => {
    message.loading("Transfert de fond en cours").then(async () => {
      const createAdmin = await consumeApi.validateRetrait(retraitId);
      if (createAdmin.etat === Etat.SUCCESS) {
        message.success(`Virement effectué`);
        loadData();
      } else if (createAdmin.etat === Etat.ISEXIST) {
        message.warning("Ce numero appartient à un autre employé");
      } else {
        const error = createAdmin.error as Error;
        message.error(error.message);
      }
    });
  };

  const delRechargement = async (depositId: string) => {
    message.loading("Suppression en cours").then(async () => {
      const createAdmin = await consumeApi.delRechargement(depositId);
      if (createAdmin.etat === Etat.SUCCESS) {
        await loadData();
        message.success(`Suppression effectué`);
      } else if (createAdmin.etat === Etat.ISEXIST) {
        message.warning("Ce numero appartient à un autre employé");
      } else {
        const error = createAdmin.error as Error;
        message.error(error.message);
      }
    });
  };

  const submitManageRechargement = async () => {
    if (
      ref.length > 7 &&
      numeroRechargement.length === 10 &&
      reseau.indexOf(typeReseau) !== -1 &&
      amount.length > 2
    ) {
      message.loading("Enregistrement en cours").then(async () => {
        const createAdmin = await consumeApi.validateRechargement(
          typeReseau,
          numeroRechargement,
          amount,
          ref
        );
        if (createAdmin.etat === Etat.SUCCESS) {
          message.success(`Un nouveau reseau a été ajouté.`);
          loadData();
          changeRef("");
          changeAmount("");
          changeNumeroRechargement("");
          changeReseau(reseau[0]);
        } else if (createAdmin.etat === Etat.ISEXIST) {
          const error = createAdmin.error as Error;
          message.warning(error.message);
        } else {
          const error = createAdmin.error as Error;
          message.error(error.message);
        }
      });
    } else {
      message.error("Veuillez remplir les champs convenablement");
    }
  };

  // Hooks Effet
  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      title: "N° Commande",
      dataIndex: "_id",
      key: "_id",
      fixed: true,
      render: (info: any) => {
        const _id = info as string;
        return (
          <Buttons
            key={`select_${_id}`}
            id={`select_${_id}`}
            type="dashed"
            title={_id.substring(0, 3)}
            tooltip={"Cliquez ici pour l'activer"}
            onClick={() => {
              message.loading("Activation en cours").then(async () => {
                const data = await consumeApi.activeMobileMoney(_id);
                if (data.etat === Etat.SUCCESS) {
                  loadData();
                  message.success("Activation Terminé");
                } else {
                  localStorage.clear();
                  navigate("/signin");
                }
              });
            }}
          />
        );
      },
    },
    { title: "Reseau", dataIndex: "name", key: "name", fixed: true },
    { title: "Numero", dataIndex: "numero", key: "numero" },
    {
      title: "Derniere date d'activité",
      dataIndex: "lasteUpdate",
      key: "lasteUpdate",
    },

    {
      title: "Etat",
      dataIndex: "isActive",
      key: "isActive",
      render: (info: any) => {
        const isActive = info as boolean;
        if (isActive) {
          return <Tag color={"green"}>Actif</Tag>;
        } else {
          return <Tag color={"volcano"}>Desactivé</Tag>;
        }
      },
    },
    {
      title: "Nouveau Solde",
      dataIndex: "newSolde",
      key: "newSolde",
      fixed: true,
    },
  ];

  const columnsScecond = [
    {
      title: "Reseau",
      dataIndex: "typeCrypto",
      key: "typeCrypto",
      fixed: true,
    },
    { title: "Reference", dataIndex: "ref", key: "ref", fixed: true },
    {
      title: "Montant Net",
      dataIndex: "montant_send_net_currencie",
      key: "montant_send_net_currencie",
      fixed: true,
    },
    { title: "Numero", dataIndex: "numero", key: "numero" },

    {
      title: "Etat",
      dataIndex: "state",
      key: "state",
      render: (info: any) => {
        const state = info as number;
        if (state === 1) {
          return <Tag color={"volcano"}>Client dans l'attente</Tag>;
        } else {
          return <Tag color={"green"}>En attente du client</Tag>;
        }
      },
    },
    {
      title: "Date Enregistrement",
      dataIndex: "registerDate",
      key: "registerDate",
      fixed: true,
    },
    {
      title: "Action",
      key: "_id",
      render: (element: string, rowData: any) => {
        return (
          <Buttons
            key={`delRecharment${rowData._id}`}
            id={`delRecharment${rowData._id}`}
            shape="round"
            type="dashed"
            icon={<DeleteTwoToneIcon color="warning" />}
            tooltip="Valider Retrait"
            onClick={async () => {
              await delRechargement(rowData._id);
            }}
          />
        );
      },
    },
  ];

  const columnsRetrait = [
    { title: "Nom", dataIndex: "name", key: "name", fixed: true },
    { title: "Solde Client", dataIndex: "wallet", key: "wallet", fixed: true },
    {
      title: "Montant Local",
      dataIndex: "montant_give_of_client_local_currencie",
      key: "montant_give_of_client_local_currencie",
      fixed: true,
    },
    {
      title: "Montant USD",
      dataIndex: "montant_give_of_client_usd",
      key: "montant_give_of_client_usd",
    },
    { title: "Type", dataIndex: "typeCrypto", key: "typeCrypto" },
    { title: "Adresse", dataIndex: "address", key: "address" },
    {
      title: "Date Operation",
      dataIndex: "registerDate",
      key: "registerDate",
      render: (element: string) => (
        <p key={element}>{format(new Date(element), "dd/MMM/yyyy HH:mm")}</p>
      ),
    },
    { title: "Contact", dataIndex: "contact", key: "contact" },

    {
      title: "Action",
      key: "_id",
      render: (element: string, rowData: any) => {
        return (
          <Buttons
            key="createMobileMoneys"
            id="createMobileMoneys"
            shape="round"
            type="dashed"
            icon={<UploadTwoToneIcon color="warning" />}
            tooltip="Valider Retrait"
            onClick={async () => {
              await submitRetrait(rowData._id);
            }}
          />
        );
      },
    },
  ];

  if (isFetch) {
    return <BoxLoadings />;
  } else {
    return (
      <>
        <main>
          <div className="pt-10">
            <MegaTitleProps title="Manage Transaction" size="md" />
            <Buttons
              key="reload"
              id="reload"
              shape="round"
              type="ghost"
              title="Actualiser"
              icon={<CloudSyncOutlined color={"#fff"} />}
              tooltip="Actualiser"
              onClick={() => {
                message.loading("Actualisation...").then(async () => {
                  await loadData();
                  message.success("Actualisation terminé");
                });
              }}
            />
            <Grid container spacing={1} style={{ padding: 10 }}>
              <div className={classes.root}>
                <Tabs>
                  <TabPane tab="Manage Rechargement" key="1">
                    <Grid container spacing={1} style={{ padding: 20 }}>
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
                                Enregistrer une transaction Rechargement
                              </Typography>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails className={classes.details}>
                            <Grid container spacing={1} style={{ padding: 10 }}>
                              <Grid item xs={3}>
                                <TextInputField
                                  id="numeroRechargement"
                                  className="numeroRechargement"
                                  value={numeroRechargement}
                                  required={true}
                                  prefix={"+225"}
                                  variant="outlined"
                                  label="Numero emeteur"
                                  onChange={(e) =>
                                    changeNumeroRechargement(e.target.value)
                                  }
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextInputField
                                  id="ref"
                                  className="ref"
                                  value={ref}
                                  required={true}
                                  variant="outlined"
                                  label="Reference Transaction"
                                  onChange={(e) => changeRef(e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextInputField
                                  id="amount"
                                  className="amount"
                                  value={amount}
                                  required={true}
                                  variant="outlined"
                                  label="Montant Reçu"
                                  onChange={(e) => changeAmount(e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <Select
                                  placeholder="Select Mobile Network"
                                  onChange={(value) => {
                                    changeReseau(value?.toString() ?? "");
                                  }}
                                  allowClear
                                  showSearch
                                >
                                  {reseau.map((value) => (
                                    <Option key={value} value={value}>
                                      {value.toLocaleUpperCase()}
                                    </Option>
                                  ))}
                                </Select>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                          <Divider />
                          <AccordionActions>
                            <Buttons
                              key="createRechargement"
                              id="createRechargement"
                              shape="round"
                              type="primary"
                              title="Enregistrer"
                              icon={<SaveOutlined color={"#fff"} />}
                              tooltip="Enregistrer cette transaction"
                              onClick={submitManageRechargement}
                            />
                          </AccordionActions>
                        </Accordion>
                      </div>
                    </Grid>

                    <Grid container spacing={1} style={{ padding: 20 }}>
                      <div className={classes.root}>
                        <div className={classes.column}>
                          <Typography className={classes.secondaryHeading}>
                            List Rechargement en attente
                          </Typography>
                          <Table
                            columns={columnsScecond}
                            dataSource={rechargement}
                          />
                        </div>
                      </div>
                    </Grid>
                  </TabPane>
                  <TabPane tab="Manage Retrait" key="2">
                    <Table columns={columnsRetrait} dataSource={retrait} />
                  </TabPane>
                  <TabPane tab="Manage Numero" key="3">
                    <Grid container spacing={1} style={{ padding: 20 }}>
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
                                Ajouter un Mobile Money
                              </Typography>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails className={classes.details}>
                            <Grid container spacing={1} style={{ padding: 10 }}>
                              <Grid item xs={6}>
                                <TextInputField
                                  id="name"
                                  className="name"
                                  value={name}
                                  required={true}
                                  variant="outlined"
                                  label="Reseau"
                                  onChange={(e) => changeName(e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={6}>
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
                            </Grid>
                          </AccordionDetails>
                          <Divider />
                          <AccordionActions>
                            <Buttons
                              key="createMobileMoneys"
                              id="createMobileMoneys"
                              shape="round"
                              type="primary"
                              title="Enregistrer"
                              icon={<SaveOutlined color={"#fff"} />}
                              tooltip="Enregistrer cet Article"
                              onClick={submit}
                            />
                          </AccordionActions>
                        </Accordion>
                      </div>
                    </Grid>

                    <Grid container spacing={1} style={{ padding: 20 }}>
                      <div className={classes.root}>
                        <div className={classes.column}>
                          <Typography className={classes.secondaryHeading}>
                            List Mobile Money
                          </Typography>
                          <Table columns={columns} dataSource={mobileMoney} />
                        </div>
                      </div>
                    </Grid>
                  </TabPane>
                </Tabs>
              </div>
            </Grid>
          </div>
        </main>
      </>
    );
  }
}

export default MobilePayement;
