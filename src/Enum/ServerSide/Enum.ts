export enum BuiltinRoleAdmin {
  SUPER_ADMIN = "SUPER_ADMIN",

  ADMIN_DEALS = "ADMIN_DEALS",
  ADMIN_EVENTS = "ADMIN_EVENTS",
  ADMIN_COVOITURAGES = "ADMIN_COVOITURAGES",
  ADMIN_ACTUALITY = "ADMIN_ACTUALITY",

  EMPLOYER_DEALS = "EMPLOYER_DEALS",
  EMPLOYER_EVENTS = "EMPLOYER_EVENTS",
  EMPLOYER_COVOITURAGES = "EMPLOYER_COVOITURAGES",
  EMPLOYER_ACTUALITY = "EMPLOYER_ACTUALITY",

  SMALL_LEVEL = "SMALL_LEVEL",
}

export enum EtatCommunication {
  CAMPAGNE = 'Campagne for seller',
  BEGIN = 'Conversation between users',
  ACCORD_SELLER = 'Seller Purpose price final at buyer',
  ACCORD_SELLER_BUYER = 'Seller and Buyer validate price final',
  SELLER_UNAVAILABLE = 'Seller and product not found',
  BUYER_NOT_VALIDATE = 'Buyer not validate product',
  FAILED = 'error',
  SUCCESS = 'found',
  ISEXIST = 'already',
  ISNOTEXIST = 'notFound',
  FREEINPAYPRICE = 'FreeInPayPrice',
  INCORRECTPRICE = 'IncorrectPrice',
  BADLEVEL = 'badLevel',
}