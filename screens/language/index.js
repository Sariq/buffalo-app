import { StyleSheet, Text, View, Image } from "react-native";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import { observer } from "mobx-react";

const LanguageScreen = ({ store }) => {
  const { languageStore, globalStyles } = useContext(StoreContext);
  const onChangeLanguage = (lng) => {
    languageStore.changeLang(lng);
  };

  return (
    <View style={styles(globalStyles).container}>
      <View style={{  alignItems: "center" }}>
        <View>
          <Text
            style={{
              ...styles(globalStyles).textLang,
              fontFamily: "ar-SemiBold",
            }}
          >
            أختر اللغة
          </Text>
          <Text
            style={{
              ...styles(globalStyles).textLang,
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
              bgColor={themeStyle.PRIMARY_COLOR}
              fontSize={29}
              fontFamily="ar-SemiBold"
              text="العربية"
              width="100%"
            />
          </View>
          <View style={{marginTop: 20}}>
            <Button
              onClickFn={() => {
                onChangeLanguage("he");
              }}
              bgColor={'white'}
              fontSize={29}
              fontFamily="he-SemiBold"
              text="עברית"
            />
          </View>
        </View>
      </View>
      <Image
                        style={{ width: "100%", height: "15%", marginTop:80 }}
                        source={require("../../assets/logo-banner.png")}
                      />
    </View>
  );
};
export default observer(LanguageScreen);

const styles = (props) =>
  StyleSheet.create({
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
