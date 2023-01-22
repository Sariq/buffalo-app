import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { ORDER_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";
import { orderBy } from "lodash";
export const inProgressStatuses = ["SENT", "APPROVED"];

class OrdersStore {
  ordersList = null;

  constructor() {
    makeAutoObservable(this);
  }

  getOrdersFromServer = async () => {
    const body = { datetime: new Date() };
    return axiosInstance
      .post(
        `${ORDER_API.CONTROLLER}/${ORDER_API.GET_ORDERS_API}`,
        toBase64(body)
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        return res;
      });
  };

  getOrders = () => {
    return this.getOrdersFromServer().then((res) => {
      const orderedList = orderBy(res.orders, ["created_at"], ["desc"]);
      runInAction(() => {
        this.ordersList = orderedList;
      })
      return orderedList;
    })
  };

  isActiveOrders = () =>{
    const founded = this.ordersList?.find((order)=>{
      if (inProgressStatuses.indexOf(order.status.replace(/ /g, "")) > -1) {
        return true;
      }
    });
    return !!founded;
  }

  resetOrdersList = () =>{
    this.ordersList = [];
  }
}

export const ordersStore = new OrdersStore();
