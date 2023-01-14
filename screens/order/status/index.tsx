import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../../../stores";
import themeStyle from "../../../styles/theme.style";
import { fromBase64, toBase64 } from "../../../helpers/convert-base64";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "../../../translations/i18n";
import { isEmpty } from "lodash";
import Icon from "../../../components/icon";
import { axiosInstance } from "../../../utils/http-interceptor";
import { ORDER_API } from "../../../consts/api";
//2 -ready | if comple
const OrdersStatusScreen = ({ route }) => {
  const { t } = useTranslation();
  const { menuStore } = useContext(StoreContext);
  const [ordersList, setOrdersList] = useState([]);

  const getOrders = () => {
    const body = {datetime: new Date()};
     axiosInstance
      .post(
        `${ORDER_API.CONTROLLER}/${ORDER_API.GET_ORDERS_API}`,
       toBase64(body),
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        setOrdersList(res.orders);
      })
  };

  useEffect(() => {
    getOrders();
  }, []);

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
            <Text style={styles.dateRawText}>{order.id} </Text>
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
      return <Text>+ {extra.name}</Text>;
    });
  };

  const renderOrderItems = (order) => {
    const tmpOrder = fromBase64(order.order);
    const tmpOrderValue = JSON.parse(tmpOrder);
    return tmpOrderValue.items.map((item) => {
      const meal: any = menuStore.getFromCategoriesMealByKey(item.item_id);
      if (isEmpty(meal)) {
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
            <View style={{flexDirection:"row", justifyContent:"flex-start" }}>
              <View
                style={{
                  flexBasis: "40%",
                  height: 80,
                  padding:5, marginVertical:10,alignItems: "center",
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%"}}
                  source={{ uri: meal?.image_url }}
                />
              </View>
              <View style={{ alignItems: "flex-start" }}>
                {renderOrderItemsExtras(item.data)}
              </View>
            </View>
          </View>
          <View style={{alignItems:"center"}}>
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

  const renderStatus = (order) => {
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
            {order.receipt_method === "TAKEAWAY"
              ? t("takeway-service")
              : t("delivery-service")}
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
              <Icon icon="checked-green" size={40} />
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
                {order.receipt_method === "TAKEAWAY"
                  ? t("ready-takeaway")
                  : t("on-way")}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Icon icon="checked-gray" size={40} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (ordersList.length < 1) {
    return;
  }
  return (
    <ScrollView style={styles.container}>
      {ordersList.map((order) => (
        <View style={{marginBottom: 50}}>
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
