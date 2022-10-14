import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import i18n from "../../translations";
import GradiantRow from "../../components/gradiant-row";
import Button from "../../components/controls/button/button";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../stores";
import {
  CONSTS_PRODUCT_EXTRAS,
  CONSTS_PRODUCT_VEGETABLES,
} from "../../consts/product-extras";
import { CONSTS_PRODUCTS } from "../../consts/products";
import { ScrollView } from "react-native-gesture-handler";

export default function MealScreen({ route }) {
  const { itemId, categoryId } = route.params;
  const navigation = useNavigation();

  const [meal, setMeal] = useState();
  let cartStore = useContext(StoreContext);

  useEffect(() => {
    const categoryProducts = CONSTS_PRODUCTS[categoryId];
    const product = categoryProducts.find((product) => product.id === itemId);
    product.extras = CONSTS_PRODUCT_EXTRAS;
    product.vegetables = CONSTS_PRODUCT_VEGETABLES;
    setMeal(product);
  }, []);

  const onAddToCart = () => {
    cartStore.addProductToCart(meal);
  };

  const onClose = () => {
    console.log("xx");
    navigation.goBack();
  };

  const onExtraChange = (value) => {};
  if (!meal) {
    return null;
  }
  return (
    <ScrollView>
      <View style={{ height: "100%", marginBottom: 40 }}>
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
              <Text style={{ fontSize: 25 }}>
                {i18n.t(`products.${meal.name}.name`)}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 15 }}>
                {i18n.t(`products.${meal.name}.description`)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.gradiantRowContainer}>
            <GradiantRow
              onChangeFn={onExtraChange}
              type={"counter"}
              title={"moreFromSame"}
              value={1}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          {Object.keys(meal.extras).map((key) => (
            <View style={styles.gradiantRowContainer}>
              <GradiantRow
                onChangeFn={onExtraChange}
                icon={meal.extras[key].icon}
                type={meal.extras[key].inputType}
                title={meal.extras[key].title}
                value={meal.extras[key].value}
              />
            </View>
          ))}
        </View>
        <View style={styles.sectionContainer}>
          {Object.keys(meal.vegetables).map((key) => (
            <View style={styles.gradiantRowContainer}>
              <GradiantRow
                onChangeFn={onExtraChange}
                icon={meal.vegetables[key].icon}
                type={meal.vegetables[key].inputType}
                title={meal.vegetables[key].title}
                value={meal.vegetables[key].value}
              />
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.gradiantRowContainer}>
            <GradiantRow
              onChangeFn={onExtraChange}
              type={"checkbox"}
              title={"slice"}
              value={1}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.gradiantRowContainer}>
            <View style={{ padding: 10 }}>
              <View>
                <Text style={{ textAlign: "left" }}>aa</Text>
              </View>
              <View>
                <TextInput
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

        <View style={styles.sectionContainer}>
          <View style={styles.buttonContainer}>
            <Button
              text="اضف للكيس"
              icon="cart_icon"
              fontSize={17}
              onClickFn={onAddToCart}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  gradiantRowContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonContainer: {
    alignSelf: "center",
    width: "50%",
    paddingVertical: 20,
  },
  titleContainer: {
    alignSelf: "center",
  },
  sectionContainer: {
    backgroundColor: "white",
    marginTop: 25,
  },
});
