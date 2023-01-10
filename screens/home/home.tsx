import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/controls/button/button";

/* styles */
import theme from "../../styles/theme.style";
import Icon from "../../components/icon";
import { getCurrentLang } from "../../translations/i18n";
import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";
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

  const goToNewOrder = () => {
    navigation.navigate("menuScreen");
  };

  if (!isAppReady) {
    return;
  }

  return (
    <View style={{ height: "100%" }}>
      <ImageBackground
        source={require("../../assets/burj.png")}
        resizeMode="stretch"
        style={styles.image}
      >
        <View style={[styles.button, styles.bottomView]}>
          <View style={{ width: "90%" }}>
            <Button
              bgColor={themeStyle.PRIMARY_COLOR}
              text={t("new-order")}
              onClickFn={goToNewOrder}
              fontSize={40}
              icon={'new_order_icon'}
              borderRadious={0}
              iconSize={30}
            />
          </View>
        </View>
        {/* <View style={styles.container}>
          <TouchableOpacity
            onPress={goToNewOrder}
            style={[styles.button, styles.bottomView]}
          >
            <Icon
              icon="new_order_icon"
              size={20}
              style={{ color: theme.GRAY_700 }}
            />
            <Text style={{ ...styles.buttonText, fontFamily: `${getCurrentLang()}-SemiBold`, fontSize: 40 }}>
            {t('new-order')}
            </Text>
          </TouchableOpacity>
        </View> */}
      </ImageBackground>
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
    height: 50,
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
