import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";
import { LinearGradient } from "expo-linear-gradient";

/* components */
import CategoryItemsList from "./components/categoryItemsList";
import Icon from "../../components/icon";
import { Buffer } from "buffer";
import i18n from "../../translations/index-x";
import { getCurrentLang } from "../../translations/i18n";
import { useTranslation } from "react-i18next";

export function toBase64(input) {
  return Buffer.from(input, "utf-8").toString("base64");
}

export function fromBase64(encoded) {
  return Buffer.from(encoded, "base64").toString("utf8");
}

const categoryListIcons = {
  BURGERS: "burger_icon",
  CHICKEN: "crispy_icon",
  SIDES: "box-icon",
  DRINK: "drinks_icon",
  SALADS: "salad-icon"
};
const categoryListOrder = {
  1: "BURGERS",
  2: "CHICKEN",
  3: "SIDES",
  4: "DRINK",
  5: "SALADS",
};

const MenuScreen = () => {
  const { t } = useTranslation();
  const { menuStore, languageStore } = useContext(StoreContext);

  useEffect(() => {}, [languageStore]);

  const [categoryList, setCategoryList] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("BURGERS");

  const onCategorySelect = (category, key) => {
    setSelectedCategory(category);
    setSelectedCategoryKey(key);
  };

  const getMenu = () => {
    const categories = menuStore.categories;
    console.log("CCCATT", categories);
    setCategoryList(categories);
    setSelectedCategory(categories["BURGERS"]);
  };

  useEffect(() => {
    getMenu();
  }, []);

  if (!categoryList || !selectedCategory) {
    return null;
  }
  return (
    <View style={{ height: "100%" }}>
      <LinearGradient
        colors={["white", "#F9F9F9", "#FCFCFC", "#FCFCFC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.1 }}
        style={styles.background}
      />
      <View style={styles.container}>
        <ScrollView
          style={{ height: "100%", width: "100%" }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {Object.keys(categoryListOrder).map((key, index) => (
            <View style={{ width: 85, height: 96, flexBasis: 90 }}>
              <TouchableOpacity
                style={[styles.categoryItem]}
                onPress={() => {
                  onCategorySelect(
                    categoryList[categoryListOrder[key]],
                    categoryListOrder[key]
                  );
                }}
              >
                <View
                  style={[
                    styles.iconContainer,

                    {
                      backgroundColor:
                        categoryListOrder[key] === selectedCategoryKey
                          ? themeStyle.PRIMARY_COLOR
                          : themeStyle.WHITE_COLOR,
                    },
                  ]}
                >
                  <Icon
                    icon={categoryListIcons[categoryListOrder[key]]}
                    size={38}
                    style={{
                      color:
                        categoryListOrder[key] === selectedCategoryKey
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
                        categoryListOrder[key] === selectedCategoryKey
                          ? themeStyle.GRAY_700
                          : themeStyle.GRAY_300,
                      fontFamily: `${getCurrentLang()}-SemiBold`,
                    },
                  ]}
                >
                  {t(categoryListOrder[key])}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.itemsListConainer}>
        <CategoryItemsList productsList={selectedCategory} />
      </View>
    </View>
  );
};

export default observer(MenuScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    alignContent: "space-between",
    paddingHorizontal: 5,
    paddingTop: 20,
    width: "100%",
    // backgroundColor: "#F1F1F1",
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
  itemsListConainer: {
    paddingBottom: 120,
    marginTop: 10,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
