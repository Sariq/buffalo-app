import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  DeviceEventEmitter,
} from "react-native";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/controls/button/button";
import Carousel from "react-native-reanimated-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { interpolate, withTiming } from "react-native-reanimated";
import { orderBy } from "lodash";

/* styles */

import { useEffect, useState, useContext, useCallback } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";
import { SITE_URL } from "../../consts/api";
import { getCurrentLang } from "../../translations/i18n";
import PickStoreDialog from "../../components/dialogs/pick-store/pick-store";
import StoreIsCloseDialog from "../../components/dialogs/store-is-close";
import StoreErrorMsgDialog from "../../components/dialogs/store-errot-msg";
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import PickedStoreDialog from "../../components/dialogs/picked-store/picked-store";
import StorePickedDialog from "../../components/dialogs/store-picked/store-picked";
import CustomFastImage from "../../components/custom-fast-image";

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  let {
    userDetailsStore,
    menuStore,
    ordersStore,
    authStore,
    storeDataStore,
    cartStore,
  } = useContext(StoreContext);
  const [isAppReady, setIsAppReady] = useState(false);
  const [homeSlides, setHomeSlides] = useState();
  const [isActiveOrder, setIsActiveOrder] = useState(false);
  const [isOpenPickStore, setIsOpenPickStore] = useState(false);
  const [isOpenStorePicked, setIsOpenStorePicked] = useState(false);
  const [showStoreIsCloseDialog, setShowStoreIsCloseDialog] = useState(false);
  const [isPageActive, setIsPageActive] = useState(false);
  const [storeErrorText, setStoreErrorText] = useState("");
  const [isOpenStoreErrorMsgDialog, setIsOpenStoreErrorMsgDialog] =
    useState(false);
  const [pickedStore, setPickedStore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const displayTemrsAndConditions = async () => {
    if (!userDetailsStore.isAcceptedTerms) {
      setTimeout(() => {
        navigation.navigate("terms-and-conditions");
      }, 0);
    }
    setIsAppReady(true);
  };

  useEffect(() => {
    displayTemrsAndConditions();
    setIsPageActive(true);
  }, []);

  useEffect(() => {
    if (menuStore?.homeSlides) {
      const tmpSliders: any = orderBy(menuStore.homeSlides, ["tag"], ["asc"]);
      setHomeSlides(tmpSliders);
    }
  }, [menuStore.homeSlides]);

  const getOrders = () => {
    if (authStore.isLoggedIn()) {
      ordersStore.getOrders();
    }
  };

  useEffect(() => {
    if (authStore.isLoggedIn()) {
      getOrders();
      setTimeout(() => {
        getOrders();
      }, 15 * 1000);
      const interval = setInterval(() => {
        getOrders();
      }, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [authStore.userToken]);

  useEffect(() => {
    if (ordersStore.ordersList) {
      setIsActiveOrder(ordersStore.isActiveOrders());
    }
  }, [ordersStore.ordersList]);

  useEffect(() => {
    const GoToNewOrderListener = DeviceEventEmitter.addListener(
      `GO_TO_NEW_ORDER`,
      () => {
        goToNewOrder();
      }
    );
    return () => {
      GoToNewOrderListener.remove();
    };
  }, [isPageActive]);

  const goToNewOrder = async () => {
    if (!storeDataStore.selectedStore) {
      // storeDataStore.setSelectedStore(null);
      // await AsyncStorage.setItem("@storage_selcted_store_v2", "");
      setIsOpenPickStore(true);
      storeDataStore.onDisableAreas({ header: true, footer: true });
    } else {
      navigation.navigate("menuScreen");
    }
  };
  const goToOrdersStatus = () => {
    navigation.navigate("orders-status");
  };

  const handleStorePickedAnswer = async (data) => {
    if (data.value) {
      setIsLoading(true);
      storeDataStore.setSelectedStore(data.pickedStore);
      await AsyncStorage.setItem("@storage_selcted_store_v2", data.pickedStore);
      const fetchMenuStore = menuStore.getMenu(data.pickedStore);
      const fetchStoreData = storeDataStore.getStoreData(data.pickedStore);
      Promise.all([fetchMenuStore, fetchStoreData]).then(async (res) => {
        // if(authStore.isLoggedIn()){
        //   await storeDataStore.getPaymentCredentials(value);
        // }
        const storeStatus = isStoreAvailable(res);
        storeDataStore.onDisableAreas({ header: false, footer: false });
        if (!storeStatus.isOpen) {
          cartStore.resetCart();
          setPickedStore(null);
          setIsLoading(false);
          setIsOpenStorePicked(false);
          setShowStoreIsCloseDialog(true);

          return;
        } else {
          if (storeStatus.ar || storeStatus.he) {
            cartStore.resetCart();
            setStoreErrorText(storeStatus[getCurrentLang()]);
            setPickedStore(null);
            setIsLoading(false);
            setIsOpenStorePicked(false);
            setIsOpenStoreErrorMsgDialog(true);
            return;
          }
        }
        cartStore.resetCart();
        setPickedStore(null);
        setIsLoading(false);
        setIsOpenStorePicked(false);
        navigation.navigate("menuScreen");
      });
    } else {
      storeDataStore.onDisableAreas({ header: false, footer: false });
      setPickedStore(null);
      setIsOpenStorePicked(false);
    }
  };

  const handlePickedStoreOpen = async (value) => {
    setPickedStore(value);
    setIsOpenStorePicked(true);
  };

  const handlePickStoreAnswer = async (value) => {
    // await AsyncStorage.setItem("@storage_selcted_store", value);
    setIsOpenPickStore(false);
    handlePickedStoreOpen(value);
  };

  const animationStyle: any = useCallback((value: number) => {
    "worklet";

    const zIndex = withTiming(interpolate(value, [-1, 0, 1], [10, 20, 30]));
    // const scale = interpolate(value, [-1, 0, 1], [1.25, 1, 0.25]);
    const opacity = withTiming(interpolate(value, [-0.75, 0, 1], [0, 1, 0]), {
      duration: 0,
    });

    return {
      // transform: [{ scale }],
      zIndex,
      opacity,
    };
  }, []);

  const isStoreAvailable = (res) => {
      return {
        ar: res["invalid_message_ar"],
        he: res["invalid_message_he"],
        isOpen: res.alwaysOpen || res.isOpen,
        isBusy: false,
      };
  };

  const handleStoreIsCloseAnswer = (value: boolean) => {
    setShowStoreIsCloseDialog(false);
    navigation.navigate("menuScreen");
  };

  const handleStoreErrorMsgAnswer = () => {
    setIsOpenStoreErrorMsgDialog(false);
    navigation.navigate("menuScreen");
  };

  if (!isAppReady || !homeSlides) {
    return;
  }
  return (
    <View style={{ height: "100%" }}>
      <Carousel
        loop={homeSlides.length == 1 ? false : true}
        width={Dimensions.get("window").width}
        height={"100%"}
        autoPlay={homeSlides.length == 1 ? false : true}
        data={homeSlides}
        scrollAnimationDuration={3000}
        autoPlayInterval={3000}
        customAnimation={animationStyle}
        renderItem={({ index }) => (
          <CustomFastImage
            style={{
              width: "100%",
              height: "100%",
            }}
            source={{ uri: `${SITE_URL}${homeSlides[index].file_url}` }}
            cacheKey={`${`${SITE_URL}${homeSlides[index].file_url}`
              .split(/[\\/]/)
              .pop()}`}
            resizeMode="stretch"
          />
        )}
      />
      {!isOpenPickStore && !isOpenStorePicked && (
        <View style={[styles.button, styles.bottomView]}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View style={{ flexBasis: isActiveOrder ? "48%" : "90%" }}>
              <Button
                bgColor={themeStyle.PRIMARY_COLOR}
                text={t("new-order")}
                onClickFn={goToNewOrder}
                fontSize={isActiveOrder ? 26 : 40}
                icon={"new_order_icon"}
                borderRadious={50}
                iconSize={isActiveOrder ? 20 : 30}
                textPadding={0}
                marginH={5}
                textColor={themeStyle.BROWN_700}
                fontFamily={`${getCurrentLang()}-Bold`}
              />
            </View>
            {isActiveOrder && (
              <View style={{ flexBasis: "48%" }}>
                <Button
                  bgColor={themeStyle.SUCCESS_COLOR}
                  text={t("current-orders")}
                  onClickFn={goToOrdersStatus}
                  fontSize={isActiveOrder ? 26 : 40}
                  borderRadious={50}
                  textPadding={0}
                  marginH={5}
                  fontFamily={`${getCurrentLang()}-Bold`}
                />
              </View>
            )}
          </View>
        </View>
      )}
      <StorePickedDialog
        handleAnswer={handleStorePickedAnswer}
        isOpen={isOpenStorePicked}
        pickedStore={pickedStore}
        isLoading={isLoading}
        text="home-store-picked-title"
      />
      <PickStoreDialog
        handleAnswer={handlePickStoreAnswer}
        isOpen={isOpenPickStore}
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
  );
};
export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20 / -2,
  },
  bottomView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 0, //Here is the trick
    marginBottom: 60,
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
  },
});
