import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import { observer } from "mobx-react";

const LanguageScreen = ({ store }) => {
    let languageStore = useContext(StoreContext).languageStore;
    const onChangeLanguage = (lng) => {
        languageStore.changeLang(lng)
    };

  return (
    <View style={styles.container}>
      <View style={{ borderWidth: 1, alignItems: "center" }}>
        <View >
          <Text style={styles.textLang}>בחר שפה</Text>
          <Text>{languageStore.selectedLang}</Text>
        </View>
        <View>
          <Button onClickFn={()=>{onChangeLanguage('ar')}} bgColor={themeStyle.PRIMARY_COLOR} text="עברית"/>
          <Button onClickFn={()=>{onChangeLanguage('he')}} bgColor={themeStyle.PRIMARY_COLOR} text="עברית"/>
        </View>
      </View>
    </View>
  );
}
export default observer(LanguageScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderWidth: 1,
  },
  textLang: {
    fontFamily: "Bold",
  },
});
