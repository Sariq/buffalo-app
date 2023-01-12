import axios from "axios";
import { storeDataStore } from "../../../stores/store";
type TPayload = {
    TerminalNumber: string;
    Password: string;
    CardNumber: string,
    TransactionSum: number,
    ExtraData: string;
}
export type TPaymentProps = {
    token: string;
    expDate: string;
    cvv: string;
    totalPrice: number;
    orderId: number;
}
const chargeCreditCard = ({ token, totalPrice, orderId }: TPaymentProps) => {
    const paymentCredentials = storeDataStore.paymentCredentials;
    
    const body: TPayload = {
        TerminalNumber: paymentCredentials.credentials_terminal_number,
        Password: paymentCredentials.credentials_password,
        CardNumber: token,
        TransactionSum: totalPrice,
        ExtraData: orderId.toString()
    };
    return axios
        .post(
            'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/CommitFullTransaction',
            body,
        )
        .then(function (res: any) {
            return res.data;
        });


}

export default chargeCreditCard;