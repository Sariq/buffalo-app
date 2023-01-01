import axios from "axios";
import { storeDataStore } from "../../../stores/store";
type TPayload = {
    TerminalNumber: string;
    Password: string;
    CardNumber: string,
    ExpDate_MMYY: string,
    CVV: string,
    TransactionSum: number,
    HolderID: number;
    ExtraData: string;
}
export type TPaymentProps = {
    cardNumber: string;
    expDate: string;
    cvv: string;
    totalPrice: number;
    holderId: number;
    orderId: number;
}
const chargeCreditCard = ({ cardNumber, expDate, cvv, totalPrice, holderId, orderId }: TPaymentProps) => {
    const paymentCredentials = storeDataStore.paymentCredentials;
    
    const body: TPayload = {
        TerminalNumber: paymentCredentials.credentials_terminal_number,
        Password: paymentCredentials.credentials_password,
        CardNumber: cardNumber,
        ExpDate_MMYY: expDate,
        CVV: cvv,
        TransactionSum: totalPrice,
        HolderID: holderId,
        ExtraData: orderId.toString()
    };
    console.log("paybd", body)

    return axios
        .post(
            'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/CommitFullTransaction',
            body,
        )
        .then(function (res: any) {
            console.log("pay", res)
            return res.data;
        });


}

export default chargeCreditCard;