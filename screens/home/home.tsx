import { View, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/controls/button/button";
import Carousel from "react-native-reanimated-carousel";

/* styles */

import { useEffect, useState, useContext, useRef } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";
import { axiosInstance } from "../../utils/http-interceptor";

const slides = [
  "https://img.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-599.jpg",
  "https://img.freepik.com/free-photo/multicolored-psychedelic-paper-shapes_23-2149378302.jpg",
];
const defaultImage = require("../../assets/burj.png");
const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [isAppReady, setIsAppReady] = useState(false);

  let { userDetailsStore } = useContext(StoreContext);

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
  }, []);

  const getMenuFromServer = () => {
    // const body = {};
    // return axiosInstance
    //   .post(
    //     `${C.CONTROLLER}/${MENU_API.GET_MENU_API}`,
    //     body,
    //   )
    //   .then(function (response) {
    //     const res = JSON.parse(fromBase64(response.data));
    //     return res;
    //   });
  }

  const goToNewOrder = () => {
    navigation.navigate("menuScreen");
  };

  if (!isAppReady) {
    return;
  }
  return (
    <View style={{ height: "100%" }}>
      <Carousel
        loop
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height}
        autoPlay={true}
        data={slides}
        scrollAnimationDuration={1500}
        autoPlayInterval={3000}
        renderItem={({ index }) => (
          <ImageBackground
            source={{ uri: slides[index] }}
            resizeMode="stretch"
            style={styles.image}
          />
        )}
      />
      <View style={[styles.button, styles.bottomView]}>
        <View style={{ width: "90%" }}>
          <Button
            bgColor={themeStyle.PRIMARY_COLOR}
            text={t("new-order")}
            onClickFn={goToNewOrder}
            fontSize={40}
            icon={"new_order_icon"}
            borderRadious={0}
            iconSize={30}
          />
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
