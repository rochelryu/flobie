import { Etat } from "../Constants/Enum";
import { ResponseInterface } from "../Interfaces/ServerSide/ResponseInterface";
import { get, post } from "./network_utils";

export class ConsumeApi {
  private base_url = "https://app.shouz.network"; //192.168.1.180:5000 //192.168.43.115:8000";
  private signin_url = this.base_url + "/lastLevel/login";
  private dashboard_url = this.base_url + "/lastLevel/dashboard";
  private dashboardAdmin_url = this.base_url + "/lastLevel/dashboardAdminDeals";
  private employer_url = this.base_url + "/lastLevel/getEmployer";
  private createAdmin_url = this.base_url + "/lastLevel/createAdmin";
  private changePassword_url = this.base_url + "/lastLevel/changePassword";
  private createCategorie_url = this.base_url + "/lastLevel/insideCategorie";
  private updateCategorie_url = this.base_url + "/lastLevel/updateCategorie";
  private togglePopularityCategorie_url =
    this.base_url + "/lastLevel/togglePopularityCategorie";
  private retraitReserve_url = this.base_url + "/lastLevel/retraitReserve";

  private createReseau_url = this.base_url + "/lastLevel/createReseau";
  private validateRetrait_url = this.base_url + "/lastLevel/validateRetrait";
  private delRechargement_url = this.base_url + "/lastLevel/delRechargement";
  private validateRechargement_url =
    this.base_url + "/lastLevel/validateRechargement";
  private dropTravelDemande_url =
    this.base_url + "/lastLevel/dropTravelDemande";
  private dropPassagerDemande_url =
    this.base_url + "/lastLevel/dropPassagerDemande";
  private validateTravelDemande_url =
    this.base_url + "/lastLevel/validateTravelDemande";
  private validatePassagerDemande_url =
    this.base_url + "/lastLevel/validatePassagerDemande";
  private getActualities_url = this.base_url + "/lastLevel/getActualities";
  private removeActuality_url = this.base_url + "/lastLevel/removeActuality";
  private getCommandes_url = this.base_url + "/lastLevel/getCommandes";
  private getTravellersDemandes_url =
    this.base_url + "/lastLevel/getTravellersDemandes";
  private getPassagersDemandes_url =
    this.base_url + "/lastLevel/getPassagersDemandes";
  private manageMobileMoney_url =
    this.base_url + "/lastLevel/manageMobileMoney";
  private getDetailsCommandes_url =
    this.base_url + "/lastLevel/getDetailsCommandes";
  private getDetailsTravellerDemande_url =
    this.base_url + "/lastLevel/getDetailsTravellerDemande";
  private getDetailsPassagersDemande_url =
    this.base_url + "/lastLevel/getDetailsPassagersDemande";
  private setActuality_url = this.base_url + "/lastLevel/createActuality";
  private setDeleveryProductLevelOne_url =
    this.base_url + "/lastLevel/setDeleveryProductLevelOne";
  private rembourseClient_url = this.base_url + "/lastLevel/rembourseClient";
  private setDeleveryProductLevelTwo_url =
    this.base_url + "/lastLevel/setDeleveryProductLevelTwo";
  private setDeleveryProductLevelThree_url =
    this.base_url + "/lastLevel/setDeleveryProductLevelThree";
  private activeMobileMoney_url =
    this.base_url + "/lastLevel/activeMobileMoney";
  private approvedProductOrNot_url =
    this.base_url + "/lastLevel/approvedProductOrNot";
  private createDeliveryMan_url =
    this.base_url + "/lastLevel/createDeliveryMan";
  private createNotificationCenter_url =
    this.base_url + "/lastLevel/createNotificationCenter";

  // Assets File URL

  AssetProfilServer = this.base_url + "/profil/";
  AssetTravelServer = this.base_url + "/travel/";
  AssetProductServer = this.base_url + "/store/";
  AssetConversationServer = this.base_url + "/public/conversation/";

  constructor() {}

