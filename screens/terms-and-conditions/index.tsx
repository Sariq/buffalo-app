import {
  View,
  StyleSheet,
} from "react-native";
import { Paragraph, Dialog, Portal, Provider } from "react-native-paper";
import Text from "../../components/controls/Text";

/* styles */
import theme from "../../styles/theme.style";
import Icon from "../../components/icon";
import { useState, useContext } from "react";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { StoreContext } from "../../stores";

const bodyText =
  "בניגוד לטענה הרווחת, Lorem Ipsum אינו סתם טקסט רנדומלי. יש לו שורשים וחלקים מתוך הספרות הלטינית הקלאסית מאז 45 לפני הספירה. מה שהופך אותו לעתיק מעל 2000 שנה. ריצ’רד מקלינטוק, פרופסור לטיני בקולג’ של המפדן-סידני בורג’יניה, חיפש את אחת המילים המעורפלות ביותר";

export default function TermsAndConditionsScreen() {
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
        <ScrollView>
          <View
            style={{
              paddingHorizontal: 40,
              alignItems: "center",
              paddingTop: 20,
            }}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}
            >
              תנאי שימוש ומדיניות פרטיות בשירותי אפליקציית בופלו
            </Text>
          </View>
          <View style={{ marginTop: 40, paddingHorizontal: 15 }}>
            <Text style={{ fontSize: 15, textAlign: "center" }}>
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
              {bodyText}
            </Text>
          </View>
        </ScrollView>
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
              text="غير موافق"
              bgColor={themeStyle.PRIMARY_COLOR}
              fontSize={20}
            />
          </View>
          <View style={{ width: 160 }}>
            <Button
              onClickFn={acceptTerms}
              text="موافق"
              bgColor={themeStyle.PRIMARY_COLOR}
              fontSize={20}
            />
          </View>
        </View>
      </View>
      <Provider>
        <Portal>
          <Dialog
            theme={{
              colors: {
                backdrop: "transparent",
              },
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(254, 203, 5, 0.9)",
            }}
            visible={visible}
            onDismiss={hideDialog}
          >
            <Dialog.Title>
              <Icon
                icon="exclamation-mark"
                size={50}
                style={{ color: theme.GRAY_700 }}
              />
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                زبوننا العزيز، اخترت عدم قبول شروط الاستخدام. لتتمكن من استخدام
                التطبيق يرجا الموافقه على الشروط{" "}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <View style={{ width: "50%" }}>
                <Button
                  onClickFn={hideDialog}
                  text="موافق"
                  bgColor={themeStyle.WHITE_COLOR}
                  fontSize={20}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Provider>
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
