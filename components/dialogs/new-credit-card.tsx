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
  import { useState, useEffect } from "react";
  import Button from "../../components/controls/button/button";
  import themeStyle from "../../styles/theme.style";
import CreditCard from "../credit-card";
  
  type TProps = {
    isOpen: boolean;
    handleAnswer?: any;
  };
  
  export default function NewPaymentMethodDialog({ isOpen, handleAnswer }: TProps) {
    const [visible, setVisible] = useState(isOpen);
  
    useEffect(() => {
        console.log("isopen")
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
              },
            }}
            style={{
                width: "85%",
                marginHorizontal: 30,
              paddingVertical: 10,
              borderRadius: 10,
              top: 0,
              position: "absolute",
              paddingHorizontal: 0
            }}
            visible={visible}
            dismissable={false}
          >
            <Dialog.Content >
                <CreditCard />

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
  