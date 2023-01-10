import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

/* styles */
import theme from "../../styles/theme.style";
import Icon from "../../components/icon";
import { getCurrentLang } from "../../translations/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../stores";
const HomeScreen = ({ navigation }) => {
  const [t, i18n] = useTranslation();
  const [isAppReady, setIsAppReady] = useState(false);

  let { userDetailsStore } = useContext(StoreContext);

  const displayTemrsAndConditions = async () => {
    // await AsyncStorage.setItem(
    //   "@storage_terms_accepted",
    //   JSON.stringify(false)
    // );
      // const data = await AsyncStorage.getItem("@storage_terms_accepted");
      if (!userDetailsStore.isAcceptedTerms) {
        setTimeout(()=>{
          navigation.navigate("terms-and-conditions");
        },0)
      }
      setIsAppReady(true);
  };
  useEffect(() => {
    displayTemrsAndConditions();
  }, []);

  const goToNewOrder = () => {
    navigation.navigate("menuScreen");
  };

  if(!isAppReady){
    return;
  }
  return (
    <View style={{ height: "100%" }}>
      <ImageBackground
        source={require("../../assets/burj.png")}
        resizeMode="stretch"
        style={styles.image}
      >
        <View style={styles.container}>
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
        </View>
      </ImageBackground>
    </View>
  );
}
export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20 / -2,
  },
  bottomView: {
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 0, //Here is the trick
    marginBottom: 40,
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
