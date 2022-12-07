import { makeAutoObservable, runInAction } from "mobx";
import { groupBy } from "lodash";
import { MENU_API } from "../../consts/api";
import { fromBase64 } from '../../helpers/convert-base64'
import { axiosInstance } from "../../utils/http-interceptor";

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
  getMenuFromServer = () => {
    const body = {};
    return axiosInstance
      .post(
        `${MENU_API.CONTROLLER}/${MENU_API.GET_MENU_API}`,
        body,
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        return res;
      });
  }
  getMenu = () => {
    this.getMenuFromServer().then((res) => {
      runInAction(() => {
        this.categories = groupBy(res.menu, (x) => x.category);
        this.meals = groupBy(res.menu_constants, (x) => x.menu_id);
        Object.keys(this.meals).map((key) => {
          const extras = this.getMealTags(key);
          this.meals[key].extras = extras;
          this.mainMealTags(key, extras);
          this.meals[key].data = res.menu.find((product) => product.id.toString() === key)
        });
      });
    })


  };

  getMealByKey = (key) => {
    let temp = {};
    if (this.meals[key]) {
      temp = JSON.parse(JSON.stringify(this.meals[key]));
    }
    return temp;
  }

  initMealsTags = (tag, type, key) => {
    const extrasType = this.meals[key].extras[type].map((tagItem) => {
      if (tagItem.id === tag.id) {
        if (tag.type === "CHOICE") {
          tagItem.value = tag.isdefault
        } else {
          tagItem.value = tag.counter_init_value
        }
      }
      return tagItem;
    })
    this.meals[key].extras[type] = extrasType;
    this.meals[key] = { ...this.meals[key], extras: this.meals[key].extras };
  };

  mainMealTags = (mealKey, mealTags) => {
    Object.keys(mealTags).map((key) => {

      mealTags[key].map((tag) => {
        this.initMealsTags(tag, key, mealKey);
      });
    });
  }
}

export const menuStore = new MenuStore();
