import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { SvgXml } from "react-native-svg";
import { CONSTS_ICONS } from "../../consts/consts-icons";
import themeStyle from "../../styles/theme.style";
import axios from "axios";

/* components */
import CategoryItemsList from "./components/categoryItemsList";
import Icon from "../../components/icon";

const categoryList = [
  {
    id: "meat",
    icon: "burger_icon",
    title: "برجر لحم",
  },
  {
    id: "crispy",
    icon: "crispy_icon",
    title: "كرسبي",
  },
  {
    id: "sides",
    icon: "box-icon",
    title: "سايدس",
  },
  {
    id: "drinks",
    icon: "drinks_icon",
    title: "سايدس",
  },
  {
    id: "deals",
    icon: "deals_icon",
    title: "حملات",
  },
];

export default function MenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  goForAxios = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        console.log("getting data from axios", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(()=>{
    goForAxios()
  })

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View style={styles.container}>
        {categoryList.map((category) => (
          <TouchableOpacity
            style={[styles.categoryItem]}
            onPress={() => {
              onCategorySelect(category);
            }}
          >
            <View
              style={[
                styles.iconContainer,

                {
                  backgroundColor:
                    category.id === selectedCategory.id
                      ? themeStyle.PRIMARY_COLOR
                      : themeStyle.WHITE_COLOR,
                },
              ]}
            >
              <Icon
                icon={category.icon}
                size={30}
                style={{
                  color:
                    category.id === selectedCategory.id
                      ? themeStyle.GRAY_700
                      : themeStyle.GRAY_300,
                }}
              />
            </View>
            <Text
              style={[
                {
                  marginTop: 10,
                  color:
                    category.id === selectedCategory.id
                      ? themeStyle.GRAY_700
                      : themeStyle.GRAY_300,
                },
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <CategoryItemsList category={selectedCategory.id} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    alignContent: "space-between",
    paddingHorizontal: 5,
    paddingTop: 20,
    width: "100%",
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRadius: 15,
    width: "100%",
    height: "100%",
  },
});
