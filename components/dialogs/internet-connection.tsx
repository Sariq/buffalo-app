import {
  DeviceEventEmitter,
    View,
  } from "react-native";
  import { Dialog, Portal, Provider } from "react-native-paper";
  import Text from "../controls/Text";
  import RNRestart from "react-native-restart";

  /* styles */
  import theme from "../../styles/theme.style";
  import Icon from "../../components/icon";
  import { useState, useEffect } from "react";
  import Button from "../../components/controls/button/button";
  import themeStyle from "../../styles/theme.style";
  import { useTranslation } from "react-i18next";
import i18n from "../../translations/i18n";
  
  type TProps = {
    isOpen: boolean;
    handleAnswer?: any;
  };
  
  export default function InterntConnectionDialog({
    isOpen,
    handleAnswer,
  }: TProps) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(isOpen);
  
    useEffect(() => {
      DeviceEventEmitter.addListener(
        `OPEN_INTERNET_CONNECTION_DIALOG`,
        ()=>{    setVisible(true);
        }
      );
    }, []);
    
    useEffect(() => {
      setVisible(isOpen);
    }, [isOpen]);
  
    const hideDialog = (value: boolean) => {
      handleAnswer && handleAnswer(value);
      setVisible(false);
      RNRestart.Restart();

    };

    return (
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
              paddingVertical: 30,
              borderRadius: 10,
            }}
            visible={visible}
            dismissable={false}
          >
            <Dialog.Title>
              <Icon
                icon="exclamation-mark"
                size={50}
                style={{ color: theme.GRAY_700 }}
              />
            </Dialog.Title>
            <Dialog.Content>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {i18n.exists('no-internet-connection') ? t("no-internet-connection") : "لا يوجد اتصال بالإنترنت ، اتصل بالإنترنت وحاول مرة أخرى"}
              </Text>
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
                  text={i18n.exists('ok') ? t("ok") : "حسنناً"}
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
  