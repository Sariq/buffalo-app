import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Dialog, Portal, Provider } from "react-native-paper";

/* styles */
import theme from "../../styles/theme.style";
import { useState, useEffect } from "react";
import CreditCard from "../credit-card";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";

type TProps = {
  isOpen: boolean;
  handleAnswer?: any;
};

export default function NewPaymentMethodDialog({
  isOpen,
  handleAnswer,
}: TProps) {
  const [visible, setVisible] = useState(isOpen);
  const [t, i18n] = useTranslation();

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  const hideDialog = (value?: boolean) => {
    handleAnswer && handleAnswer(value);
    setVisible(false);
  };
  const onClose = () => {
    handleAnswer && handleAnswer("close");
    setVisible(false);
  };

  return (
    <Provider>
      <Portal>
        <Dialog
          theme={{
            colors: {},
          }}
          style={{
            width: "85%",
            marginHorizontal: 30,
            paddingVertical: 0,
            borderRadius: 10,
            top: 0,
            position: "absolute",
            paddingHorizontal: 0,
            overflow: "hidden",
          }}
          visible={visible}
          dismissable={false}
        >
          <Dialog.Content
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "white",
                zIndex: 1,
                paddingBottom: 5,
                padding: 20,
              }}
            >
              <View style={{ alignItems: "flex-start" }}>
                <Text style={{ fontSize: 18 }}>
                  {t("inser-credit-card-details")}
                </Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Text
                    onPress={onClose}
                    style={{
                      fontSize: 25,
                    }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={{ paddingHorizontal: 20 }}>
                <CreditCard onSaveCard={hideDialog} />
              </View>
            </ScrollView>
          </Dialog.Content>
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
    // paddingRight: 15,
    // paddingTop: 5
    marginHorizontal: 40 / 2,
  },
  image: {
    height: "100%",
    borderWidth: 4,
  },
});
