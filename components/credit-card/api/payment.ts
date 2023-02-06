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
    CVV: string;
    PhoneNumber: string;
    ZCreditInvoiceReceipt?: any;
}
export type TPaymentProps = {
    token: string;
    totalPrice: number;
    orderId: number;
    id: number;
    email?: string;
    cvv?: string;
    phone: string;
    userName: string;

}
const chargeCreditCard = ({ token, totalPrice, orderId, id, email, cvv, phone,userName }: TPaymentProps) => {
    const paymentCredentials = storeDataStore.paymentCredentials;

    let body: TPayload = {
        TerminalNumber: paymentCredentials.credentials_terminal_number,
        Password: paymentCredentials.credentials_password,
        CardNumber: token,
        TransactionSum: totalPrice,
        ExtraData: orderId?.toString(),
        HolderID: id?.toString(),
        CVV: cvv,
        PhoneNumber: phone,
        "ZCreditInvoiceReceipt": {
            "Type": "0",
            "RecepientName": userName,
            "RecepientCompanyID": "",
            "Address": "",
            "City": "",
            "ZipCode": "",
            "PhoneNum": phone,
            "FaxNum": "",
            "TaxRate": "17",
            "Comment": "",
            "ReceipientEmail": email,
            "EmailDocumentToReceipient": "",
            "ReturnDocumentInResponse": "",
            "Items": [{
                "ItemDescription": "מנה",
                "ItemQuantity": "1",
                "ItemPrice": totalPrice?.toString(),
                "IsTaxFree": "false"
            }]
        }
    };
    if (email) {
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