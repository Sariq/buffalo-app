import { View } from "react-native";
import { Dialog, Portal, Provider } from "react-native-paper";
import Text from "../../controls/Text";

/* styles */
import theme from "../../../styles/theme.style";
import { useState, useEffect } from "react";
import Button from "../../../components/controls/button/button";
import themeStyle from "../../../styles/theme.style";
import { useTranslation } from "react-i18next";
import Icon from "../../icon";

type TProps = {
  isOpen: boolean;
  handleAnswer?: any;
  text?: string;
  icon?: any;
};

export default function RecipetNotSupportedDialog({
  isOpen,
  handleAnswer,
  text,
  icon,
}: TProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  const hideDialog = (value: boolean) => {
    handleAnswer && handleAnswer(value);
    setVisible(false);
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
          <Dialog.Content>
            {icon && (
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Icon icon={icon} size={90} style={{ color: theme.GRAY_700 }} />
              </View>
            )}
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {t(text)}
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
                text={t("ok")}
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
