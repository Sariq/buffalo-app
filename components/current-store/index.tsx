import { StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../../styles/theme.style";
import Icon from "../icon";
import * as Haptics from "expo-haptics";
import DropDown from "../controls/dropdown";
import { SOTRES_LIST } from "../../consts/shared";
import { StoreContext } from "../../stores";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CurrentStore() {
  const { t } = useTranslation();

  let { storeDataStore } = useContext(StoreContext);

  const onChange = async (value) => {
    await AsyncStorage.setItem("@storage_selcted_store", value);
    storeDataStore.setSelectedStore(value);
  };

  return (
    <View style={styles.container}>
        <DropDown
        itemsList={SOTRES_LIST}
        defaultValue={storeDataStore.selectedStore}
        onChangeFn={(e) => onChange(e)}
        placeholder={`${t("current-store")} ${
          storeDataStore.selectedStore == "1" ? t("tire") : t("tibe")
        }`}
        dropDownDirection={"BOTTOM"}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    zIndex:1,
    maxWidth:150
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
