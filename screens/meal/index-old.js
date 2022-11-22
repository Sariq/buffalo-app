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
import themeStyle from "../../styles/theme.style";

export default function MealScreen({ route }) {
  const { itemId, categoryId } = route.params;
  const navigation = useNavigation();

  const [meal, setMeal] = useState();
  let cartStore = useContext(StoreContext).cartStore;

  useEffect(() => {
    const categoryProducts = CONSTS_PRODUCTS[categoryId];
    const product = categoryProducts.find((product) => product.id === itemId);
    // product.extras = CONSTS_PRODUCT_EXTRAS;
    // product.vegetables = CONSTS_PRODUCT_VEGETABLES;
    product.extras = {};
    product.vegetables = {};
    product.others = { count: 1 };
    setMeal(product);
  }, []);

  const onAddToCart = () => {
    cartStore.addProductToCart(meal);
    navigation.goBack();
  };

  const onClose = () => {
    navigation.goBack();
  };

  const onExtraChange = (value, key, type) => {
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
              onChangeFn={(value) => {
                onExtraChange(value, "count", "others");
              }}
              type={"counter"}
              title={"moreFromSame"}
              value={meal["others"]["count"]}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          {Object.keys(CONSTS_PRODUCT_EXTRAS).map((key) => (
            <View style={styles.gradiantRowContainer}>
              <GradiantRow
                onChangeFn={(value) => {
                  onExtraChange(value, key, "extras");
                }}
                icon={CONSTS_PRODUCT_EXTRAS[key].icon}
                type={CONSTS_PRODUCT_EXTRAS[key].inputType}
                title={CONSTS_PRODUCT_EXTRAS[key].title}
                value={meal["extras"][key]}
              />
            </View>
          ))}
        </View>
        <View style={styles.sectionContainer}>
          {Object.keys(CONSTS_PRODUCT_VEGETABLES).map((key) => (
            <View style={styles.gradiantRowContainer}>
              <GradiantRow
                onChangeFn={(value) => {
                  onExtraChange(value, key, "vegetables");
                }}
                icon={CONSTS_PRODUCT_VEGETABLES[key].icon}
                type={CONSTS_PRODUCT_VEGETABLES[key].inputType}
                title={CONSTS_PRODUCT_VEGETABLES[key].title}
                value={meal["vegetables"][key]}
              />
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.gradiantRowContainer}>
            <GradiantRow
              onChangeFn={(value) => {
                onExtraChange(value, "splice", "others");
              }}
              type={"checkbox"}
              title={"slice"}
              value={meal["others"]["splice"]}
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
      </ScrollView>
      <View style={styles.buttonContainer}>
      
        <View style={{ width: "50%", alignSelf: "center", flexDirection:"row", alignItems: "center" }}>
        <View style={{paddingRight:10}}>
              <Text style={{fontSize:20, fontWeight: "bold"}}>₪{meal.price}</Text>
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
}
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
