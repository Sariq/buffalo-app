import { View, StyleSheet } from "react-native";

/* styles */
import theme from "../../styles/theme.style";
import { useState, useContext } from "react";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoreContext } from "../../stores";
import { WebView } from "react-native-webview";
import TremsDialog from "../../components/dialogs/terms";
import { useTranslation } from "react-i18next";

export default function TermsAndConditionsScreen() {
  const { t } = useTranslation();

  let { userDetailsStore } = useContext(StoreContext);

  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const acceptTerms = async () => {
    await AsyncStorage.setItem("@storage_terms_accepted", JSON.stringify(true));
    userDetailsStore.setIsAcceptedTerms(true);
    navigation.navigate("homeScreen");
  };

  return (
    <View>

    <View style={{ backgroundColor: themeStyle.WHITE_COLOR, height: "100%" }}>
      
      <WebView
        source={{
          uri: "https://sites.google.com/view/buffalo-pri/%D7%91%D7%99%D7%AA",
        }}
        style={{ height: "100%", width: "100%" }}
      />
              <View
          style={{
            width: "100%",
            paddingHorizontal: 15,
            marginTop: 10,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: 160 }}>
            <Button
              onClickFn={showDialog}
              text={t('not-agree')}
              bgColor={themeStyle.PRIMARY_COLOR}
              fontSize={20}
            />
          </View>
          <View style={{ width: 160 }}>
            <Button
              onClickFn={acceptTerms}
              text={t('agree')}
              bgColor={themeStyle.PRIMARY_COLOR}
              fontSize={20}
            />
          </View>
        </View>

    </View>
    <TremsDialog
        handleAnswer={acceptTerms}
        isOpen={visible}
      />
    </View>
  );
}

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
    borderWidth: 4,
  },
});
