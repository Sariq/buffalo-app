import { makeAutoObservable } from "mobx";
import { CONSTS_MENU_API } from "../../consts/menu-api-mock";
import { groupBy } from "lodash";

class MenuStore {
  menu = null;
  categories = null;
  meals = null;

  constructor() {
    makeAutoObservable(this);
    this.getMenu();
  }
  getMealTags = (mealId) => {
    const mealTags = groupBy(this.meals[mealId], (x) => x.tag);
    return mealTags;
  }
  getMenu = () => {
    this.categories = groupBy(CONSTS_MENU_API.menu, (x) => x.category);
    this.meals = groupBy(CONSTS_MENU_API.menu_constants, (x) => x.menu_id);
  };
}

export default MenuStore;
