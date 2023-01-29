import { View, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/controls/button/button";
import Carousel from "react-native-reanimated-carousel";

/* styles */

import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";
import { SITE_URL } from "../../consts/api";
import { getCurrentLang } from "../../translations/i18n";

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [isAppReady, setIsAppReady] = useState(false);
  const [homeSlides, setHomeSlides] = useState();
  const [isActiveOrder, setIsActiveOrder] = useState(false);
  let { userDetailsStore, menuStore, ordersStore, authStore } = useContext(StoreContext);

  const displayTemrsAndConditions = async () => {
    if (!userDetailsStore.isAcceptedTerms) {
      setTimeout(() => {
        navigation.navigate("terms-and-conditions");
      }, 0);
    }
    setIsAppReady(true);
  };

  useEffect(() => {
    displayTemrsAndConditions();
    setHomeSlides(menuStore.homeSlides);
  }, []);


  const getOrders = () => {
    ordersStore.getOrders();
  };

  useEffect(() => {
    if(authStore.isLoggedIn()){
      getOrders();
      setTimeout(() => {
        getOrders();
      }, 15 * 1000);
      const interval = setInterval(() => {
        getOrders();
      }, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [authStore.userToken]);

  useEffect(()=>{
    if(ordersStore.ordersList){
      setIsActiveOrder(ordersStore.isActiveOrders());
    }
  },[ordersStore.ordersList])

  const goToNewOrder = () => {
    navigation.navigate("menuScreen");
  };
  const goToOrdersStatus = () => {
    navigation.navigate("orders-status");
  };
  if (!isAppReady || !homeSlides) {
    return;
  }
  return (
    <View style={{ height: "100%" }}>
      <Carousel
        loop
        width={Dimensions.get("window").width}
        height="100%"
        autoPlay={true}
        data={homeSlides}
        scrollAnimationDuration={1500}
        autoPlayInterval={3000}
        renderItem={({ index }) => (
          <ImageBackground
            source={{ uri: `${SITE_URL}${homeSlides[index].file_url}` }}
            resizeMode="stretch"
            style={styles.image}
          />
        )}
      />
      <View style={[styles.button, styles.bottomView]}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View style={{ flexBasis: isActiveOrder ? "48%" : "90%" }}>
            <Button
              bgColor={themeStyle.PRIMARY_COLOR}
              text={t("new-order")}
              onClickFn={goToNewOrder}
              fontSize={isActiveOrder ? 27 : 40}
              icon={"new_order_icon"}
              borderRadious={50}
              iconSize={isActiveOrder ? 20 : 30}
              textPadding={0}
              marginH={5}
              textColor={themeStyle.BROWN_700}
              fontFamily={`${getCurrentLang()}-Bold`}
            />
          </View>
          {isActiveOrder && (
            <View style={{ flexBasis: "48%" }}>
              <Button
                bgColor={themeStyle.SUCCESS_COLOR}
                text={t("current-orders")}
                onClickFn={goToOrdersStatus}
                fontSize={isActiveOrder ? 27 : 40}
                borderRadious={50}
                textPadding={0}
                marginH={5}
                fontFamily={`${getCurrentLang()}-Bold`}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20 / -2,
  },
  bottomView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 0, //Here is the trick
    marginBottom: 60,
  },
  buttonText: {
    fontSize: 20,
    color: "black",
    // paddingRight: 15,
    // paddingTop: 5
    marginHorizontal: 40 / 2,
  },
  image: {
    height: "100%",
  },
});
