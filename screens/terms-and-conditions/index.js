import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Paragraph, Dialog, Portal, Provider } from "react-native-paper";

/* styles */
import theme from "../../styles/theme.style";
import Icon from "../../components/icon";
import { useState } from "react";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";

const bodyText =
  "בניגוד לטענה הרווחת, Lorem Ipsum אינו סתם טקסט רנדומלי. יש לו שורשים וחלקים מתוך הספרות הלטינית הקלאסית מאז 45 לפני הספירה. מה שהופך אותו לעתיק מעל 2000 שנה. ריצ’רד מקלינטוק, פרופסור לטיני בקולג’ של המפדן-סידני בורג’יניה, חיפש את אחת המילים המעורפלות ביותר";

export default function TermsAndConditionsScreen({ navigation }) {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
    <Provider>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 20,
          paddingHorizontal: 20,
          backgroundColor: themeStyle.WHITE_COLOR,
          height: "100%"

        }}
      >
        <View>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            תנאי שימוש ומדיניות פרטיות בשירותי אפליקציית בופלו
          </Text>
        </View>
        <View style={{ marginTop: 40 }}>
          <Text style={{ fontSize: 15, textAlign: "center" }}>
            {bodyText}
            {bodyText}
            {bodyText}
            {bodyText}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            paddingHorizontal: 20,
            marginTop: 40,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: 120 }}>
            <Button
              onClickFn={showDialog}
              text="غير موافق"
              bgColor={themeStyle.PRIMARY_COLOR}
            />
          </View>
          <View style={{ width: 120 }}>
            <Button
              onClickFn={showDialog}
              text="موافق"
              bgColor={themeStyle.PRIMARY_COLOR}
            />
          </View>
        </View>
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
              opacity: 0.9,
            }}
            visible={visible}
            onDismiss={hideDialog}
          >
            <Dialog.Title>Alert</Dialog.Title>
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
      </View>
    </Provider>
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
