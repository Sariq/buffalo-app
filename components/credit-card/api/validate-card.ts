import axios from "axios";
import { storeDataStore } from "../../../stores/store";

// TODO: get terminal and password from server
export const TerminalNumber = '2665648015';
export const Password = '59B2955883f';

type TPayload = {
  TerminalNumber?: string;
  Password?: string;
  Track2?: string,
  CardNumber: string,
  ExpDate_MMYY: string,
}

export type TValidateCardProps = {
  cardNumber: string;
  expDate: string;
}

export type TCCDetails = {
  last4Digits: string;
  ccToken: string;
  cvv?: string;
  id?: number;
  expDate?: string;
}

const validateCard = ({ cardNumber, expDate }: TValidateCardProps) => {
  const paymentCredentials = storeDataStore.paymentCredentials;
  console.log("paymentCredentials",paymentCredentials)
  const body: TPayload = {
    TerminalNumber: paymentCredentials.credentials_terminal_number,
    Password: paymentCredentials.credentials_password,
    CardNumber: cardNumber,
    ExpDate_MMYY: expDate,
  };
  console.log("validatebody", body)

  return axios
    .post(
      'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/ValidateCard',
      body,
    )
    .then(function (res: any) {
      console.log("ressTokV", res)
      const ccDetails: TCCDetails = {
        last4Digits: cardNumber.substr(cardNumber.length - 4),
        ccToken: res.data.Token
      }
      console.log("validateres", res)
      console.log("validatedetails", ccDetails)
      return { isValid: !res.HasError, ccDetails }
    });
}

export default validateCard;