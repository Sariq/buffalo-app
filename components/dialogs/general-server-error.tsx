import {
    View,
    StyleSheet,
    DeviceEventEmitter,
  } from "react-native";
  import { Paragraph, Dialog, Portal, Provider } from "react-native-paper";
  import RNRestart from "react-native-restart";

  /* styles */
  import theme from "../../styles/theme.style";
  import Icon from "../icon";
  import { useState, useEffect } from "react";
  import Button from "../controls/button/button";
  import themeStyle from "../../styles/theme.style";
import { useTranslation } from "react-i18next";
  
  
  export default function GeneralServerErrorDialog() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      DeviceEventEmitter.addListener(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, openDialog);
    }, []);

    const openDialog = () => {
      console.log("OPPPEN")
      setVisible(true);
    }
  
    const hideDialog = (value: boolean) => {
      setVisible(false);
      RNRestart.Restart();
    };

    return (
      <Provider>
        <Portal>
          <Dialog
            theme={{
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 30,
              borderRadius: 10,
            }}
            visible={visible}
            dismissable={false}
          >
            <Dialog.Content>
              <Paragraph
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {t('general-server-error')}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <View
                style={{
                  flexDirection: "row",
                  width: "50%",
                  justifyContent: "space-between",
                }}
              >
                  <Button
                    onClickFn={() => hideDialog(true)}
                    text={t('retry')}
                    bgColor={themeStyle.SUCCESS_COLOR}
                    textColor={themeStyle.WHITE_COLOR}
                    fontSize={16}
                  />
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
      marginHorizontal: 40 / 2,
    },
    image: {
      height: "100%",
      borderWidth: 4,
    },
  });
  