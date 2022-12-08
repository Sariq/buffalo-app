import axios from "axios";

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


const validateCard = ({cardNumber, expDate}: TValidateCardProps) => {
    const body: TPayload = {
        TerminalNumber: TerminalNumber,
        Password: Password,
        CardNumber: cardNumber,
        ExpDate_MMYY: expDate,
    };
    return axios
    .post(
      'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/ValidateCard',
      body,
    )
    .then(function (res: any) {
      return {isValid: !res.HasError}
    });
}

export default validateCard;