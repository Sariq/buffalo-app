import { axiosInstance } from "../../../utils/http-interceptor";
import { toBase64, fromBase64 } from "../../../helpers/convert-base64";
import { Platform } from "react-native";
import { getCurrentLang } from "../../../translations/i18n";
import Constants from "expo-constants";

// Types for the new credit card API
export type TCreditCard = {
  id: number;
  txId: string;
  uniqueID: string;
  cardExp: string;
  personalId: string;
  cardToken: string;
  cardMask: string;
  errorCode: string | null;
  errorText: string | null;
};

export type TGetCreditCardsResponse = {
  has_err: boolean;
  code: number;
  cards: TCreditCard[];
  salt: string;
};

export type TGetCreditCardPaymentPageRequest = {
  app_language: number;
};

export type TGetCreditCardPaymentPageResponse = {
  has_err: boolean;
  code: number;
  url: string;
  salt: string;
};

export type TIsCustomerHasSavedCreditCardResponse = {
  has_err: boolean;
  code: number;
  result: boolean;
  salt: string;
};

export type TDeleteCreditCardRequest = {
  creditcard_id: number;
};

export type TDeleteCreditCardResponse = {
  has_err: boolean;
  code: number;
  salt: string;
};

// API endpoints
const CREDIT_CARD_API = {
  CONTROLLER: "CreditCard",
  GET_CREDIT_CARD_PAYMENT_PAGE: "GetCreditCardPaymentPage",
  GET_CREDIT_CARDS: "GetCreditCards",
  IS_CUSTOMER_HAS_SAVED_CREDIT_CARD: "IsCustomerHasSavedCreditCard",
  DELETE_CREDIT_CARD: "DeleteCreditCard",
};

// Helper to get common request fields
function getCommonRequestFields() {
  const version = Constants.nativeAppVersion;

  return {
    app_language: getCurrentLang() === "ar" ? '0' : '1',
    device_os: Platform.OS === "android" ? "Android" : "iOS",
    app_version: version,
  };
}

/**
 * Get credit card payment page URL
 * @param appLanguage - Language code (1 for Hebrew, etc.)
 * @returns Promise with payment page URL and salt
 */
export const getCreditCardPaymentPage = async (
  appLanguage: number
): Promise<TGetCreditCardPaymentPageResponse> => {
  console.log("appLanguage", appLanguage);
  const requestBody = {
    ...getCommonRequestFields(),
    app_language: String(appLanguage), // override if needed
  };

  const response = await axiosInstance.post(
    `${CREDIT_CARD_API.CONTROLLER}/${CREDIT_CARD_API.GET_CREDIT_CARD_PAYMENT_PAGE}`,
    toBase64(requestBody)
  );

  return JSON.parse(fromBase64(response.data));
};

/**
 * Get all saved credit cards for the current user
 * @returns Promise with array of credit cards
 */
export const getCreditCards = async (): Promise<TGetCreditCardsResponse> => {
  const requestBody = {
    ...getCommonRequestFields(),
  };
  console.log("requestBody", toBase64(requestBody));

  const response = await axiosInstance.post(
    `${CREDIT_CARD_API.CONTROLLER}/${CREDIT_CARD_API.GET_CREDIT_CARDS}`,
    toBase64(requestBody)
  );

  return JSON.parse(fromBase64(response.data));
};

/**
 * Check if customer has saved credit cards
 * @returns Promise with boolean result
 */
export const isCustomerHasSavedCreditCard = async (): Promise<TIsCustomerHasSavedCreditCardResponse> => {
  const requestBody = {
    ...getCommonRequestFields(),
  };

  const response = await axiosInstance.post(
    `${CREDIT_CARD_API.CONTROLLER}/${CREDIT_CARD_API.IS_CUSTOMER_HAS_SAVED_CREDIT_CARD}`,
    toBase64(requestBody)
  );

  return JSON.parse(fromBase64(response.data));
};

/**
 * Delete a credit card
 * @param creditCardId - ID of the credit card to delete
 * @returns Promise with deletion result
 */
export const deleteCreditCard = async (
  creditCardId: number
): Promise<TDeleteCreditCardResponse> => {
  const requestBody = {
    ...getCommonRequestFields(),
    creditcard_id: creditCardId,
  };
  console.log("requestBody", requestBody);
  const response = await axiosInstance.post(
    `${CREDIT_CARD_API.CONTROLLER}/${CREDIT_CARD_API.DELETE_CREDIT_CARD}`,
    toBase64(requestBody)
  );
  console.log("response", response);

  return JSON.parse(fromBase64(response.data));
}; 