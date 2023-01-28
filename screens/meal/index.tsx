import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  DeviceEventEmitter,
} from "react-native";
import Text from "../../components/controls/Text";

import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import { isEmpty } from "lodash";

import GradiantRow from "../../components/gradiant-row";
import Button from "../../components/controls/button/button";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../stores";
import { ScrollView } from "react-native-gesture-handler";
import themeStyle from "../../styles/theme.style";
import Icon from "../../components/icon";
import { getCurrentLang } from "../../translations/i18n";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const extrasIcons = {
  משקל: require("../../assets/menu/gradiant/burgerSlice.png"),
  "צ׳דר": require("../../assets/menu/gradiant/cheese.png"),
  "1116": require("../../assets/menu/gradiant/baecon.png"),
  "בייקון טלה": require("../../assets/menu/gradiant/baecon.png"),
  "בייקון עגל": require("../../assets/menu/gradiant/baecon.png"),
  חלפיניו: require("../../assets/menu/gradiant/jalapeno.png"),
  "ביצת עין": require("../../assets/menu/gradiant/egg.png"),
  "פטריות פורטבלו": require("../../assets/menu/gradiant/truffle.png"),
  "בצל מטוגן": require("../../assets/menu/gradiant/friedOnion.png"),
  מיונז: require("../../assets/menu/gradiant/maio.png"),
  עגבנייה: require("../../assets/menu/gradiant/tomatto.png"),
  חסה: require("../../assets/menu/gradiant/khs.png"),
  מלפפון: require("../../assets/menu/gradiant/pickels.png"),
  בצל: require("../../assets/menu/gradiant/onion.png"),
  קטשופ: require("../../assets/menu/gradiant/ketchup.png"),
  "סרירצ'ה": require("../../assets/menu/gradiant/sersachi.png"),
  ברביקיו: require("../../assets/menu/gradiant/barbicu.png"),
  חרדל: require("../../assets/menu/gradiant/musterd.png"),
  "תוספת קריספי": require("../../assets/menu/gradiant/crispy-chicken.png"),
  מוצרלה: require("../../assets/menu/gradiant/mozerla.png"),
  "צ'ילי מתוק": require("../../assets/menu/gradiant/sweet-chilli.png"),
  "רוטב בופלו": require("../../assets/menu/gradiant/buffalo-souce.png"),
  "גבינת גאודה": require("../../assets/menu/gradiant/gaouda.png"),
  //"צ'ילי מתוק": require("../../assets/menu/gradiant/barbicu.png"),
  //"מוצרלה": require("../../assets/menu/gradiant/barbicu.png"),
  //"תוספת קריספי": require("../../assets/menu/gradiant/barbicu.png"),
  //"לחתוך באמצע": require("../../assets/menu/gradiant/barbicu.png"),
};
const MealScreen = ({ route }) => {
  const { t } = useTranslation();
  const { product, index } = route.params;
  const navigation = useNavigation();
  let { cartStore, menuStore, languageStore } = useContext(StoreContext);
  const [meal, setMeal] = useState();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    let tmpProduct: any = {};
    if (product) {
      setIsEdit(false);
      tmpProduct = menuStore.getMealByKey(product.id);
      // for products without constants
      if (isEmpty(tmpProduct)) {
        tmpProduct.data = product;
      }
      tmpProduct.others = { count: 1, note: "" };
    }
    if (index !== null && index !== undefined) {
      setIsEdit(true);
      tmpProduct = cartStore.getProductByIndex(index);
    }
    setMeal(tmpProduct);
  }, []);

  const onAddToCart = () => {
    DeviceEventEmitter.emit(`add-to-cart-animate`, {
      imgUrl: meal.data.image_url,
    });
    cartStore.addProductToCart(meal);
    navigation.goBack();
  };

  const onUpdateCartProduct = () => {
    cartStore.updateCartProduct(index, meal);
    navigation.goBack();
  };

  const onClose = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  const updateMeal = (value, tag, type) => {
    let extraPrice = 0;
    const currentExtraType = JSON.parse(JSON.stringify(meal.extras[type]));
    const extrasType = meal.extras[type].map((tagItem) => {
      if (tagItem.id === tag.id) {
        switch (tag.type) {
          case "COUNTER":
            extraPrice =
              value > tagItem.value
                ? extraPrice + tagItem.price * meal.others.count
                : extraPrice - tagItem.price * meal.others.count;
            break;
          case "CHOICE":
            if (!tag.multiple_choice) {
              const currentTag = currentExtraType.find(
                (tagItem) => tagItem.value === true
              );
              if (currentTag) {
                const tagDeltaPrice = tagItem.price - currentTag.price;
                extraPrice = extraPrice + tagDeltaPrice;
              }
            } else {
              extraPrice = value
                ? extraPrice + tagItem.price * meal.others.count
                : extraPrice - tagItem.price * meal.others.count;
            }
            break;
          default:
            break;
        }
        tagItem.value = value;
      } else {
        if (tag.type === "CHOICE" && !tag.multiple_choice) {
          tagItem.value = false;
        }
      }
      return tagItem;
    });
    if (extraPrice !== 0) {
      meal.extras[type] = extrasType;
      setMeal({
        ...meal,
        data: { ...meal.data, price: meal.data.price + extraPrice },
        extras: meal.extras,
      });
    }
  };

  const updateOthers = (value, key, type) => {
    if (key === "count") {
      const updatedPrice =
        meal.data.price +
        (value - meal.others.count) * (meal.data.price / meal.others.count);
      setMeal({
        ...meal,
        [type]: { ...meal[type], [key]: value },
        data: { ...meal.data },
      });
    } else {
      setMeal({ ...meal, [type]: { ...meal[type], [key]: value } });
    }
  };

  const isAvailableOnApp = (key: string) => {
    let isAvailable = false;
    Object.keys(meal.extras[key]).forEach((tagId) => {
      const tag = meal.extras[key][tagId];
      if (tag.available_on_app) {
        isAvailable = true;
      }
    });
    return isAvailable;
  };

  const isOneChoiceTag = (tags) => {
    const result = tags.find((tag) => tag.multiple_choice === false);
    return !!result;
  };
  const isOneChoiceTagStyle = (tags) => {
    const result = isOneChoiceTag(tags);
    const rowStyle = {
      flexDirection: "row",
      justifyContent: "space-evenly",
    };
    return result ? rowStyle : {};
  };

  const orderList = (index: any) => {
    const result = Object.keys(meal.extras.orderList).find(
      (key) => meal.extras.orderList[key] === index
    );
    return result;
  };

  if (!meal) {
    return null;
  }

  return (
    <View
      style={{ height: "100%", marginBottom: 40, backgroundColor: "white" }}
    >
      <LinearGradient
        colors={["white", "#F9F9F9", "#FCFCFC", "#FCFCFC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.1 }}
        style={styles.background}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={100}
        behavior="position"
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 20,
            }}
          >
            <View>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  zIndex: 1,
                  position: "absolute",
                  right: -10,
                  width: "10%",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                  }}
                >
                  X
                </Text>
              </TouchableOpacity>
              <View style={{ width: 310, height: 230, padding: 10 }}>
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: meal.data.image_url }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                marginTop: 0,
                alignSelf: "flex-start",
                paddingHorizontal: 40,
                paddingBottom: 15,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 25,
                    textAlign: "left",
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    color: themeStyle.GRAY_700,
                  }}
                >
                  {meal.data[`name_${languageStore.selectedLang}`]}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "left",
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    marginTop: 10,
                    lineHeight: 17.5,
                    color: themeStyle.GRAY_700,
                  }}
                >
                  {meal.data[`description_${languageStore.selectedLang}`]}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.gradiantRowContainer}>
              <GradiantRow
                onChangeFn={(value) => {
                  updateOthers(value, "count", "others");
                }}
                type="COUNTER"
                title={t("count-from-same")}
                value={meal["others"]["count"]}
                hideIcon
                fontSize={20}
                minValue={1}
              />
            </View>
          </View>

          {meal.extras &&
            Object.keys(meal.extras).map((key, index) => {
              let keyOrdered = orderList(index);
              if (keyOrdered) {
                return (
                  isAvailableOnApp(keyOrdered) && (
                    <View key={keyOrdered} style={[styles.sectionContainer]}>
                      {meal.extras[keyOrdered] && (
                        <View style={[styles.gradiantRowContainer]}>
                          {isOneChoiceTag(meal.extras[keyOrdered]) && (
                            <Text
                              style={{
                                fontSize: 20,
                                textAlign: "center",
                                marginBottom: 8,
                                color: themeStyle.GRAY_700,
                              }}
                            >
                              {t(keyOrdered)}
                            </Text>
                          )}
                          <View
                            style={[
                              isOneChoiceTag(meal.extras[keyOrdered])
                                ? {
                                    ...isOneChoiceTagStyle(
                                      meal.extras[keyOrdered]
                                    ),
                                    maxWidth: "80%",
                                    alignSelf: "center",
                                  }
                                : {},
                            ]}
                          >
                            {Object.keys(meal.extras[keyOrdered]).map(
                              (tagId) => {
                                const tag = meal.extras[keyOrdered][tagId];
                                if (tag.available_on_app) {
                                  return (
                                    <View
                                      key={tagId}
                                      style={{ paddingVertical: 3 }}
                                    >
                                      <GradiantRow
                                        onChangeFn={(value) => {
                                          updateMeal(value, tag, keyOrdered);
                                        }}
                                        icon={extrasIcons[tag.name]}
                                        type={tag.type}
                                        title={menuStore.translate(tag.name)}
                                        price={tag.price}
                                        minValue={tag.counter_min_value}
                                        stepValue={tag.counter_step_value}
                                        value={tag.value}
                                        isMultipleChoice={tag.multiple_choice}
                                      />
                                    </View>
                                  );
                                }
                              }
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  )
                );
              }
            })}

          <View style={styles.sectionContainer}>
            <View style={styles.gradiantRowContainer}>
              <View style={{ padding: 10 }}>
                <View>
                  <Text
                    style={{
                      textAlign: "left",
                      fontFamily: `${getCurrentLang()}-SemiBold`,
                      paddingLeft: 40,
                      fontSize: 15,
                    }}
                  >
                    {t("meal-notes")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    marginTop: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexBasis: "10%",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(254, 203, 5, 0.18)",
                      borderRadius: 10,
                      height: 40,
                    }}
                  >
                    <Icon icon="pen" size={20} />
                  </View>
                  <View style={{ flexBasis: "88%", justifyContent: "center" }}>
                    <TextInput
                      onChange={(e) => {
                        updateOthers(e.nativeEvent.text, "note", "others");
                      }}
                      value={meal["others"]["note"]}
                      placeholder={t("inser-notes-here")}
                      multiline={true}
                      selectionColor="black"
                      underlineColorAndroid="transparent"
                      numberOfLines={5}
                      style={{
                        backgroundColor: "white",
                        borderWidth: 1,
                        textAlignVertical: "top",
                        textAlign: "right",
                        padding: 10,
                        height: 70,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <View
          style={{
            width: "50%",
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            marginRight: 95,
          }}
        >
          <View style={{ paddingRight: 10 }}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#442213" }}
            >
              ₪{meal.data.price * meal.others.count}
            </Text>
          </View>
          <Button
            text={isEdit ? t("save") : t("add-to-cart")}
            icon="cart_icon"
            fontSize={17}
            onClickFn={isEdit ? onUpdateCartProduct : onAddToCart}
            bgColor={themeStyle.PRIMARY_COLOR}
            textColor={"#442213"}
            fontFamily={`${getCurrentLang()}-SemiBold`}
            borderRadious={19}
          />
        </View>
      </View>
    </View>
  );
};
export default observer(MealScreen);

const styles = StyleSheet.create({
  gradiantRowContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingTop: 5,
    backgroundColor: themeStyle.WHITE_COLOR,
  },
  titleContainer: {
    alignSelf: "center",
  },
  sectionContainer: {
    backgroundColor: "white",
    marginTop: 25,
    shadowColor: "#F1F1F1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 0,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
