import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import i18n from "../../../translations";

import themeStyle from "../../../styles/theme.style";
import { CONSTS_PRODUCTS } from "../../../consts/products";

const productsList = CONSTS_PRODUCTS;

export default function CategoryItemsList({ category }) {
  const navigation = useNavigation();

  const [selectedItem, setSelectedItem] = useState();

  const onItemSelect = (item) => {
    setSelectedItem(item);
    navigation.navigate("meal", { itemId: item.id, categoryId: category });
  };

  return (
    <View style={styles.container}>
      {productsList[category].map((item) => (
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => {
            onItemSelect(item);
          }}
        >
          <View style={[styles.iconContainer]}>
            <Image
              style={{ width: 131, height: 140, padding: 10 }}
              source={item.icon}
            />
          </View>
          <Text
            style={[
              {
                color: themeStyle.GRAY_700,
              },
            ]}
          >
            {i18n.t(`products.${item.name}.name`)}
          </Text>
          <Text
            style={[
              {
                color: themeStyle.GRAY_700,
              },
            ]}
          >
            ₪{item.price}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 10,
    // backgroundColor: "#FFFFFF",
  },
  categoryItem: {
    margin: 5,
    width: 165,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: themeStyle.WHITE_COLOR,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  square: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 4,
    height: 150,
    shadowColor: "black",
    width: 150,
  },
});
