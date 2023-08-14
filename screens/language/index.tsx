import { StyleSheet, View, Image } from "react-native";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { getCurrentLang } from "../../translations/i18n";
import Text from "../../components/controls/Text";

const LanguageScreen = ({ route }) => {
  const { languageStore } = useContext(StoreContext);
  const navigation = useNavigation();
  const { isFromTerms } = route.params;

  const onChangeLanguage = (lng) => {
    languageStore.changeLang(lng);
    if(isFromTerms){
      navigation.navigate("homeScreen");
    }else{
      navigation.goBack();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <View>
          <Text
            style={{
              ...styles.textLang,
              fontFamily: "ar-SemiBold",
            }}
          >
            أختر اللغة
          </Text>
          <Text
            style={{
              ...styles.textLang,
              fontFamily: "he-SemiBold",
            }}
          >
            בחר שפה
          </Text>
        </View>
        <View style={{ width: "60%", marginTop: 80 }}>
          <View>
            <Button
              onClickFn={() => {
                onChangeLanguage("ar");
              }}
              bgColor={
                getCurrentLang() === "ar"
                  ? themeStyle.PRIMARY_COLOR
                  : "white"
              }
              fontSize={29}
              fontFamily="ar-SemiBold"
              text="العربية"
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              onClickFn={() => {
                onChangeLanguage("he");
              }}
              bgColor={
                getCurrentLang() === "he"
                  ? themeStyle.PRIMARY_COLOR
                  : "white"
              }
              fontSize={29}
              fontFamily="he-SemiBold"
              text="עברית"
            />
          </View>
        </View>
      </View>
      <Image
        style={{ width: "100%", height: "15%", marginTop: 80 }}
        source={require("../../assets/logo-banner.png")}
      />
    </View>
  );
};
export default observer(LanguageScreen);

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    textLang: {
      //   fontFamily: props.fontFamily + "Bold",
      fontSize: 29,
    },
  });
