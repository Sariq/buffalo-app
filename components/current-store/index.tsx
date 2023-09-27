import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../../styles/theme.style";
import Icon from "../icon";
import * as Haptics from "expo-haptics";
import DropDown from "../controls/dropdown";
import { SOTRES_LIST } from "../../consts/shared";
import { StoreContext } from "../../stores";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorePickedDialog from "../dialogs/store-picked/store-picked";
import StoreIsCloseDialog from "../dialogs/store-is-close";
import { getCurrentLang } from "../../translations/i18n";
import StoreErrorMsgDialog from "../dialogs/store-errot-msg";

export default function CurrentStore() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  let { storeDataStore, cartStore, menuStore, authStore } = useContext(StoreContext);
  const [isOpenStorePicked, setIsOpenStorePicked] = useState(false);
  const [showStoreIsCloseDialog, setShowStoreIsCloseDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeErrorText, setStoreErrorText] = useState("");
  const [isOpenStoreErrorMsgDialog, setIsOpenStoreErrorMsgDialog] = useState(
    false
  );
  const [pickedStore, setPickedStore] = useState(storeDataStore.selectedStore);
  
  useEffect(()=>{
    setPickedStore(storeDataStore.selectedStore)
  },[storeDataStore.selectedStore]);

  const storesList = SOTRES_LIST.map((store)=>{
    return {label: t(store.label), value: store.value}
  });

  const isStoreAvailable = () => {
    return storeDataStore
      .getStoreData(storeDataStore.selectedStore)
      .then((res) => {
        return {
          ar: res["invalid_message_ar"],
          he: res["invalid_message_he"],
          isOpen: res.alwaysOpen || res.isOpen,
          isBusy: false,
        };
      });
  };

  const onChange = async (value) => {
    if (storeDataStore.selectedStore != value) {
      const storeStatus = await isStoreAvailable();
      if (!storeStatus.isOpen) {
        setShowStoreIsCloseDialog(true);
      } else {
        if (storeStatus.ar || storeStatus.he) {
          setStoreErrorText(storeStatus[getCurrentLang()]);
          setIsOpenStoreErrorMsgDialog(true);
        }
      }

      setPickedStore(value);
      setIsOpenStorePicked(true);
    }
  };

  const handleStorePickedAnswer = async (data) => {
    if (data.value) {
      setIsLoading(true);
      const fetchMenuStore = menuStore.getMenu(data.pickedStore);
      const fetchStoreData = storeDataStore.getStoreData(data.pickedStore);
      Promise.all([
        fetchMenuStore,
        fetchStoreData,
      ]).then(async (res) => {
        // if(authStore.isLoggedIn()){
        //   await storeDataStore.getPaymentCredentials(data.pickedStore);
        // }
          setIsLoading(false);
          setIsOpenStorePicked(false);
          cartStore.resetCart();
          await AsyncStorage.setItem("@storage_selcted_store", data.pickedStore);
          storeDataStore.setSelectedStore(data.pickedStore);
          // menuStore.getMenu(data.pickedStore)
          navigation.navigate("homeScreen");
      });

    } else {
      setPickedStore(storeDataStore.selectedStore);
      setIsOpenStorePicked(false);
    }
  };

  const handleStoreIsCloseAnswer = (value: boolean) => {
    setShowStoreIsCloseDialog(false);
  };

  const handleStoreErrorMsgAnswer = () => {
    setIsOpenStoreErrorMsgDialog(false);
  };

  return (
    <View style={styles.container}>
      <DropDown
        itemsList={storesList}
        defaultValue={pickedStore}
        onChangeFn={(e) => onChange(e)}
        placeholder={`${t("current-store")} ${
          storeDataStore.selectedStore == "1" ? t("tire") : t("tibe")
        }`}
        dropDownDirection={"BOTTOM"}
      />
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          alignSelf: "center",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 300,
          display: isOpenStorePicked ? "flex" : "none",
        }}
      >
        <StorePickedDialog
          handleAnswer={handleStorePickedAnswer}
          isOpen={isOpenStorePicked}
          pickedStore={pickedStore}
          isLoading={isLoading}
        />
        <StoreIsCloseDialog
          handleAnswer={handleStoreIsCloseAnswer}
          isOpen={showStoreIsCloseDialog}
        />
        <StoreErrorMsgDialog
          handleAnswer={handleStoreErrorMsgAnswer}
          isOpen={isOpenStoreErrorMsgDialog}
          text={storeErrorText}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    zIndex: 1,
    maxWidth: 120,
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
