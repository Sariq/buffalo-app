import { StyleSheet, Text, View } from "react-native";
import InputText from "../../components/controls/input";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text>ادخل رقم هاتفك</Text>
      <View style={{width: "100%",height: "100%", paddingHorizontal: 50}}>
        <InputText/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});