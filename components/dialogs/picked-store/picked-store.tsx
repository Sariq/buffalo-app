import { View } from "react-native";
import {
  ActivityIndicator,
  Dialog,
  Portal,
  Provider,
} from "react-native-paper";
import Text from "../../controls/Text";

/* styles */
import theme from "../../../styles/theme.style";
import { useState, useEffect } from "react";
import Button from "../../controls/button/button";
import themeStyle from "../../../styles/theme.style";
import { useTranslation } from "react-i18next";
import Icon from "../../icon";
import { getCurrentLang } from "../../../translations/i18n";
import { TouchableOpacity } from "react-native-gesture-handler";

type TProps = {
  isOpen: boolean;
  handleAnswer?: any;
  data:any;
};

export default function PickedStoreDialog({ isOpen, handleAnswer, data }: TProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setVisible(isOpen);
    setIsLoading(false)
  }, [isOpen]);

  const hideDialog = (value: any) => {
    handleAnswer && handleAnswer(value);
    setIsLoading(true)
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
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            width: "95%",
            alignSelf: "center",
          }}
          visible={visible}
          dismissable={false}
        >
          <Dialog.Title style={{ paddingTop: 10 }}>
          {!isLoading && <Text
              style={{ fontSize: 38, fontFamily: `${getCurrentLang()}-Bold` }}
            >
              {t("pick-store")}
            </Text>}
          </Dialog.Title>
          <Dialog.Content style={{}}>
            {isLoading && <View style={{height:100}}>
              <ActivityIndicator animating={true} color={theme.PRIMARY_COLOR} size={40} />
            </View>}
            {!isLoading && <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              
            </View>}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Provider>
  );
}
