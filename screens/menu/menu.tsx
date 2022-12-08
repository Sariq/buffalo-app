import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";
//import base64 from "react-native-base64";

/* components */
import CategoryItemsList from "./components/categoryItemsList";
import Icon from "../../components/icon";
import { Buffer } from "buffer";

export function toBase64(input) {
  return Buffer.from(input, "utf-8").toString("base64");
}

export function fromBase64(encoded) {
  return Buffer.from(encoded, "base64").toString("utf8");
}

const categoryListIcons = {
  "BURGERS": 'burger_icon',
  'CHICKEN': 'crispy_icon'
}



const MenuScreen = () => {
  const { menuStore } = useContext(StoreContext);

  const [categoryList, setCategoryList] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("BURGERS");

  const onCategorySelect = (category, key) => {
    setSelectedCategory(category);
    setSelectedCategoryKey(key);
  };
  // const Buffer = require("buffer").Buffer;
  // let encodedAuth = new Buffer("سشسيشسي").toString("base64");
 ;
  const getMenu = () => {
    const categories = menuStore.categories;
    setCategoryList(categories);
    setSelectedCategory(categories["BURGERS"]);

    //   axios
    //     .get("https://jsonplaceholder.typicode.com/users")
    //     .then((response) => {
    //       console.log("getting data from axios", response.data);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
  };

  useEffect(() => {
    getMenu();
  }, []);

  if (!categoryList || !selectedCategory) {
    return null;
  }

  return (
    <View style={{ height: "100%", backgroundColor: "#F1F1F1" }}>
      <View style={styles.container}>
        {Object.keys(categoryList).map((key, index) => (
          <View style={{width: 80, height: 96}}>
          <TouchableOpacity
            style={[styles.categoryItem]}
            onPress={() => {
              onCategorySelect(categoryList[key], key);
            }}
          >
            <View
              style={[
                styles.iconContainer,

                {
                  backgroundColor:
                  key === selectedCategoryKey
                  ? themeStyle.PRIMARY_COLOR
                      : themeStyle.WHITE_COLOR,
                },
              ]}
            >
               <Icon
                icon={categoryListIcons[key]}
                size={30}
                style={{
                  color:
                    categoryList[key].id === selectedCategory?.id
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
                    key === selectedCategoryKey
                      ? themeStyle.GRAY_700
                      : themeStyle.GRAY_300,
                },
              ]}
            >
              {key}
            </Text>
          </TouchableOpacity>
          </View>
        ))}
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
    paddingBottom: 10,
    width: "100%",
    backgroundColor: "#F1F1F1",
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
    paddingBottom: 130,
  },
});
