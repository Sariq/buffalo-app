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

import i18n from "../../translations";
import GradiantRow from "../../components/gradiant-row";
import Button from "../../components/controls/button/button";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../stores";
import { ScrollView } from "react-native-gesture-handler";
import themeStyle from "../../styles/theme.style";

const MealScreen = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();
  let { cartStore, menuStore } = useContext(StoreContext);

  const [meal, setMeal] = useState();
  useEffect(() => {
    //const product = menuStore.meals[item];
    const product = menuStore.getMealByKey(item);
    product.others = { count: 1, note: "" };
    setMeal(product);
  }, []);

  const onAddToCart = () => {
    cartStore.addProductToCart(meal);
    navigation.goBack();
  };

  const onClose = () => {
    navigation.goBack();
  };

  const updateMeal = (value, tag, type) => {
    let extraPrice = 0;
    if (tag.type === "CHOICE" && !tag.multiple_choice) {
      const extrasType = meal.extras[type].map((tagItem) => {
        if (tagItem.id === tag.id) {
          tagItem = {...tagItem, value:true};
        } else {
          tagItem = {...tagItem, value:false};
        }
        return tagItem;
      });
      meal.extras[type] = extrasType;
      setMeal({ ...meal, data: {...meal.data, price: 10}, extras: meal.extras });
    } else {
      const extrasType = meal.extras[type].map((tagItem) => {
        if (tagItem.id === tag.id) {
          if(tag.type === "COUNTER"){

            extraPrice =  value > tagItem.value ? extraPrice + tagItem.price : extraPrice - tagItem.price;
          }else{
            extraPrice =  value ? extraPrice + tagItem.price : extraPrice - tagItem.price;
          }
          tagItem.value = value;
        }
        return tagItem;
      });

      meal.extras[type] = extrasType;
      setMeal({ ...meal, data: {...meal.data, price: meal.data.price + extraPrice}, extras: meal.extras });
    }
  };

  const updateOthers = (value, key, type) => {
    setMeal({ ...meal, [type]: { ...meal[type], [key]: value } });
  };

  if (!meal) {
    return null;
  }

  return (
    <View style={{ height: "100%", marginBottom: 40 }}>
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
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
            <Image style={{ width: 300, height: 255 }} source={meal.icon} />
          </View>
          <View
            style={{
              backgroundColor: "white",
              marginTop: 0,
              alignSelf: "flex-start",
              paddingHorizontal: 50,
              top: -40,
            }}
          >
            <View>
              <Text style={{ fontSize: 25 }}>{meal.data.name}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 15 }}>{meal.data.name}</Text>
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
        {
          Object.keys(meal.extras).map((key) => (
            <View style={styles.sectionContainer}>
              <View style={styles.gradiantRowContainer}>
                <Text>{key}</Text>
                {Object.keys(meal.extras[key]).map((tagId) => {
                  const tag = meal.extras[key][tagId];
                  return (
                    <>
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
                    </>
                  );
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
            text="اضف للكيس"
            icon="cart_icon"
            fontSize={17}
            onClickFn={onAddToCart}
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
  },
});
