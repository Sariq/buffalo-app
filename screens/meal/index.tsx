import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import { isEmpty } from "lodash";

import i18n from "../../translations";
import GradiantRow from "../../components/gradiant-row";
import Button from "../../components/controls/button/button";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../stores";
import { ScrollView } from "react-native-gesture-handler";
import themeStyle from "../../styles/theme.style";

const MealScreen = ({ route }) => {
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
    cartStore.addProductToCart(meal);
    navigation.goBack();
  };

  const onUpdateCartProduct = () => {
    cartStore.updateCartProduct(index, meal);
    navigation.goBack();
  };

  const onClose = () => {
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
              const tagDeltaPrice = tagItem.price - currentTag.price;
              extraPrice = extraPrice + tagDeltaPrice;
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

    meal.extras[type] = extrasType;
    setMeal({
      ...meal,
      data: { ...meal.data, price: meal.data.price + extraPrice },
      extras: meal.extras,
    });
  };

  const updateOthers = (value, key, type) => {
    if (key === "count") {
      const updatedPrice =
        meal.data.price +
        (value - meal.others.count) * (meal.data.price / meal.others.count);
      setMeal({
        ...meal,
        [type]: { ...meal[type], [key]: value },
        data: { ...meal.data, price: updatedPrice },
      });
    } else {
      setMeal({ ...meal, [type]: { ...meal[type], [key]: value } });
    }
  };

  if (!meal) {
    return null;
  }

  return (
    <View
      style={{ height: "100%", marginBottom: 40, backgroundColor: "white" }}
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
            <TouchableOpacity style={{ zIndex: 1, width: "83%" }}>
              <Text
                onPress={onClose}
                style={{
                  zIndex: 1,
                  position: "absolute",
                  left: 0,
                  width: "100%",
                  fontSize: 25,
                }}
              >
                X
              </Text>
            </TouchableOpacity>
            <View style={{ width: 300, height: 220, padding: 20 }}>
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{ uri: meal.data.image_url }}
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
              <Text style={{ fontSize: 25, textAlign: "left" }}>
                {meal.data[`name_${languageStore.selectedLang}`]}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 15, textAlign: "left" }}>
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
              title={"moreFromSame"}
              value={meal["others"]["count"]}
            />
          </View>
        </View>
        {meal.extras &&
          Object.keys(meal.extras).map((key) => (
            <View key={key} style={[styles.sectionContainer, styles.boxShadow]}>
              <View style={styles.gradiantRowContainer}>
                {Object.keys(meal.extras[key]).map((tagId) => {
                  const tag = meal.extras[key][tagId];
                  if (tag.available_on_app) {
                    return (
                      <View key={tagId}>
                        <GradiantRow
                          onChangeFn={(value) => {
                            updateMeal(value, tag, key);
                          }}
                          //  icon={CONSTS_PRODUCT_EXTRAS[key].icon}
                          type={tag.type}
                          title={tag.name}
                          price={tag.price}
                          minValue={tag.counter_min_value}
                          stepValue={tag.counter_step_value}
                          value={tag.value}
                        />
                      </View>
                    );
                  }
                })}
              </View>
            </View>
          ))}

        <View style={styles.sectionContainer}>
          <View style={styles.gradiantRowContainer}>
            <View style={{ padding: 10 }}>
              <View>
                <Text style={{ textAlign: "left" }}>ملاحظات للمطعم</Text>
              </View>
              <View>
                <TextInput
                  onChange={(e) => {
                    updateOthers(e.nativeEvent.text, "note", "others");
                  }}
                  multiline={true}
                  selectionColor="black"
                  underlineColorAndroid="transparent"
                  numberOfLines={3}
                  style={{
                    marginTop: 10,
                    backgroundColor: "white",
                    borderWidth: 1,
                    textAlignVertical: "top",
                    textAlign: "right",
                    padding: 10,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View
          style={{
            width: "50%",
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ paddingRight: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              ₪{meal.data.price}
            </Text>
          </View>
          <Button
            text={isEdit ? "update" : "اضف للكيس"}
            icon="cart_icon"
            fontSize={17}
            onClickFn={isEdit ? onUpdateCartProduct : onAddToCart}
            bgColor={themeStyle.BROWN_700}
            textColor={themeStyle.PRIMARY_COLOR}
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
    paddingVertical: 20,
    backgroundColor: themeStyle.PRIMARY_COLOR,
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
});
