import React, { useState, useEffect } from "react";
import { Props } from "../../Interfaces/Props/Navigation";
import MegaTitleProps from "../Components/MegaTitle/MegaTitle";
import TextInputField from "../Components/TextInputField/TextInputField";
import { Divider, Grid, Typography } from "@mui/material";
import {
  message,
  Select,
  Carousel,
  Tag,
  Table,
  Steps,
  Input,
  Empty,
  Skeleton,
  InputNumber,
  DatePicker,
  notification,
} from "antd";
import type { DatePickerProps } from "antd";
import { makeStyles } from "@mui/styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionActions from "@mui/material/AccordionActions";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  GiftOutlined,
  ReconciliationTwoTone,
  SwapRightOutlined,
  WalletOutlined,
  CloudSyncOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { colorError, colorPrimary } from "../../Constants/color";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BoxLoadings from "../Components/Loading/BoxLoading";
import { Etat } from "../../Constants/Enum";
import { ConsumeApi } from "../../ServiceWorker/ConsumeApi";
import { useNavigate } from "react-router-dom";
import Buttons from "../Components/Buttons/Buttons";
import Cards from "../Components/Cards/Cards";
import "./EmployerDash.scss";

type NotificationType = "success" | "info" | "warning" | "error";

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: 15,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 900,
    color: colorError,
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

const items = [
  {
    title: "Assigner Livreur",
  },
  {
    title: "Vendeur",
  },
  {
    title: "En route",
  },
  {
    title: "Central",
  },
  {
    title: "Acheteur",
  },
];