  async signin(numero: string, password: string): Promise<ResponseInterface> {
    const body = {
      numero,
      password,
    };
    return await post(this.signin_url, body);
  }
  async changePassword(
    old_password: string,
    new_password: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      idClient: id,
      recovery,
      new_password,
      old_password,
    };
    const response = await post(this.changePassword_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async createAdmin(
    name: string,
    email: string,
    prefix: string,
    role: string,
    numero: string,
    password: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      numero,
      password,
      name,
      email,
      prefix,
      role,
    };
    const response = await post(this.createAdmin_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async createDelivery(
    name: string,
    address: string,
    numero: string,
    password: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      numero,
      password,
      name,
      prefix: "+255",
      address,
    };
    const response = await post(this.createDeliveryMan_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async createNotificationCenter(
    title: string,
    body: string,
    imgUrl: string,
    describe: string,
    data: Object,
    destinate: string[]
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const item = {
      id,
      recovery,
      title,
      body,
      imgUrl,
      descritpion:describe,
      data,
      destinate
    };
    const response = await post(this.createNotificationCenter_url, item);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async createCategorie(
    name: string,
    domaine: number[],
    popularity: number
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      name,
      domaine,
      popularity,
    };
    const response = await post(this.createCategorie_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }
  async updateCategorie(
    name: string,
    idCategorie: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      name,
      idCategorie,
    };
    const response = await post(this.updateCategorie_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async togglePopularityCategorie(
    categoryId: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      categoryId,
    };
    const response = await post(this.togglePopularityCategorie_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async retraitReserve(
    typeDeReserve: number,
    amountUsd: number
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      typeDeReserve,
      amountUsd,
    };
    const response = await post(this.retraitReserve_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async createReseau(name: string, numero: string): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      name,
      numero,
    };
    const response = await post(this.createReseau_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }
  async validateRetrait(retraitId: string): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      retraitId,
    };
    const response = await post(this.validateRetrait_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async delRechargement(depositId: string): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      depositId,
    };
    const response = await post(this.delRechargement_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async validateRechargement(
    typeReseau: string,
    numero: string,
    montant: string,
    ref: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      typeReseau,
      numero,
      montant,
      ref,
    };
    const response = await post(this.validateRechargement_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async deleteActuality(ident: string): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      credentials: recovery,
      idActuality: ident,
    };
    const response = await post(this.removeActuality_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async dropTravelDemande(itemSelect: string): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      itemSelect,
    };
    const response = await post(this.dropTravelDemande_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async dropPassagerDemande(itemSelect: string): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      itemSelect,
    };
    const response = await post(this.dropPassagerDemande_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async validateTravelDemande(
    itemSelect: string,
    assuranceExpiration: string,
    techniqueExpiration: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      itemSelect,
      assuranceExpiration,
      techniqueExpiration,
    };
    const response = await post(this.validateTravelDemande_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async validatePassagerDemande(
    itemSelect: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      itemSelect,
    };
    const response = await post(this.validatePassagerDemande_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async setDeleveryProductLevelOne(
    cityBuyer: string,
    citySeller: string,
    itemSelect: string,
    deliveryUserId: string,
    dateDelivery: string,
    deliveryManInfo: string,
    priceDelivery: number
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      cityBuyer,
      citySeller,
      itemSelect,
      deliveryUserId,
      dateDelivery,
      deliveryManInfo,
      priceDelivery,
    };
    const response = await post(this.setDeleveryProductLevelOne_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async rembourseClient(
    itemSelect: string,
    typeOfRetour: number
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      itemSelect,
      typeOfRetour,
    };
    const response = await post(this.rembourseClient_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async setDeleveryProductLevelTwo(
    itemSelect: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,

      itemSelect,
    };
    const response = await post(this.setDeleveryProductLevelTwo_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }
  async approvedProductOrNot(
    approved: boolean,
    comment: string,
    productId: string,
    priceDelivery: string,
    priceArticle: string,
    orderImageProduct: string[]
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      approved,
      comment,
      productId,
      orderImageProduct,
      priceDelivery,
      priceArticle: parseInt(priceArticle, 10),
    };
    const response = await post(this.approvedProductOrNot_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async setDeleveryProductLevelThree(
    cityBuyer: string,
    itemSelect: string,
    priceDelivery: number,
    deliveryManInfo: string
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      cityBuyer,
      itemSelect,
      priceDelivery,
      deliveryManInfo,
    };
    const response = await post(this.setDeleveryProductLevelThree_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async activeMobileMoney(idMobileMoney: string): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const body = {
      id,
      recovery,
      idMobileMoney,
    };
    const response = await post(this.activeMobileMoney_url, body);

    return response;
  }

  async createActuality(
    autherName: string,
    authorProfil: string,
    categorie: string,
    imageCover: string,
    title: string,
    sights: any[]
  ): Promise<ResponseInterface> {
    const id = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    const content = sights.map((value) => {
      return {
        inContent: value.inContent ?? "",
        inImage: value.inImage ?? "",
        inTitle: value.inTitle ?? "",
        isContentType: value.isContentType ?? "",
      };
    });
    const body = {
      id,
      credentials: recovery,
      content,
      autherName,
      categorie,
      authorProfil,
      imageCover,
      title,
    };
    const response = await post(this.setActuality_url, body);
    if (response.etat === Etat.SUCCESS) {
      localStorage.setItem("recovery", response.result.recovery);
    }
    return response;
  }

  async getDahsboard(): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.dashboard_url}?ident=${ident}&recovery=${recovery}`
    );
  }

  async getDahsboardAdminDeals(): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.dashboardAdmin_url}?ident=${ident}&recovery=${recovery}`
    );
  }

  async getEmployer(): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.employer_url}?ident=${ident}&recovery=${recovery}`
    );
  }

  async getActualities(): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.getActualities_url}?ident=${ident}&recovery=${recovery}`
    );
  }

  async getCommandes(): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.getCommandes_url}?ident=${ident}&recovery=${recovery}`
    );
  }

  async getTravellersDemandes(): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.getTravellersDemandes_url}?ident=${ident}&recovery=${recovery}`
    );
  }

  async getPassagersDemandes(): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.getPassagersDemandes_url}?ident=${ident}&recovery=${recovery}`
    );
  }

  async getManagementMobileMoney(): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.manageMobileMoney_url}?ident=${ident}&recovery=${recovery}`
    );
  }

  async getDetailsCommandes(idReservation: string): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.getDetailsCommandes_url}?ident=${ident}&recovery=${recovery}&idReservation=${idReservation}`
    );
  }

  async getDetailsTravellerDemande(
    idClient: string
  ): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.getDetailsTravellerDemande_url}?ident=${ident}&recovery=${recovery}&idClient=${idClient}`
    );
  }

  async getDetailsPassagersDemande(
    idClient: string
  ): Promise<ResponseInterface> {
    const ident = localStorage.getItem("ident");
    const recovery = localStorage.getItem("recovery");
    return await get(
      `${this.getDetailsPassagersDemande_url}?ident=${ident}&recovery=${recovery}&idClient=${idClient}`
    );
  }
}
