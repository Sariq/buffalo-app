import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";

class CartStore {
  cartItems = [];

  isEnabled = false;

  constructor() {
    makeAutoObservable(this);

    this.getDefaultValue();
  }
  getDefaultValue = async () => {
    const jsonValue = await AsyncStorage.getItem("@storage_cartItems");
    const value = jsonValue != null ? JSON.parse(jsonValue) : [];
    this.setDefaultValue(value);
  };

  setDefaultValue = (value) => {
    this.cartItems = value;
  };

  updateLocalStorage = async () => {
    try {
      const jsonValue = JSON.stringify(this.cartItems);
      await AsyncStorage.setItem("@storage_cartItems", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  addProductToCart = (product) => {
    this.cartItems.push(product);
    this.updateLocalStorage();
  };

  removeProduct = (productId) => {
    this.cartItems = this.cartItems.filter(
      (item, index) => item.id + index !== productId
    );
    this.updateLocalStorage();
  };

  // get selectedItem() {
  //   return this.cartItems
  //     .filter((item) => item.isChecked)
  //     .map((item) => item.id);
  // }

  // toggleMode = () => {
  //   for (let i = 0; i < this.cartItems.length; i++) {
  //     this.cartItems[i].isModeEnabled = !this.cartItems[i].isModeEnabled;
  //   }
  // };

  // toggleEmployee = ({ id }) => {
  //   const index = this.cartItems.findIndex((item) => item.id == id);
  //   const { isChecked } = this.cartItems[index];

  //   this.cartItems[index].isChecked = !isChecked;
  // };

  // logSelected = () => {
  //   alert(this.cartItems.filter((i) => i.isChecked).map((i) => i.id).length);
  // };

  // toggleAll = () => {
  //   const isChecked = !this.selectedItem.length > 0;

  //   for (let i = 0; i < this.cartItems.length; i++) {
  //     this.cartItems[i].isChecked = isChecked;
  //   }
  // };
}

export default CartStore;
