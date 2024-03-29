import React, { useState } from "react";
import { Container, Grid, Card, IconButton } from "@mui/material";
import logo from "../../Assets/Images/png/logo_transparent.png";
import welcome from "../../Assets/Images/svg/good people.svg";
import MegaTitleProps from "../Components/MegaTitle/MegaTitle";
import TextInputField from "../Components/TextInputField/TextInputField";
import Buttons from "../Components/Buttons/Buttons";
import { message } from "antd";
import { btn_color_primary } from "../../Constants/ClassName/Buttons";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./Signin.scss";
import { Props } from "../../Interfaces/Props/Navigation";
import { ConsumeApi } from "../../ServiceWorker/ConsumeApi";
import { Etat, BuiltinRoleAdmin } from "../../Constants/Enum";
import { useNavigate } from "react-router-dom";

function Signin(props: Props) {
  let navigate = useNavigate();
  const consumeApi: ConsumeApi = new ConsumeApi();
  const [viewPassWord, setViewPassWord] = useState(false);
  const [numberAdmin, changenumberAdmin] = useState("");
  const [password, changePassword] = useState("");

  const connection = () => {
    if (!disabled) {
      message.loading("Connexion en cours").then(async () => {
        const info = await consumeApi.signin(numberAdmin, password);
        if (info.etat === Etat.SUCCESS) {
          localStorage.setItem("recovery", info.result.recovery);
          localStorage.setItem("ident", info.result.ident);
          localStorage.setItem("role", info.result.role);
          localStorage.setItem("name", info.result.name);
          switch (info.result.role) {
            case BuiltinRoleAdmin.SUPER_ADMIN:
              navigate("/home");
              break;
            case BuiltinRoleAdmin.ADMIN_ACTUALITY:
              navigate("/home/actuality");
              break;
            case BuiltinRoleAdmin.ADMIN_DEALS:
              navigate("/home/deals");
              break;
            case BuiltinRoleAdmin.ADMIN_EVENTS:
              navigate("/home/event");
              break;
            case BuiltinRoleAdmin.ADMIN_COVOITURAGES:
              navigate("/home/covoiturage");
              break;
            case BuiltinRoleAdmin.EMPLOYER_ACTUALITY:
              navigate("/home/actualityEmployer");
              break;
            case BuiltinRoleAdmin.EMPLOYER_DEALS:
              navigate("/home/dealsEmployer");
              break;
            case BuiltinRoleAdmin.EMPLOYER_EVENTS:
              navigate("/home/eventEmployer");
              break;
            case BuiltinRoleAdmin.EMPLOYER_COVOITURAGES:
              navigate("/home/covoiturageEmployer");
              break;
            case BuiltinRoleAdmin.SMALL_LEVEL:
              navigate("/home/viewer");
              break;
            default:
              navigate("/home/viewer");
              break;
          }
        } else {
          message.error(info.error as string, 7);
        }
      });
    } else {
      message.error("Rassurez vous que votre numero est dans le bon format");
    }
  };

  const handleClickShowPassword = () => {
    const oldViewPassWord = viewPassWord;
    setViewPassWord(!oldViewPassWord);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const disabled =
    numberAdmin.length === 10 && password.length > 7 ? false : true;

  return (
    <div className="signin flexbox flex-center">
      <React.Fragment>
        <Container maxWidth="md">
          <Card raised={true}>
            <Grid container spacing={3} style={{ padding: 20 }}>
              <Grid item xs={3}>
                <img src={logo} className="logoApp-2x App-logo" alt="Logo" />
              </Grid>

              <MegaTitleProps title="Connexion" size="md" />
              <Grid item xs={7}>
                <Container>
                  <Grid container>
                    <Grid item xs={12} style={{ paddingBottom: 20 }}>
                      <TextInputField
                        id="number"
                        className="numberAdmin"
                        value={numberAdmin}
                        required={true}
                        variant="outlined"
                        prefix="+225"
                        type="number"
                        label="Numéro de reception"
                        onChange={(e) =>
                          changenumberAdmin(e.target.value.toString())
                        }
                      />
                    </Grid>
                    <Grid item xs={12} style={{ paddingBottom: 10 }}>
                      <TextInputField
                        id="password"
                        className="passwordHotel"
                        value={password}
                        required={true}
                        variant="outlined"
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
                        type={viewPassWord ? "text" : "password"}
                        label="Créer un mot de passe"
                        onChange={(e) =>
                          changePassword(e.target.value.toString())
                        }
                      />
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: 10 }}>
                      <Buttons
                        id="signup"
                        title="Se Connecter"
                        shape="round"
                        className={!disabled ? btn_color_primary : ""}
                        disabled={disabled}
                        onClick={connection}
                      />
                    </Grid>
                  </Grid>
                </Container>
              </Grid>
              <Grid item xs={5}>
                <div className="flexbox flex-center">
                  <img src={welcome} className="imgWelcome" alt="welcome" />
                </div>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </React.Fragment>
    </div>
  );
}

export default Signin;
