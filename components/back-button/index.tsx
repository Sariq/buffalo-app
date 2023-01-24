import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../../styles/theme.style";
import Icon from "../icon";
import * as Haptics from "expo-haptics";

export type TProps = {
  goTo?: string;
}
export default function BackButton({goTo}: TProps) {
  const navigation = useNavigation();

  const onBtnClick = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const routes = navigation.getState()?.routes;
    const currentRoute = routes[routes.length - 1]; // -2 because -1 is the current route
    const prevRoute = routes[routes.length - 2]; // -2 because -1 is the current route
    if ((currentRoute.name === "cart" || currentRoute.name === "profile") && (prevRoute.name === "verify-code" || prevRoute.name === "insert-customer-name")) {
      navigation.navigate("homeScreen");
      return;
    }
    if(goTo){
      navigation.navigate(goTo);
      return;
    }
    navigation.goBack();
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          onBtnClick();
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: "rgba(112,112,112,0.1)",
            borderRadius: 30,
            width: 35,
            height: 35,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
            transform: [{ rotate: "180deg" }],
          }}
        >
          <Icon icon="arrow-right" size={15} style={{ color: "#292d32" }} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    marginHorizontal: 20,
  },
});
