import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { SvgXml } from "react-native-svg";
import { CONSTS_ICONS } from "../../consts/consts-icons";
import themeStyle from "../../styles/theme.style";

/* components */
import CategoryItemsList from './components/categoryItemsList';

const categoryList = [
  {
    id: 1,
    icon: CONSTS_ICONS.burgersIcon,
    title: "برجر لحم",
  },
  {
    id: 2,
    icon: CONSTS_ICONS.crispyIcon,
    title: "كرسبي",
  },
  {
    id: 3,
    icon: CONSTS_ICONS.boxIcon,
    title: "سايدس",
  },
  {
    id: 4,
    icon: CONSTS_ICONS.drinksIcon,
    title: "سايدس",
  },
  {
    id: 5,
    icon: CONSTS_ICONS.dealsIcon,
    title: "حملات بافلو",
  },
];

export default function MenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View>
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
              <SvgXml
                xml={category.icon}
                style={[
                  {
                    color:
                      category.id === selectedCategory.id
                        ? themeStyle.GRAY_700
                        : themeStyle.GRAY_300,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                {
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
      <CategoryItemsList/>
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
    width: 100,
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
