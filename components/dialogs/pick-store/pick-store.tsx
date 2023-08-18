import { View } from "react-native";
import { Dialog, Portal, Provider } from "react-native-paper";
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
};

export default function PickStoreDialog({ isOpen, handleAnswer }: TProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  const hideDialog = (value: any) => {
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
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            width: "95%",
            alignSelf: "center",
          }}
          visible={visible}
          dismissable={false}
        >
          <Dialog.Title style={{ paddingTop: 10 }}>
            <Text
              style={{ fontSize: 38, fontFamily: `${getCurrentLang()}-Bold` }}
            >
              {t("pick-store")}
            </Text>
          </Dialog.Title>
          <Dialog.Content style={{}}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: themeStyle.WHITE_COLOR,
                  borderRadius: 10,
                  height: "90%",
                  flexBasis: "50%",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 25,
                    paddingTop: 10,
                    
                  }}
                  onPress={()=>hideDialog('1')}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 16 }}>{t("branch")}</Text>
                  </View>
                  <View style={{ flexDirection: "row", padding: 0, top: -15 }}>
                    <Text style={{ fontSize: 34 }}>{t("tira")}</Text>
                  </View>
                  <View style={{ flexDirection: "row", top: -20 }}>
                    <Icon
                      icon="shipping_icon"
                      size={30}
                      style={{ color: themeStyle.GRAY_700 }}
                    />
                    <View style={{ marginHorizontal: 10 }}>
                      <Icon icon="takeaway-icon" size={30} />
                    </View>
                    <Icon
                      icon="table"
                      size={30}
                      style={{ color: themeStyle.GRAY_700 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ width: 20 }}></View>

              <View
                style={{
                  backgroundColor: themeStyle.WHITE_COLOR,
                  borderRadius: 10,
                  height: "90%",
                  flexBasis: "50%",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 25,
                    paddingTop: 10,
                  }}
                  onPress={()=>hideDialog('2')}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 16 }}>{t("branch")}</Text>
                  </View>
                  <View style={{ flexDirection: "row", padding: 0, top: -15 }}>
                    <Text style={{ fontSize: 34 }}>{t("tibe")}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      top: -20,
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      icon="shipping_icon"
                      size={30}
                      style={{ color: themeStyle.GRAY_700 }}
                    />
                    <View style={{ marginHorizontal: 10 }}>
                      <Icon icon="takeaway-icon" size={30} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Provider>
  );
}
