import React, { useState, useEffect } from "react";
import { Props } from "../../Interfaces/Props/Navigation";
import MegaTitleProps from "../Components/MegaTitle/MegaTitle";
import { Divider, Grid, Typography } from "@mui/material";
import {
  message,
  Select,
  Tag,
  Table,
  Space,
  Steps,
  Image,
  DatePicker,
  Empty,
  Skeleton,
  Card,
} from "antd";
import { makeStyles } from "@mui/styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionActions from "@mui/material/AccordionActions";
import {
  ReconciliationTwoTone,
  CloseCircleOutlined,
  CloudSyncOutlined,
} from "@ant-design/icons";
import { colorPrimary } from "../../Constants/color";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BoxLoadings from "../Components/Loading/BoxLoading";
import { level_role } from "../../Constants/function";
import { Etat } from "../../Constants/Enum";
import { ConsumeApi } from "../../ServiceWorker/ConsumeApi";
import { useNavigate } from "react-router-dom";
import Buttons from "../Components/Buttons/Buttons";
import Cards from "../Components/Cards/Cards";

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

function EmployerCovoiturage(props: Props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const consumeApi: ConsumeApi = new ConsumeApi();
  const [itemSelect, setItemSelect] = React.useState("");

  const [selected, setSelected] = React.useState(0);
  const [traveller, setTraveller] = React.useState({
    piece: [],
    numero: "",
    profilConducteurCover: "",
    name: "",
    position: "",
  });

  const [isFetch, setIsFetch] = useState(true);
  const [travellersDemandes, setTravellersDemandes] = useState<any[]>([]);

  const sectionDetails = (selectedItem: number) => {
    if (selectedItem === 0) {
      return <Empty />;
    } else if (selectedItem === 1) {
      return <Skeleton active />;
    } else {
      return (
        <Grid container spacing={1} style={{ padding: 20 }}>
          <Grid item xs={4}>
            <Cards
              tooltip={`Passager: ${traveller.name}`}
              title={`Demande Passager de ${traveller.name}`}
              id="vendeur"
              cover={
                <img
                  alt="example"
                  src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.profilConducteurCover}`}
                />
              }
              description={`N°: ${traveller.numero}\nPosition ${
                traveller.position ?? "N/A"
              },`}
            />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading}>
                Pièce
              </Typography>
            </div>
            <Grid container spacing={1} style={{ padding: 5 }}>
              <Grid item xs={6}>
                <Card style={{ width: "100%" }}>
                  <Image
                    width={"100%"}
                    src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.piece[0]}`}
                  />
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card style={{ width: "100%" }}>
                  <Image
                    width={"100%"}
                    src={`${consumeApi.AssetTravelServer}${itemSelect}/${traveller.piece[1]}`}
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  };
  const loadData = async () => {
    const data = await consumeApi.getPassagersDemandes();

    if (data.etat === Etat.SUCCESS) {
      const resultTravellersDemandes = data.result
        .allTravellersPassagers as any[];
      const allTravellersDemandes = resultTravellersDemandes.map((value) => {
        return { ...value, key: value._id };
      });
      setTravellersDemandes(allTravellersDemandes);
      setIsFetch(false);
    } else {
      localStorage.clear();
      navigate("/signin");
    }
  };

  // Hooks Effet
  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      title: "N° Identitifiant",
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
            title={_id}
            tooltip={"Cliquez ici pour le gerer"}
            onClick={async () => {
              setItemSelect(_id);
              setSelected(1);
              const data = await consumeApi.getDetailsPassagersDemande(_id);
              if (data.etat === Etat.SUCCESS) {
                setTraveller(data.result);
                setSelected(2);
              } else {
                localStorage.clear();
                navigate("/signin");
              }
            }}
          />
        );
      },
    },
    { title: "Nom", dataIndex: "name", key: "name" },
    { title: "Lieu Recent", dataIndex: "position", key: "position" },
    { title: "Contact", dataIndex: "numero", key: "numero" },
  ];

  const dropPassagerDemande = () => {
    message.loading("Annulation en cours").then(async () => {
      const data = await consumeApi.dropPassagerDemande(itemSelect);
      if (data.etat === Etat.SUCCESS) {
        message.success("Annulation terminé");
        setItemSelect("");

        setSelected(0);
        const resultTravellersDemandes = data.result
          .allTravellersPassagers as any[];
        const allTravellersDemandes = resultTravellersDemandes.map((value) => {
          return { ...value, key: value._id };
        });
        setTravellersDemandes(allTravellersDemandes);
      } else {
        const error = data.error as Error;
        message.error(error.message);
      }
    });
  };

  const validatePassagerDemande = () => {
    message.loading("Validation en cours").then(async () => {
      const data = await consumeApi.validatePassagerDemande(itemSelect);
      if (data.etat === Etat.SUCCESS) {
        message.success("Validation terminé");
        setItemSelect("");

        setSelected(0);
        const resultTravellersDemandes = data.result
          .allTravellersPassagers as any[];
        const allTravellersDemandes = resultTravellersDemandes.map((value) => {
          return { ...value, key: value._id };
        });
        setTravellersDemandes(allTravellersDemandes);
      } else {
        const error = data.error as Error;
        message.error(error.message);
      }
    });
  };

  if (isFetch) {
    return <BoxLoadings />;
  } else {
    return (
      <>
        <main>
          <div className="pt-10">
            <MegaTitleProps title="Product Command" size="md" />
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
                        Detail Passager
                      </Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className={classes.details}>
                    <Grid container spacing={1} style={{ padding: 10 }}>
                      {sectionDetails(selected)}
                    </Grid>
                  </AccordionDetails>
                  <Divider />
                  <AccordionActions>
                    <Buttons
                      key="annuler"
                      id="annuler"
                      shape="round"
                      type="ghost"
                      danger={true}
                      title="Annuler"
                      icon={<CloseCircleOutlined color={"#fff"} />}
                      tooltip="Annuler Demande"
                      onClick={dropPassagerDemande}
                    />
                    <Buttons
                      key="doneCommand"
                      id="doneCommand"
                      shape="round"
                      type="primary"
                      title="Valider"
                      tooltip="Terminé"
                      onClick={validatePassagerDemande}
                    />
                  </AccordionActions>
                </Accordion>
              </div>
            </Grid>
            <Grid container spacing={1} style={{ padding: 20 }}>
              <div className={classes.root}>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>
                    List Demande Passager en cours
                  </Typography>
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
                        setItemSelect("");
                        setSelected(0);
                        message.success("Actualisation terminé");
                      });
                    }}
                  />
                  <Table
                    columns={columns}
                    dataSource={travellersDemandes}
                    rowKey="_id"
                  />
                </div>
              </div>
            </Grid>
          </div>
        </main>
      </>
    );
  }
}

export default EmployerCovoiturage;
