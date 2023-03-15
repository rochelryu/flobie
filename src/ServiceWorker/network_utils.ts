import axios from "axios";
import { Etat } from "../Constants/Enum";
import { ResponseInterface } from "../Interfaces/ServerSide/ResponseInterface";

const axiosInstance = axios.create();

export async function get(url: string): Promise<ResponseInterface> {
  return new Promise((next) => {
    axiosInstance
      .get(url)
      .then((response) => {
        const json = response.data as ResponseInterface;
        next(json);
      })
      .catch((error) => {
        next({ etat: Etat.FAILED, error });
      });
  });
}

export async function post(
  url: string,
  body: Object
): Promise<ResponseInterface> {
  return new Promise((next) => {
    axiosInstance
      .post(url, body)
      .then((response) => {
        const json = response.data as ResponseInterface;
        next(json);
      })
      .catch((error) => {
        next({ etat: Etat.FAILED, error });
      });
  });
}
