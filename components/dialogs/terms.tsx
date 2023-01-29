import { Paragraph, Dialog, Portal, Provider } from "react-native-paper";
import Icon from "../icon";
import themeStyle from "../../styles/theme.style";
import { View } from "react-native";
import Button from "../controls/button/button";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Text from "../../components/controls/Text"
type TProps = {
  isOpen: boolean;
  handleAnswer?: any;
};

export default function TremsDialog({ isOpen, handleAnswer }: TProps) {
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
            backgroundColor: "rgba(254, 203, 5, 0.9)",
            padding:20
          }}
          visible={visible}
          dismissable={false}
        >
          <Dialog.Title>
            <Icon
              icon="exclamation-mark"
              size={50}
              style={{ color: themeStyle.GRAY_700 }}
            />
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
             {t('terms-not-accepted-text')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <View style={{ width: "50%" }}>
              <Button
                onClickFn={hideDialog}
                text={t('agree')}
                bgColor={themeStyle.WHITE_COLOR}
                fontSize={20}
              />
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}