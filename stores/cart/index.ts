import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { toBase64 } from '../../helpers/convert-base64'
import { BASE_URL, ORDER_API } from "../../consts/api";
import Constants from "expo-constants";
import * as Device from 'expo-device';
import i18n from "../../translations";
import { axiosInstance } from "../../utils/http-interceptor";
var hash = require('object-hash');

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

  addProductToCart = (product) => {
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
  submitOrder = async(order: any) => {
  
    let finalOrder: TOrder = {
      payment_method: order.paymentMthod,
      receipt_method: order.shippingMethod,
      address: 'test',
      items: produtsAdapter(order.products)
    }
    const version = Constants.nativeAppVersion;

    const cartData: TCart = {
      order: finalOrder,
      total: order.totalPrice,
      app_language: i18n.locale === "ar" ? '1' : '2',
      device_os: Device.osName,
      app_version:version,
      unique_hash: hash(finalOrder),
      datetime: new Date(),
    }
    const orderBase64 = toBase64(cartData);
    console.log("SSSUB")
    const body = orderBase64;
    // axiosInstance
    //   .post(
    //     `${ORDER_API.CONTROLLER}/${ORDER_API.SUBMIT_ORDER_API}`,
    //     body,
    //     { headers: { "Content-Type": "application/json" } }
    //   )
    //   .then(function (response) {

    //     console.log("tokennnn", response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };
}

export const cartStore = new CartStore();
