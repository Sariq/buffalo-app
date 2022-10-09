import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { SvgXml } from "react-native-svg";
import { CONSTS_ICONS } from "../../../consts/consts-icons";
import themeStyle from "../../../styles/theme.style";

const categoryItemsList = {
  1: [
    {
      id: 1,
      title: "كلاسيك برجر",
      img: require("../../../assets/menu/burgers/classic_burger.png"),
      price: "34",
    },
    {
      id: 2,
      title: "2كلاسيك برجر",
      img: require("../../../assets/menu/burgers/classic_burger.png"),
      price: "34",
    },
    {
      id: 3,
      title: "3كلاسيك برجر",
      img: require("../../../assets/menu/burgers/classic_burger.png"),
      price: "34",
    },
    {
      id: 4,
      title: "4كلاسيك برجر",
      img: require("../../../assets/menu/burgers/classic_burger.png"),
      price: "34",
    },
  ],
};

export default function CategoryItemsList() {
  const [selectedCategory, setSelectedCategory] = useState(
    categoryItemsList[0]
  );

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      {categoryItemsList["1"].map((item) => (
        <TouchableOpacity
          style={[styles.categoryItem]}
          onPress={() => {
            onCategorySelect(item);
          }}
        >
          <View style={[styles.iconContainer]}>
            <Image source={item.img} />
          </View>
          <Text
            style={[
              {
                color: themeStyle.GRAY_700,
              },
            ]}
          >
            {item.title}
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
    flex: 1,
    padding: 10,
  },
  categoryItem: {
    margin: 5,
    width: 170,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: themeStyle.WHITE_COLOR,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
