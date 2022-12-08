import { TerminalNumber, Password } from "./validate-card";
import axios from "axios";
type TPayload = {
    TerminalNumber: string;
    Password: string;
    CardNumber: string,
    ExpDate_MMYY: string,
    CVV: string,
    CVTransactionSum: number,
}
type TPaymentProps = {
    cardNumber: string;
    expDate: string;
    cvv: string;
    totalPrice: number;
}
const payment = ({ cardNumber, expDate, cvv, totalPrice }: TPaymentProps) => {
    const body: TPayload = {
        TerminalNumber: TerminalNumber,
        Password: Password,
        CardNumber: cardNumber,
        ExpDate_MMYY: expDate,
        CVV: cvv,
        CVTransactionSum: totalPrice
    };

    return axios
        .post(
            'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/CommitFullTransaction',
            body,
        )
        .then(function (res: any) {
            return res.HasError;
        });


}

export default payment;