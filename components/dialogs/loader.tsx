import { View } from "react-native";
import { ActivityIndicator, Dialog, Portal, Provider } from "react-native-paper";
import Text from "../controls/Text";

/* styles */
import theme from "../../styles/theme.style";
import Icon from "../../components/icon";
import { useState, useEffect } from "react";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useTranslation } from "react-i18next";

type TProps = {
  isOpen: boolean;
  handleAnswer?: any;
};

export default function LoaderDialog({
  isOpen,
  handleAnswer,
}: TProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);


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
            opacity:0.9
          }}
          visible={visible}
          dismissable={false}
        >
          <Dialog.Content>
          <ActivityIndicator animating={true} color={theme.PRIMARY_COLOR} size={40}/>

          </Dialog.Content>
         
        </Dialog>
      </Portal>
    </Provider>
  );
}
