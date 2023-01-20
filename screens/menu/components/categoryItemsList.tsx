import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../../stores";
import i18n from "../../../translations/index-x";
import { ScrollView } from "react-native-gesture-handler";

import themeStyle from "../../../styles/theme.style";
import { getCurrentLang } from "../../../translations/i18n";

// const productsList = CONSTS_PRODUCTS;

const CategoryItemsList = ({ productsList }) => {
  const navigation = useNavigation();
  const scrollRef = useRef();

  const { languageStore } = useContext(StoreContext);

  const [selectedItem, setSelectedItem] = useState();
  const onItemSelect = (item) => {
    setSelectedItem(item);
    navigation.navigate("meal", { product: item });
  };

  useEffect(() => {
    // @ts-ignore
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [productsList]);
  return (
    <ScrollView ref={scrollRef}>
      <View style={styles.container}>
        {productsList.map((item) => {
          if (item.out_of_stock) {
            return null;
          }
          return (
            <TouchableOpacity
              style={styles.categoryItem}
              delayPressIn={0}
              onPress={() => {
                onItemSelect(item);
              }}
              key={item.id}
            >
              <View style={[styles.iconContainer]}>
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: item.image_url }}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  color: themeStyle.GRAY_700,
                  marginTop: 20,
                  fontSize: 18,
                  fontFamily: `${getCurrentLang()}-SemiBold`,
                }}
              >
                {item[`name_${languageStore.selectedLang}`]}
                {/* {i18n.t(`products.${item.name}.name`)} */}
              </Text>
              <Text
                style={[
                  {
                    color: themeStyle.GRAY_700,
                    marginTop: 8,
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 18,
                  },
                ]}
              >
                ₪{item.price}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    // backgroundColor:"#F1F1F1",
  },
  categoryItem: {
    flexBasis: "48%",
    marginBottom: 15,

    height: 220,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: themeStyle.WHITE_COLOR,
    paddingVertical: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: 10,
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
