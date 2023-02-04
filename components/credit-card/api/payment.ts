import axios from "axios";
import { storeDataStore } from "../../../stores/store";
type TPayload = {
    TerminalNumber: string;
    Password: string;
    CardNumber: string,
    TransactionSum: number,
    ExtraData: string;
    HolderID: string;
    CustomerEmail?: string;
}
export type TPaymentProps = {
    token: string;
    totalPrice: number;
    orderId: number;
    id: number;
    email?:string;
}
const chargeCreditCard = ({ token, totalPrice, orderId, id, email }: TPaymentProps) => {
    const paymentCredentials = storeDataStore.paymentCredentials;
    
    let body: TPayload = {
        TerminalNumber: paymentCredentials.credentials_terminal_number,
        Password: paymentCredentials.credentials_password,
        CardNumber: token,
        TransactionSum: totalPrice,
        ExtraData: orderId?.toString(),
        HolderID: id?.toString(),
    };
    if(email){
        body.CustomerEmail = email;
    }
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