import { Etat } from "../../Constants/Enum";
export interface ResponseInterface {
  etat: Etat;
  result?: any;
  error?: Error | string;
}

export interface DataDashboardInterface {
  countTotalAccount?: number;
  countTotalAdmin?: number;
  countTotalArticle?: number;
  countTotalCategorie?: number;
  countTotalDeals?: number;
  countTotalEvent?: number;
  countTotalTravel?: number;
}
