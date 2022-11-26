import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";

/* components */
import CategoryItemsList from "./components/categoryItemsList";
import Icon from "../../components/icon";

const MenuScreen = () => {
  const { menuStore } = useContext(StoreContext);

  const [categoryList, setCategoryList] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
  };

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
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View style={styles.container}>
        {Object.keys(categoryList).map((key, index) => (
          <TouchableOpacity
            style={[styles.categoryItem]}
            onPress={() => {
              onCategorySelect(categoryList[key]);
            }}
          >
            <View
              style={[
                styles.iconContainer,

                {
                  backgroundColor:
                    categoryList[key].id === selectedCategory?.id
                      ? themeStyle.PRIMARY_COLOR
                      : themeStyle.WHITE_COLOR,
                },
              ]}
            >
              <Icon
                icon={categoryList[key].icon}
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
                    categoryList[key].id === selectedCategory?.id
                      ? themeStyle.GRAY_700
                      : themeStyle.GRAY_300,
                },
              ]}
            >
              {key}
            </Text>
          </TouchableOpacity>
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
  itemsListConainer:{
    paddingBottom:130
  }
});
