import { StyleSheet, Text, View } from "react-native";
import Icon from "../../components/icon";
import themeStyle from "../../styles/theme.style";

export default function ProfileScreen() {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        backgroundColor: "white",
        height: "100%",
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
        }}
      >
        <Icon icon="arrow-right" size={15} style={{ color: "#292d32" }} />
      </View>
      <View style={styles.container}>
        <View style={{ alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: 25 }}>Profile Screen</Text>
        </View>
        <View style={{ marginTop: 60 }}>
          <View style={styles.rowContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  marginRight: 10,
                  backgroundColor: "rgba(254, 203, 5, 0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 30,
                  padding: 10,
                }}
              >
                <Icon
                  icon="profile_icon"
                  size={30}
                  style={{ color: "#fecb05", opacity: 1 }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 25, color: "#442213" }}>
                  052-4043814
                </Text>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 25, color: "#292d32" }}>{">"}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(112,112,112,0.1)",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});
