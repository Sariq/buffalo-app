import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { toBase64, fromBase64 } from '../../helpers/convert-base64'
import { ORDER_API } from "../../consts/api";
import Constants from "expo-constants";
import * as Device from 'expo-device';
import i18n from "../../translations";
import { axiosInstance } from "../../utils/http-interceptor";
var hash = require('object-hash');

export type TOrderSubmitResponse = {
  has_err:boolean;
  code:number;
  order_id:number;
  status:string;
  salt: string;
}

export type TUpdateCCPaymentRequest = {
  order_id: number;
  creditcard_ReferenceNumber: string;
  datetime: Date;
}
type TOrderHistory = {
  phoneNumber: string;
  ordersList: TCart[];
}
type TGradiants = {
  id: number;
  name: string;
  value: any;
}
type TProduct = {
  item_id: number;
  qty: number;
  price: number;
  notes: string;
  data: TGradiants[];
}
type TOrder = {
  payment_method: 'CREDITCARD' | 'CASH';
  receipt_method: 'DELIVERY' | 'TAKEAWAY';
  creditcard_ReferenceNumber?: string;
  address: string;
  items: TProduct[];
}

type TCart = {
  order: TOrder;
  total: number;
  app_language: '1' | '2',
  device_os: string,
  app_version: string,
  unique_hash?: string;
  datetime: Date
}


const prodcutExtrasAdapter = (extras) => {
  let productExtras = [];
  if(!extras){
    return productExtras;
  }
  Object.keys(extras).map((key) => (
    extras[key].map((extra) => {
      productExtras.push({ id: extra.id, name: extra.name, value: extra.value });
    })
  ))
  return productExtras;
}

const produtsAdapter = (products) => {
  let finalProducts = [];
  products.map((product) => {
    const finalProduct = {
      item_id: product.data.id,
      qty: product.others.count,
      price: product.data.price,
      notes: product.others.note,
      data: prodcutExtrasAdapter(product.extras)
    }
    finalProducts.push(finalProduct);
  })
  return finalProducts;
}

class CartStore {
  cartItems = [];

  isEnabled = false;

  constructor() {
    makeAutoObservable(this);

    this.getDefaultValue();
  }
  getDefaultValue = async () => {
    const jsonValue = await AsyncStorage.getItem("@storage_cartItems");
    const value = jsonValue != null ? JSON.parse(jsonValue) : [];
    this.setDefaultValue(value);
  };

  setDefaultValue = (value) => {
    this.cartItems = value;
  };

  updateLocalStorage = async () => {
    try {
      const jsonValue = JSON.stringify(this.cartItems);
      await AsyncStorage.setItem("@storage_cartItems", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  addProductToCart = async (product) => {
    if(this.cartItems.length === 0 ){
      const storage_cartCreatedDate = {
        date: new Date()
      }
      await AsyncStorage.setItem("@storage_cartCreatedDate", JSON.stringify(storage_cartCreatedDate));
    }
    this.cartItems.push(product);
    this.updateLocalStorage();
  };

  removeProduct = (productId) => {
    this.cartItems = this.cartItems.filter(
      (item, index) => item.data.id + index !== productId
    );
    this.updateLocalStorage();
  };

  updateCartProduct = (index, product) => {
    this.cartItems[index] = { ...product };
  };

  getProductByIndex = (index) => {
    return JSON.parse(JSON.stringify(this.cartItems[index]));
  };

  updateProductCount = (productId, count) => {
    this.cartItems = this.cartItems.map((item, index) => {
      if (item.data.id + index === productId) {
        item.data.price = item.data.price + ((count - item.others.count) * (item.data.price / item.others.count));
        item.others.count = count;
      }
      return item;
    });
    this.updateLocalStorage();
  }

  getProductsCount = () => {
    let count = 0;
    this.cartItems.forEach((product) => {
      count += product.others.count;
    })
    return count;
  };

  generateUniqueHash = (value: any) => {
    var hash = 0,
    i, chr;
  if (value.length === 0) return hash;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
  }

  getHashKey = async (finalOrder: any) => {
    const cartCreatedDate = await AsyncStorage.getItem("@storage_cartCreatedDate");
    const cartCreatedDateValue = JSON.parse(cartCreatedDate);
    const hashObject = {
      finalOrder,
      cartCreatedDateValue: cartCreatedDateValue.date
    };
    return hash(hashObject);
  }

  getCartData = async (order: any) => {
    let finalOrder: TOrder = {
      payment_method: order.paymentMthod,
      receipt_method: order.shippingMethod,
      address: 'test1',
      items: produtsAdapter(order.products)
    }
    const version = Constants.nativeAppVersion;
    const hashKey = await this.getHashKey(finalOrder);

    const cartData: TCart = {
      order: finalOrder,
      total: order.totalPrice,
      app_language: i18n.locale === "ar" ? '1' : '2',
      device_os: Device.osName,
      app_version:version,
      unique_hash: hashKey,
      datetime: new Date(),
    }
    return cartData;
  }

  resetCart = () => {
    this.cartItems = [];
    this.updateLocalStorage();
  }

  submitOrder = async(order: any): Promise<TOrderSubmitResponse> =>  {
    const cartData = await this.getCartData(order);
    const orderBase64 = toBase64(cartData).toString();
    const body = orderBase64;

    return axiosInstance
      .post(
        `${ORDER_API.CONTROLLER}/${ORDER_API.SUBMIT_ORDER_API}`,
        body,
      )
      .then(function (response) {
        const jsonValue:any = JSON.parse(fromBase64(response.data));
        
        const data:TOrderSubmitResponse = {
          has_err: jsonValue.has_err,
          order_id: jsonValue.order_id,
          salt: jsonValue.salt,
          status: jsonValue.status,
          code: jsonValue.code,
        }
        return data;
      })
      .catch(function (error) {
        const data:TOrderSubmitResponse = { has_err: true, order_id:0, salt:"",status:"", code: 0}
        return data;
      });
  };

  UpdateCCPayment = ({ order_id, creditcard_ReferenceNumber, datetime}: TUpdateCCPaymentRequest)=> {
    const body: TUpdateCCPaymentRequest = {
      order_id,
      creditcard_ReferenceNumber,
      datetime
    }
    return axiosInstance
      .post(
        `${ORDER_API.CONTROLLER}/${ORDER_API.UPDATE_CCPAYMENT_API}`,
        toBase64(body),
      )
      .then(function (response) {
        return JSON.parse(fromBase64(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addNewOrderToHistory = async (order: any, phoneNumber: string)=>{
    const ordersHistory: TOrderHistory = {
      phoneNumber,
      ordersList: [order]
    };
    console.log("ordersHistory", ordersHistory);
    const jsonValue = JSON.stringify(ordersHistory);
    await AsyncStorage.setItem("@storage_orderHistory", jsonValue);
  }
  addOrderToHistory = async (order: any, phoneNumber: string)=>{
    const jsonValue = await AsyncStorage.getItem("@storage_orderHistory");
    const currentOrderdHistory = jsonValue != null ? JSON.parse(jsonValue) : [];
    console.log("currentHostory", currentOrderdHistory);
    console.log("order", order);
    console.log("phoneNumber", phoneNumber);

    if(currentOrderdHistory.length == 0){
      this.addNewOrderToHistory(order, phoneNumber);
    }
  }
  getOrderHistory = async () => {
    const jsonValue = await AsyncStorage.getItem("@storage_orderHistory");
    const currentOrderdHistory = jsonValue != null ? JSON.parse(jsonValue) : [];
    return currentOrderdHistory;
  }
}

export const cartStore = new CartStore();
