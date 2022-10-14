import { observer } from "mobx-react";
import { makeAutoObservable, observable, action, computed } from "mobx";

class CartStore {
  cartItems = []
  isEnabled = false;

  constructor() {
    makeAutoObservable(this)
  }

  addProductToCart = (product) => {
    this.cartItems.push(product)
  }

  get selectedItem() {
    return this.cartItems
      .filter(item => item.isChecked)
      .map(item => item.id);
  }

  toggleMode = () => {
    for (let i = 0; i < this.cartItems.length; i++) {
      this.cartItems[i].isModeEnabled = !this.cartItems[i].isModeEnabled;
    }
  }

  toggleEmployee = ({ id }) => {
    const index = this.cartItems.findIndex(item => item.id == id);
    const { isChecked } = this.cartItems[index];

    this.cartItems[index].isChecked = !isChecked;
  };

  logSelected = () => {
    alert(this.cartItems.filter(i => i.isChecked).map(i => i.id).length);
  };

  toggleAll = () => {
    const isChecked = !this.selectedItem.length > 0;

    for (let i = 0; i < this.cartItems.length; i++) {
      this.cartItems[i].isChecked = isChecked;
    }
  };
}

export default CartStore;