function EmployerDash(props: Props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const consumeApi: ConsumeApi = new ConsumeApi();
  const [current, setCurrent] = useState(0);
  const [levelDelivery, setLevelDelivery] = useState(-1);
  const [itemSelect, setItemSelect] = useState("");
  const [itemProductForValidate, setItemProductForValidate] = useState("");
  const [commentProductForValidate, setCommentProductForValidate] =
    useState("");
  const [priceDelivery, setPriceDelivery] = useState("");
  const [priceArticle, setPriceArticle] = useState("");
  const [productInfo, setProductInfo] = useState<any>({});
  const [deliveryUserId, setDeliveryUserId] = useState("");
  const [deliveryManInfo, changeDeliveryManInfo] = useState("");
  const [dateDelivery, setDateDelivery] = useState("");
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selected, setSelected] = useState(0);
  const [selectedProductInfo, setSelectedProductInfo] = useState(0);

  const [isFetch, setIsFetch] = useState(true);
  const [orderImageProduct, setOrderImageProduct] = useState<string[]>([]);
  const [commandes, setCommandes] = useState<any[]>([]);
  const [dealsInWait, setDealsInWait] = useState<any[]>([]);
  const [allDeliveries, setAllDeliveries] = useState<any[]>([]);

  const [seller, setSeller] = useState({
    name: "",
    avatar: "",
    description: "",
    wallet: 0,
  });
  const [buyer, setBuyer] = useState({
    name: "",
    avatar: "",
    deliveryFree: 0,
    description: "",
    wallet: 0,
  });
  const [product, setProduct] = useState({
    name: "",
    cover: "",
    description: "",
    wallet: 0,
  });

  const onSelectDate: DatePickerProps["onChange"] = (date, dateString) => {
    setDateDelivery(dateString);
  };

  const [restReservation, setRestReservation] = useState({
    citySeller: "",
    cityBuyer: "",
    deliveryUserId: "",
    state: 0,
    priceDelivery: 0,
    deliveryManInfo: "",
    descriptionConvoyeur: "",
  });

  const openNotificationWithIcon = (
    type: NotificationType,
    notificationTitle: string,
    descriptionTitle: string
  ) => {
    notificationApi[type]({
      message: notificationTitle,
      description: descriptionTitle,
      placement: "bottomRight",
    });
  };

  const next = () => {
    if (current === 0) {
      if (
        restReservation.cityBuyer === "" ||
        restReservation.citySeller === "" ||
        deliveryUserId === "" ||
        dateDelivery === ""
      ) {
        message.error(
          "Veuillez remplir les lieux pour la reception et le depot du colis d'abord"
        );
      } else {
        message.loading("Enregistrement en cours").then(async () => {
          const data = await consumeApi.setDeleveryProductLevelOne(
            restReservation.cityBuyer,
            restReservation.citySeller,
            itemSelect,
            deliveryUserId,
            dateDelivery,
            restReservation.deliveryManInfo,
            restReservation.priceDelivery
          );
          if (data.etat === Etat.SUCCESS) {
            message.success(
              "Enregistrement terminé, toutes les parties ont été informé"
            );
            setCurrent(current + 1);
          } else {
            const error = data.error as Error;
            openNotificationWithIcon(
              "error",
              "Solde Insuffisant",
              error.message
            );
            message.error(error.message);
          }
        });
      }
    } else if (current === 1) {
      message.loading("Enregistrement en cours").then(async () => {
        const data = await consumeApi.setDeleveryProductLevelTwo(itemSelect);
        if (data.etat === Etat.SUCCESS) {
          message.success(
            "Enregistrement terminé, toutes les parties ont été informé"
          );
          setCurrent(current + 1);
        } else {
          const error = data.error as Error;
          message.error(error.message);
        }
      });
    } else if (current === 2) {
      message.loading("Enregistrement en cours").then(async () => {
        const data = await consumeApi.setDeleveryProductLevelThree(
          restReservation.cityBuyer,
          itemSelect,
          restReservation.priceDelivery,
          restReservation.deliveryManInfo
        );
        if (data.etat === Etat.SUCCESS) {
          message.success(
            "Enregistrement terminé, toutes les parties ont été informé"
          );
          setItemSelect("");
          setSelected(0);
        } else {
          const error = data.error as Error;
          message.error(error.message);
        }
      });
    }
  };

  const validate = (type: boolean) => {
    if (itemProductForValidate !== "") {
      message.loading("Traitement en cours").then(async () => {
        const data = await consumeApi.approvedProductOrNot(
          type,
          commentProductForValidate,
          itemProductForValidate,
          priceDelivery,
          priceArticle,
          orderImageProduct
        );
        if (data.etat === Etat.SUCCESS) {
          setCommentProductForValidate("");
          setSelectedProductInfo(0);
          await loadData();
          message.success("Traitement terminé.");
        } else {
          const error = data.error as Error;
          message.error(error.message);
        }
      });
    } else {
      message.error("Veuillez sélectionner d'abord l'article");
    }
  };

  const rembourser = (levelDelivery: number) => {
    message.loading("Enregistrement en cours").then(async () => {
      const data = await consumeApi.rembourseClient(itemSelect, levelDelivery);
      if (data.etat === Etat.SUCCESS) {
        await loadData();
        setItemSelect("");
        setSelected(0);
      } else {
        const error = data.error as Error;
        message.error(error.message);
      }
    });
  };

  const removeDeals = () => {
    message.loading("Enregistrement en cours").then(async () => {
      const data = await consumeApi.removeDeals(itemSelect);
      if (data.etat === Etat.SUCCESS) {
        await loadData();
        setItemSelect("");
        setSelected(0);
      } else {
        const error = data.error as Error;
        message.error(error.message);
      }
    });
  };

  const reformatContent = (currentIndex: number) => {
    if (currentIndex === -1) {
      return (
        <Grid container spacing={1} style={{ padding: 20 }}>
          <Grid item xs={3}>
            <Cards
              tooltip={`Vendeur: ${seller.name}`}
              avatar={`${consumeApi.AssetProfilServer}${seller.avatar}`}
              title="Vendeur"
              id="vendeur"
              description={seller.description}
              actions={[
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid item xs={3}>
                    <WalletOutlined />
                  </Grid>
                  <Grid item xs={9}>
                    {seller.wallet}
                  </Grid>
                </Grid>,
              ]}
            />
          </Grid>
          <Grid item xs={2}>
            <Cards
              tooltip={`Produit: ${product.name}`}
              cover={
                <img
                  alt="example"
                  src={`${consumeApi.AssetProductServer}${product.cover}`}
                />
              }
              title={product.name}
              id="produit"
              description={product.description}
            />
          </Grid>
          <Grid item xs={3}>
            <Cards
              tooltip={`Acheteur: ${buyer.name}`}
              avatar={`${consumeApi.AssetProfilServer}${buyer.avatar}`}
              title="Acheteur"
              id="acheteur"
              description={buyer.description}
              actions={[
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid item xs={3}>
                    <WalletOutlined />
                  </Grid>
                  <Grid item xs={3}>
                    {buyer.wallet}
                  </Grid>
                  <Grid item xs={3}>
                    <GiftOutlined />
                  </Grid>
                  <Grid item xs={3}>
                    {buyer.deliveryFree}
                  </Grid>
                </Grid>,
              ]}
            />
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={1} style={{ padding: 5 }}>
              <Grid item xs={6}>
                <Select
                  showSearch
                  style={{ width: "100%", marginTop: 10 }}
                  placeholder="Selection Livreur"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(value) =>
                    setDeliveryUserId(value?.toString() ?? "")
                  }
                  allowClear
                  options={allDeliveries.map((value) => {
                    return {
                      value: value._id.toString(),
                      label: `${value.name} | ${value.notFinished}`,
                    };
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  placeholder="Date de livraison"
                  onChange={onSelectDate}
                  style={{ width: "100%", marginTop: 10 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  value={restReservation.citySeller}
                  placeholder="Lieu Vendeur"
                  onChange={(e) => {
                    setRestReservation({
                      ...restReservation,
                      citySeller: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  value={restReservation.cityBuyer}
                  placeholder="Lieu Acheteur"
                  onChange={(e) => {
                    setRestReservation({
                      ...restReservation,
                      cityBuyer: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={7} style={{ marginTop: 10 }}>
                <TextInputField
                  id="deliveryManInfo"
                  className="deliveryManInfo"
                  value={restReservation.deliveryManInfo}
                  required={true}
                  variant="outlined"
                  label="Info suplementaire"
                  onChange={(e) => {
                    setRestReservation({
                      ...restReservation,
                      deliveryManInfo: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={5} style={{ marginTop: 10 }}>
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  value={restReservation.priceDelivery}
                  placeholder="Prix livraison"
                  onChange={(value) => {
                    setRestReservation({
                      ...restReservation,
                      priceDelivery: value as number,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    } else if (currentIndex === 2) {
      return (
        <Grid container spacing={1} style={{ padding: 20 }}>
          <Grid item xs={3}>
            <Cards
              tooltip={`Vendeur: ${seller.name}`}
              avatar={`${consumeApi.AssetProfilServer}${seller.avatar}`}
              title="Vendeur"
              id="vendeur"
              description={seller.description}
              actions={[
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid item xs={3}>
                    <WalletOutlined />
                  </Grid>
                  <Grid item xs={9}>
                    {seller.wallet}
                  </Grid>
                </Grid>,
              ]}
            />
          </Grid>
          <Grid item xs={2}>
            <Cards
              tooltip={`Produit: ${product.name}`}
              cover={
                <img
                  alt="example"
                  src={`${consumeApi.AssetProductServer}${product.cover}`}
                />
              }
              title={product.name}
              id="produit"
              description={product.description}
            />
          </Grid>
          <Grid item xs={3}>
            <Cards
              tooltip={`Acheteur: ${buyer.name}`}
              avatar={`${consumeApi.AssetProfilServer}${buyer.avatar}`}
              title="Acheteur"
              id="acheteur"
              description={buyer.description}
              actions={[
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid item xs={3}>
                    <WalletOutlined />
                  </Grid>
                  <Grid item xs={3}>
                    {buyer.wallet}
                  </Grid>
                  <Grid item xs={3}>
                    <GiftOutlined />
                  </Grid>
                  <Grid item xs={3}>
                    {buyer.deliveryFree}
                  </Grid>
                </Grid>,
              ]}
            />
          </Grid>
          <Grid item xs={4}>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading}>
                {restReservation.descriptionConvoyeur}
              </Typography>
            </div>
            <Grid container spacing={1} style={{ padding: 5 }}>
              <Grid item xs={6}>
                <Input
                  disabled
                  value={restReservation.citySeller}
                  placeholder="Lieu Sel: 220 Logements"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  value={restReservation.cityBuyer}
                  placeholder="Lieu Buy: Rivera Palmerai"
                  onChange={(e) => {
                    setRestReservation({
                      ...restReservation,
                      cityBuyer: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <InputNumber
                  min={0}
                  value={restReservation.priceDelivery}
                  placeholder="prix livraison"
                  onChange={(value) => {
                    setRestReservation({
                      ...restReservation,
                      priceDelivery: value as number,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  value={restReservation.deliveryManInfo}
                  placeholder="Nom Livreur/Contact(+225 xxxxxxxxx)"
                  onChange={(e) => {
                    setRestReservation({
                      ...restReservation,
                      deliveryManInfo: e.target.value,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    } else if (currentIndex === 3) {
      return (
        <Grid container spacing={1} style={{ padding: 20 }}>
          <Grid item xs={3}>
            <Cards
              tooltip={`Vendeur: ${seller.name}`}
              avatar={`${consumeApi.AssetProfilServer}${seller.avatar}`}
              title="Vendeur"
              id="vendeur"
              description={seller.description}
              actions={[
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid item xs={3}>
                    <WalletOutlined />
                  </Grid>
                  <Grid item xs={9}>
                    {seller.wallet}
                  </Grid>
                </Grid>,
              ]}
            />
          </Grid>
          <Grid item xs={2}>
            <Cards
              tooltip={`Produit: ${product.name}`}
              cover={
                <img
                  alt="example"
                  src={`${consumeApi.AssetProductServer}${product.cover}`}
                />
              }
              title={product.name}
              id="produit"
              description={product.description}
            />
          </Grid>
          <Grid item xs={3}>
            <Cards
              tooltip={`Acheteur: ${buyer.name}`}
              avatar={`${consumeApi.AssetProfilServer}${buyer.avatar}`}
              title="Acheteur"
              id="acheteur"
              description={buyer.description}
              actions={[
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid item xs={3}>
                    <WalletOutlined />
                  </Grid>
                  <Grid item xs={3}>
                    {buyer.wallet}
                  </Grid>
                  <Grid item xs={3}>
                    <GiftOutlined />
                  </Grid>
                  <Grid item xs={3}>
                    {buyer.deliveryFree}
                  </Grid>
                </Grid>,
              ]}
            />
          </Grid>
          <Grid item xs={4}>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading}>
                {restReservation.descriptionConvoyeur}
              </Typography>
            </div>
            <Grid container spacing={1} style={{ padding: 5 }}>
              <Grid item xs={6}>
                <Input
                  disabled
                  value={restReservation.citySeller}
                  placeholder="Lieu Sel: 220 Logements"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  disabled
                  value={restReservation.cityBuyer}
                  placeholder="Lieu Buy: Rivera Palmeraie"
                  onChange={(e) => {
                    setRestReservation({
                      ...restReservation,
                      cityBuyer: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <InputNumber
                  disabled
                  value={restReservation.priceDelivery}
                  placeholder="prix livraison"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  disabled
                  value={restReservation.deliveryManInfo}
                  placeholder="Nom Livreur/Contact(+225 xxxxxxxxx)"
                />
              </Grid>
              {levelDelivery === 4 ? (
                <Grid item xs={12}>
                  <div className={classes.column}>
                    <Typography className={classes.errorTitle}>
                      L'acheteur demande un remboursement
                    </Typography>
                  </div>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={1} style={{ padding: 20 }}>
          <Grid item xs={3}>
            <Cards
              tooltip={`Vendeur: ${seller.name}`}
              avatar={`${consumeApi.AssetProfilServer}${seller.avatar}`}
              title="Vendeur"
              id="vendeur"
              description={seller.description}
              actions={[
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid item xs={3}>
                    <WalletOutlined />
                  </Grid>
                  <Grid item xs={9}>
                    {seller.wallet}
                  </Grid>
                </Grid>,
              ]}
            />
          </Grid>
          <Grid item xs={2}>
            <Cards
              tooltip={`Produit: ${product.name}`}
              cover={
                <img
                  alt="example"
                  src={`${consumeApi.AssetProductServer}${product.cover}`}
                />
              }
              title={product.name}
              id="produit"
              description={product.description}
            />
          </Grid>
          <Grid item xs={3}>
            <Cards
              tooltip={`Acheteur: ${buyer.name}`}
              avatar={`${consumeApi.AssetProfilServer}${buyer.avatar}`}
              title="Acheteur"
              id="acheteur"
              description={buyer.description}
              actions={[
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid item xs={3}>
                    <WalletOutlined />
                  </Grid>
                  <Grid item xs={3}>
                    {buyer.wallet}
                  </Grid>
                  <Grid item xs={3}>
                    <GiftOutlined />
                  </Grid>
                  <Grid item xs={3}>
                    {buyer.deliveryFree}
                  </Grid>
                </Grid>,
              ]}
            />
          </Grid>
          <Grid item xs={4}>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading}>
                {restReservation.descriptionConvoyeur}
              </Typography>
            </div>
            <Grid container spacing={1} style={{ padding: 5 }}>
              <Grid item xs={6}>
                <Input
                  disabled
                  value={restReservation.citySeller}
                  placeholder="Lieu Sel: 220 Logements"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  disabled
                  value={restReservation.cityBuyer}
                  placeholder="Lieu Buy: Rivera Palmerai"
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  value={deliveryUserId}
                  style={{ width: "100%", marginTop: 10 }}
                  placeholder="Selection Livreur"
                  disabled
                  options={allDeliveries.map((value) => {
                    return {
                      value: value._id.toString(),
                      label: `${value.name} | ${value.notFinished}`,
                    };
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <InputNumber
                  min={0}
                  disabled
                  style={{ width: "100%", marginTop: 10 }}
                  value={restReservation.priceDelivery}
                  placeholder="Prix livraison"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  };

  const sectionDetails = (selectedItem: number) => {
    if (selectedItem === 0) {
      return <Empty />;
    } else if (selectedItem === 1) {
      return <Skeleton active />;
    } else {
      return (
        <>
          <Steps
            current={current}
            items={items.map((item) => ({
              key: item.title,
              title: item.title,
            }))}
          />
          {reformatContent(current - 1)}
        </>
      );
    }
  };

  const choiceRangeOfPicture = (value: string[]) => {
    setOrderImageProduct(value);
  };
  const refreshData = () => {
    message.loading("Actualisation...").then(async () => {
      await loadData();
      setItemSelect("");
      setItemProductForValidate("");
      setOrderImageProduct([]);
      setSelected(0);
      setSelectedProductInfo(0);
      message.success("Actualisation terminé");
    });
  };
  const sectionDetailsProductInWait = (selectedItem: number) => {
    if (selectedItem === 0) {
      return <Empty />;
    } else {
      return (
        <>
          <Grid container spacing={1} style={{ padding: 20 }}>
            <Grid item xs={3}>
              <Grid container>
                <MegaTitleProps title="Images" size="md" />
                <Grid item xs={12}>
                  <Carousel dotPosition={"top"} autoplay>
                    {productInfo.images.map((value: any, index: number) => (
                      <div key={`infoProduct${index}`}>
                        <img
                          src={`${consumeApi.AssetProductServer}${value}`}
                          alt="Achète tout à ton prix, nous te livrons."
                          width={"100%"}
                        />
                      </div>
                    ))}
                  </Carousel>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Ranger Image"
                    value={orderImageProduct}
                    onChange={choiceRangeOfPicture}
                    options={productInfo.images.map((value: string) => {
                      return { value, label: value };
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  {productInfo.video !== "" && (
                    <div>
                      <MegaTitleProps title="Video" size="md" />
                      <video
                        width="100%"
                        height="auto"
                        controls
                        src={`${consumeApi.AssetProductServer}${productInfo.video}`}
                      ></video>
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Cards
                title="Titre"
                id="titre"
                description={productInfo.name}
                actions={[
                  <Grid container spacing={1} style={{ padding: 10 }}>
                    <Grid item xs={6}>
                      <a
                        href={`https://wa.me/225${productInfo.numero}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Tel {productInfo.numero}
                      </a>
                    </Grid>
                    <Grid item xs={6}>
                      <p>Lieu {productInfo.lieu}</p>
                    </Grid>
                  </Grid>,
                ]}
              />
            </Grid>
            <Grid item xs={3}>
              <Cards
                title="Description"
                id="description"
                description={productInfo.describe}
                actions={[
                  <Grid container spacing={1} style={{ padding: 10 }}>
                    <Grid item xs={6}>
                      <p>Prix {productInfo.price} XOF</p>
                    </Grid>
                    <Grid item xs={6}>
                      <p>Qte {productInfo.quantityTotal}</p>
                    </Grid>
                  </Grid>,
                ]}
              />
            </Grid>
            <Grid item xs={3}>
              <TextInputField
                id="comment"
                required={false}
                className="comment"
                value={commentProductForValidate}
                variant="outlined"
                label="Commentaire"
                onChange={(e) => setCommentProductForValidate(e.target.value)}
              />

              <div className="mt-20">
                <TextInputField
                  id="priceDelivery"
                  required={false}
                  className="priceDelivery"
                  value={priceDelivery}
                  variant="outlined"
                  label="Prix Livraison"
                  onChange={(e) => setPriceDelivery(e.target.value)}
                />
              </div>
              <div className="mt-20">
                <TextInputField
                  id="priceArticle"
                  required={false}
                  className="priceArticle"
                  value={priceArticle}
                  variant="outlined"
                  label="Prix Article"
                  onChange={(e) => setPriceArticle(e.target.value)}
                />
              </div>
            </Grid>
          </Grid>
        </>
      );
    }
  };

  const loadData = async () => {
    const data = await consumeApi.getCommandes();
    const resultCommandes = data.result.allCommande as any[];
    const resultDealsInWait = data.result.allProductInWait as any[];
    const resultAllDeliveries = data.result.allDeliveries as any[];
    const allCommande = resultCommandes.map((value) => {
      return { ...value, key: value._id };
    });
    const allDeliverie = resultAllDeliveries.map((value) => {
      return { ...value, key: value._id };
    });
    if (data.etat === Etat.SUCCESS) {
      setCommandes(allCommande);
      setDealsInWait(resultDealsInWait);
      setAllDeliveries(allDeliverie);
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
      title: "N° Commande",
      dataIndex: "_id",
      key: "_id",
      fixed: true,
      render: (info: any, rowData: any) => {
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
              const data = await consumeApi.getDetailsCommandes(_id);
              if (data.etat === Etat.SUCCESS) {
                setSeller(data.result.seller);
                setBuyer(data.result.buyer);
                setProduct(data.result.product);
                setDeliveryUserId(data.result.restReservation.deliveryUserId);
                setRestReservation(data.result.restReservation);
                const newCurrent =
                  data.result.restReservation.state <= 3
                    ? data.result.restReservation.state + 1
                    : 3;
                setLevelDelivery(data.result.restReservation.state);
                setCurrent(newCurrent);
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
    { title: "Prix Final", dataIndex: "price", key: "price", fixed: true },
    {
      title: "Lieu Vendeur",
      dataIndex: "citySeller",
      key: "citySeller",
      fixed: true,
    },
    {
      title: "Lieu Acheteur",
      dataIndex: "cityBuyer",
      key: "cityBuyer",
      fixed: true,
    },

    {
      title: "Niveau",
      dataIndex: "state",
      key: "state",
      fixed: true,
      render: (info: any) => {
        const state = info as number;
        if (state === -1) {
          return <Tag color={"error"}>Aucun Livreur</Tag>;
        } else if (state === 0) {
          return <Tag color={"error"}>Chez Le vendeur</Tag>;
        } else if (state === 1) {
          return <Tag color={"geekblue"}>Convoyeur Attribué</Tag>;
        } else if (state === 2) {
          return <Tag color={"blue"}>Au Siège</Tag>;
        } else if (state === 3) {
          return <Tag color={"gold"}>Chez l'acheteur</Tag>;
        } else if (state === 4) {
          return <Tag color={"error"}>Acheteur Non content</Tag>;
        }
      },
    },
    {
      title: "Date Enr",
      dataIndex: "registerDate",
      key: "registerDate",
      fixed: true,
    },
  ];

  const columnsProductInWait = [
    {
      title: "N° Article",
      dataIndex: "_id",
      key: "_id",
      fixed: true,
      render: (info: any, rowData: any) => {
        const _id = info as string;
        return (
          <Buttons
            key={`select_article_${_id}`}
            id={`select_article_${_id}`}
            type="dashed"
            title={_id}
            tooltip={"Cliquez ici pour le gerer"}
            onClick={() => {
              setProductInfo(rowData);
              setOrderImageProduct(rowData.images);
              setPriceDelivery(rowData.priceDelivery.toString());
              setPriceArticle(rowData.price.toString());
              setItemProductForValidate(_id);
              setSelectedProductInfo(1);
            }}
          />
        );
      },
    },
    { title: "Titre", dataIndex: "name", key: "name", fixed: true },
    { title: "Prix", dataIndex: "price", key: "price", fixed: true },
    {
      title: "Qte",
      dataIndex: "quantityTotal",
      key: "quantityTotal",
      fixed: true,
    },
    { title: "Lieu", dataIndex: "lieu", key: "lieu", fixed: true },
    {
      title: "Date Enr",
      dataIndex: "registerDate",
      key: "registerDate",
      fixed: true,
    },
  ];
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
                        Detail Commande
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
                    {levelDelivery <= 2 && (
                      <Buttons
                        key="annuler"
                        id="annuler"
                        shape="round"
                        type="primary"
                        danger={true}
                        title="Annuler"
                        icon={<CloseOutlined color={"#fff"} />}
                        tooltip="Annuler"
                        onClick={removeDeals}
                      />
                    )}

                    {current < items.length - 1 && (
                      <Buttons
                        key="next"
                        id="next"
                        shape="round"
                        type="primary"
                        title="Suivant"
                        icon={<SwapRightOutlined color={"#fff"} />}
                        tooltip="Etape Suivante"
                        onClick={() => next()}
                      />
                    )}

                    {(levelDelivery <= 1 || levelDelivery === 4) && (
                      <Buttons
                        key="rembourser"
                        id="rembourser"
                        shape="round"
                        type="ghost"
                        title="Rembourser"
                        icon={<UploadOutlined color={"#fff"} />}
                        tooltip="Rembourser"
                        onClick={() => rembourser(levelDelivery)}
                      />
                    )}
                  </AccordionActions>
                </Accordion>
              </div>
            </Grid>
            <Grid container spacing={1} style={{ padding: 20 }}>
              <div className={classes.root}>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>
                    List Commandes en cours
                  </Typography>
                  <Buttons
                    key="reload"
                    id="reload"
                    shape="round"
                    type="ghost"
                    title="Actualiser"
                    icon={<CloudSyncOutlined color={"#fff"} />}
                    tooltip="Actualiser"
                    onClick={refreshData}
                  />
                  <Table
                    columns={columns}
                    dataSource={commandes}
                    rowKey={"_id"}
                  />
                </div>
              </div>
            </Grid>
          </div>
          <div className="pt-10">
            <MegaTitleProps title="Product In Wait" size="md" />
            <Grid container spacing={1} style={{ padding: 10 }}>
              <div className={classes.root}>
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2c-content"
                    id="panel2c-header"
                  >
                    <div className={classes.column}>
                      <ReconciliationTwoTone
                        twoToneColor={colorPrimary}
                        style={{ fontSize: 32 }}
                      />
                    </div>
                    <div className={classes.column}>
                      <Typography className={classes.secondaryHeading}>
                        Detail Article
                      </Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className={classes.details}>
                    <Grid container spacing={1} style={{ padding: 10 }}>
                      {sectionDetailsProductInWait(selectedProductInfo)}
                    </Grid>
                  </AccordionDetails>
                  <Divider />
                  <AccordionActions>
                    <Buttons
                      key="validate"
                      id="valide"
                      shape="round"
                      type="primary"
                      title="Valider"
                      icon={<CheckCircleOutlined color={"#fff"} />}
                      tooltip="Valider article"
                      onClick={() => validate(true)}
                    />
                    <Buttons
                      key="reject"
                      id="reject"
                      shape="round"
                      type="ghost"
                      title="Rejetter"
                      icon={<CloseCircleOutlined color={"#fff"} />}
                      tooltip="Rejetter article"
                      onClick={() => validate(false)}
                    />
                  </AccordionActions>
                </Accordion>
              </div>
            </Grid>
            <Grid container spacing={1} style={{ padding: 20 }}>
              <div className={classes.root}>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>
                    Liste Articles en cours
                  </Typography>
                  <Buttons
                    key="reload"
                    id="reload"
                    shape="round"
                    type="ghost"
                    title="Actualiser"
                    icon={<CloudSyncOutlined color={"#fff"} />}
                    tooltip="Actualiser"
                    onClick={refreshData}
                  />
                  <Table
                    columns={columnsProductInWait}
                    dataSource={dealsInWait}
                    rowKey={"_id"}
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

export default EmployerDash;
