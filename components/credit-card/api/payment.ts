import { TerminalNumber, Password } from "./validate-card";
import axios from "axios";
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
    const body: TPayload = {
        TerminalNumber: TerminalNumber,
        Password: Password,
        CardNumber: cardNumber,
        ExpDate_MMYY: expDate,
        CVV: cvv,
        TransactionSum: totalPrice,
        HolderID: holderId,
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