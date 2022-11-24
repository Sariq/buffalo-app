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
      (item) => item.data.id !== productId
    );
    this.updateLocalStorage();
  };

  updateProductCount = (productId, count) => {
    console.log(count)
    this.cartItems = this.cartItems.map((item) => {
      if(item.data.id === productId){
        item.others.count =count
      }
      return item;
    });
    this.updateLocalStorage();
  }

  getProductsCount = () => {
    let count = 0; 
    this.cartItems.forEach((product)=>{
      count += product.others.count;
    })
    return count;
  }
}

export default CartStore;
