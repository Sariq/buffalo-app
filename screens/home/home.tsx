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
const HomeScreen = ({ navigation }) => {
  const [t, i18n] = useTranslation();

  const goToNewOrder = () => {
    navigation.navigate("menuScreen");
  };
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
            <Text style={{ ...styles.buttonText, fontFamily: `ar-SemiBold`, fontSize: 40 }}>
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
