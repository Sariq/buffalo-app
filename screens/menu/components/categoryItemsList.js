import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../../stores";
import i18n from "../../../translations";
import { ScrollView } from "react-native-gesture-handler";

import themeStyle from "../../../styles/theme.style";
import { CONSTS_PRODUCTS } from "../../../consts/products";

// const productsList = CONSTS_PRODUCTS;

const CategoryItemsList = ({ productsList }) => {
  const navigation = useNavigation();

  const [selectedItem, setSelectedItem] = useState();

  const onItemSelect = (item) => {
    setSelectedItem(item);
    navigation.navigate("meal", { product: item });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {productsList.map((item) => (
          <View
            style={styles.categoryItem}
            onTouchEnd={() => {
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
              {item.name}
              {/* {i18n.t(`products.${item.name}.name`)} */}
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
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
export default observer(CategoryItemsList);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  categoryItem: {
    flexBasis: '47%',
    marginBottom:15,
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
