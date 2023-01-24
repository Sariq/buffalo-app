import { StyleSheet, Text, View } from "react-native";
import Icon from "../../components/icon";
import BackButton from "../../components/back-button";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../stores";
import { observer } from "mobx-react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import themeStyle from "../../styles/theme.style";

const ProfileScreen = () => {
  const { t } = useTranslation();

  const { userDetailsStore, authStore } = useContext(StoreContext);
  const navigation = useNavigation();

  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {
    if (userDetailsStore.userDetails) {
      const items = [
        {
          title: userDetailsStore?.userDetails?.phone,
          icon: "profile_icon",
          key: "phone",
        },
        {
          title: t("order-list"),
          icon: "orders-list",
          key: "orders",
        },
        {
          title: t("signout"),
          icon: "logout",
          key: "signout",
        },
      ];
      setItemsList(items);
    }
  }, [userDetailsStore.userDetails]);

  const actionHandler = (key: string) => {
    switch (key) {
      case "orders":
        onGoToOrdersList();
        break;
      case "signout":
        onLogOut();
        break;
      case "deleteAccount":
        deletAccount();
        break;
    }
  };

  const deletAccount = () => {
    authStore.deleteAccount();
    navigation.navigate("homeScreen");
  };
  const onLogOut = () => {
    authStore.logOut();
    navigation.navigate("homeScreen");
  };
  const onGoToOrdersList = () => {
    navigation.navigate("orders-status");
  };

  const renderItems = () => {
    return itemsList.map((item) => (
      <TouchableOpacity
        onPress={() => actionHandler(item.key)}
        style={styles.rowContainer}
      >
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
                icon={item.icon}
                size={30}
                style={{ color: "#fecb05", opacity: 1 }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 25, color: "#442213" }}>
                {item.title}
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 25, color: "#292d32" }}>
              <Icon
                icon="small-arrow-right"
                size={15}
                style={{ color: "#292D32" }}
              />
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <BackButton />

      <View style={styles.container}>
        <View style={{ alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: 25 }}>
            {t("hello")}، {userDetailsStore?.userDetails?.name}
          </Text>
        </View>
        <View style={{ marginTop: 0 }}>{renderItems()}</View>
      </View>
      <View  style={{
          alignItems: "center",
          position: "absolute",
          bottom: 5,
          margin: "auto",
          left: 0,
          right: 0,
        }}>
      <TouchableOpacity
        onPress={() => actionHandler('deleteAccount')}
       
      >
        <Text style={{color: themeStyle.GRAY_300}}>{t("delete-account")}</Text>
      </TouchableOpacity>
      </View>

    </View>
  );
};

export default observer(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(112,112,112,0.1)",
    height: "80%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});
