import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../../../stores";
import themeStyle from "../../../styles/theme.style";
import { fromBase64, toBase64 } from "../../../helpers/convert-base64";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "../../../translations/i18n";
import { isEmpty, orderBy } from "lodash";
import Icon from "../../../components/icon";
import { axiosInstance } from "../../../utils/http-interceptor";
import { ORDER_API } from "../../../consts/api";
//2 -ready | if comple
const inProgressStatuses = ["SENT"];
const readyStatuses = ["COMPLETED", "READY"];
const canceledStatuses = ["CANCELLED", "REJECTED"];

const OrdersStatusScreen = ({ route }) => {
  const { t } = useTranslation();
  const { menuStore } = useContext(StoreContext);
  const [ordersList, setOrdersList] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  const getOrders = () => {
    const body = { datetime: new Date() };
    axiosInstance
      .post(
        `${ORDER_API.CONTROLLER}/${ORDER_API.GET_ORDERS_API}`,
        toBase64(body)
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        const orderdList = orderBy(res.orders, ["created_at"], ["desc"]);
        setOrdersList(orderdList);
        setIsloading(false);
      });
  };

  useEffect(() => {
    setIsloading(true);
    getOrders();
    setTimeout(() => {
      getOrders();
    }, 15 * 1000);
    const interval = setInterval(() => {
      getOrders();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getIconByStatus = (status: string, type: number) => {
    if (type === 1) {
      if (inProgressStatuses.indexOf(status) > -1) {
        return "checked-green";
      }
      return "checked-gray";
    }
    if (type === 2) {
      if (readyStatuses.indexOf(status) > -1) {
        return "checked-green";
      }
      if (canceledStatuses.indexOf(status) > -1) {
        return "red-x";
      }
      return "checked-gray";
    }
    return "checked-gray";
  };

  const renderOrderDateRaw = (order) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View>
            <Text style={styles.dateRawText}>{t("order-number")}:</Text>
          </View>
          <View>
            <Text style={styles.dateRawText}>
              {order.id}-{order.local_id}{" "}
            </Text>
          </View>
        </View>
        <View style={{}}>
          <Text style={styles.dateRawText}>
            {moment(order.created_at).format("HH:mm DD/MM/YYYY")}
          </Text>
        </View>
      </View>
    );
  };
  const renderOrderTotalRaw = (order) => {
    const oOrder = JSON.parse(fromBase64(order.order));
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderTopWidth: 0.4,
          borderColor: "#707070",
          paddingTop: 20,
          marginTop: 15,
          marginHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            <Text style={styles.totalPriceText}>
              {t(oOrder.payment_method)} | {t(oOrder.receipt_method)}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View>
            <Text style={styles.totalPriceText}>{t("final-price")}:</Text>
          </View>
          <View>
            <Text style={styles.totalPriceText}>₪{order.total} </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderOrderItemsExtras = (extras) => {
    return extras.map((extra) => {
      return (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginRight: 2 }}>+</Text>
          <Text>{extra.name}</Text>
        </View>
      );
    });
  };

  const renderOrderItems = (order) => {
    const tmpOrder = fromBase64(order.order);
    const tmpOrderValue = JSON.parse(tmpOrder);
    return tmpOrderValue.items.map((item) => {
      const meal: any = menuStore.getFromCategoriesMealByKey(item.item_id);
      if (isEmpty(meal) || item.item_id === 3027) {
        return;
      }
      return (
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 5,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: `${getCurrentLang()}-SemiBold`,
                  color: themeStyle.GRAY_700,
                }}
              >
                {meal[`name_${getCurrentLang()}`]}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <View
                style={{
                  flexBasis: "40%",
                  height: 80,
                  padding: 5,
                  marginVertical: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: meal?.image_url }}
                />
              </View>
              <View style={{ alignItems: "flex-start" }}>
                {renderOrderItemsExtras(item.data)}
              </View>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: `${getCurrentLang()}-SemiBold`,
                  color: themeStyle.GRAY_700,
                }}
              >
                {t("count")}: {item.qty}
              </Text>
            </View>
            <View style={{ marginTop: 2, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: `${getCurrentLang()}-SemiBold`,
                  color: themeStyle.GRAY_700,
                }}
              >
                ₪{item.price}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const getTextByShippingMethod = (method) => {
    switch (method) {
      case "TAKEAWAY":
        return "takeway-service";
      case "DELIVERY":
        return "delivery-service";
      case "TABLE":
        return "in-resturant-service";
    }
  };
  const getTextStatusByShippingMethod = (method, status) => {
    if (canceledStatuses.indexOf(status) > -1) {
      return "cancelled";
    }
    switch (method) {
      case "TAKEAWAY":
        return "ready-takeaway";
      case "DELIVERY":
        return "on-way";
      case "TABLE":
        return "ready-table";
    }
  };

  const renderStatus = (order) => {
    const oOrder = JSON.parse(fromBase64(order.order));
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: `${getCurrentLang()}-SemiBold`,
              color: themeStyle.GRAY_700,
            }}
          >
            {t(getTextByShippingMethod(oOrder.receipt_method))}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: `${getCurrentLang()}-SemiBold`,
                  color: themeStyle.GRAY_700,
                }}
              >
                {t("in-progress")}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Icon
                icon={getIconByStatus(order.status.replace(/ /g, ""), 1)}
                size={40}
              />
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: `${getCurrentLang()}-SemiBold`,
                  color: themeStyle.GRAY_700,
                }}
              >
                {getTextStatusByShippingMethod(
                  oOrder.receipt_method,
                  order.status.replace(/ /g, "")
                )}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Icon
                icon={getIconByStatus(order.status.replace(/ /g, ""), 2)}
                size={40}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  if(isLoading){
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text style={{ fontSize: 20 }}>{t("loading-orders")}</Text>
      </View>
    );
  }

  if (ordersList.length < 1) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text style={{ fontSize: 20 }}>{t("empty-orders")}</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {ordersList.map((order) => (
        <View style={{ marginBottom: 50 }}>
          <View style={styles.orderContainer}>
            {renderOrderDateRaw(order)}
            {renderOrderItems(order)}
            {renderOrderTotalRaw(order)}
          </View>
          {renderStatus(order)}
        </View>
      ))}
    </ScrollView>
  );
};
export default observer(OrdersStatusScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginTop: 40,
  },
  orderContainer: {
    backgroundColor: themeStyle.WHITE_COLOR,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
    paddingTop: 15,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  dateRawText: {
    fontSize: 17,
    fontFamily: `${getCurrentLang()}-SemiBold`,
    color: themeStyle.GRAY_700,
  },
  totalPriceText: {
    fontSize: 15,
    fontFamily: `${getCurrentLang()}-SemiBold`,
    color: themeStyle.GRAY_700,
  },
});
