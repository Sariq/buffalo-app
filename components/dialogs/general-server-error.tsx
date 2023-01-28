import { View, DeviceEventEmitter } from "react-native";
import { Dialog, Portal, Provider } from "react-native-paper";
import RNRestart from "react-native-restart";
import Text from "../controls/Text";

/* styles */
import theme from "../../styles/theme.style";
import Icon from "../icon";
import { useState, useEffect, useContext } from "react";
import Button from "../controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useTranslation } from "react-i18next";
import { StoreContext } from "../../stores";

export default function GeneralServerErrorDialog() {
  const { t } = useTranslation();
  const { authStore } = useContext(StoreContext);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    DeviceEventEmitter.addListener(
      `OPEN_GENERAL_SERVER_ERROR_DIALOG`,
      openDialog
    );
  }, []);

  const openDialog = (data) => {
    if(data.isSignOut){
      authStore.logOut();
    }
    setVisible(true);
  };

  const hideDialog = (value: boolean) => {
    setVisible(false);
    RNRestart.Restart();
  };

  return (
    <Provider>
      <Portal>
        <Dialog
          theme={{}}
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
              {t("general-server-error")}
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
                text={t("retry")}
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
