import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
} from "react-native-paper";

/* styles */
import theme from "../../styles/theme.style";
import Icon from "../../components/icon";
import { useState } from "react";

export default function TermsAndConditionsScreen({ navigation }) {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
    <Provider>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 20,
        }}
      >
        <View>
          <Text style={{ fontSize: 25 }}>Ttitle</Text>
        </View>
        <View style={{ marginTop: 40 }}>
          <Text style={{ fontSize: 15 }}>Body</Text>
        </View>
        <View style={{ width:"100%", paddingHorizontal: 20, marginTop: 40, flexDirection:"row", justifyContent:"space-between" }}>
          <View>
            <Button onPress={showDialog}>Show Dialog</Button>
          </View>
          <View>
            <Button onPress={showDialog}>Show Dialog</Button>
          </View>
        </View>
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
              backgroundColor: theme.PRIMARY_COLOR,
              opacity: 0.9,
            }}
            visible={visible}
            onDismiss={hideDialog}
          >
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Paragraph>This is simple dialog</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
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
