import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../../styles/theme.style";
import Icon from "../icon";
import * as Haptics from "expo-haptics";
import DropDown from "../controls/dropdown";
import { SOTRES_LIST } from "../../consts/shared";
import { StoreContext } from "../../stores";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorePickedDialog from "../dialogs/store-picked/store-picked";

export default function CurrentStore() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isOpenStorePicked, setIsOpenStorePicked] = useState(false);
  let { storeDataStore,cartStore } = useContext(StoreContext);

  const [pickedStore, setPickedStore] = useState(storeDataStore.selectedStore);

  const onChange = async (value) => {
    console.log("storeDataStore.selectedStore", storeDataStore.selectedStore);
    if (storeDataStore.selectedStore != value) {
      setPickedStore(value);
      setIsOpenStorePicked(true);
    }
  };

  const handleStorePickedAnswer = async (data) => {
    console.log("DDDD", data);
    if (data.value) {
      cartStore.resetCart();
      await AsyncStorage.setItem("@storage_selcted_store", data.pickedStore);
      storeDataStore.setSelectedStore(data.pickedStore);
      navigation.navigate("homeScreen");
    } else {
      console.log("cancel", storeDataStore.selectedStore);
      setPickedStore(storeDataStore.selectedStore);
    }
    setIsOpenStorePicked(false);
  };

  return (
    <View style={styles.container}>
      <DropDown
        itemsList={SOTRES_LIST}
        defaultValue={pickedStore}
        onChangeFn={(e) => onChange(e)}
        placeholder={`${t("current-store")} ${
          storeDataStore.selectedStore == "1" ? t("tire") : t("tibe")
        }`}
        dropDownDirection={"BOTTOM"}
      />
      <View
        style={{
          position:"absolute",
          zIndex: 10,
          alignSelf: "center",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 300,
          display: isOpenStorePicked ? 'flex': 'none'
        }}
      >
        <StorePickedDialog
          handleAnswer={handleStorePickedAnswer}
          isOpen={isOpenStorePicked}
          pickedStore={pickedStore}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    zIndex: 1,
    maxWidth: 150,
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
