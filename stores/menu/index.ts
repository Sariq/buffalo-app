import { makeAutoObservable, runInAction } from "mobx";
import { groupBy } from "lodash";
import { MENU_API } from "../../consts/api";
import { fromBase64 } from '../../helpers/convert-base64'
import { axiosInstance } from "../../utils/http-interceptor";
import i18n from "../../translations/index-x";
import { setTranslations, getCurrentLang } from "../../translations/i18n";
import { orderBy } from "lodash";

class MenuStore {
  menu = null;
  categories = null;
  meals = null;
  dictionary = null;

  constructor() {
    makeAutoObservable(this);
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
   return new Promise((resolve)=>{
      this.getMenuFromServer().then((res) => {
        runInAction(() => {
  
          this.dictionary = res.dictionary;
          setTranslations(this.dictionary).then(()=>{
            this.categories = groupBy(res.menu, (x) => x.category);
            this.meals = groupBy(res.menu_constants, (x) => x.menu_id);
            Object.keys(this.meals).map((key) => {
              const extras = this.getMealTags(key);
              this.meals[key].extras = extras;
              this.mainMealTags(key, extras);
              this.meals[key].data = res.menu.find((product) => product.id.toString() === key)
            });
            resolve(true)
          })
     
        });
      })
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
    const sortedExtrasType = orderBy(extrasType, ["constant_order_priority"], ["asc"]);
    this.meals[key].extras[type] = sortedExtrasType;
    this.meals[key].extras["orderList"]= this.meals[key].extras["orderList"] || {};
    if(this.meals[key].extras[type][0].available_on_app){
      this.meals[key].extras["orderList"][type] = this.meals[key].extras[type][0].order_priority;
    }
    this.meals[key] = { ...this.meals[key], extras: this.meals[key].extras };
  };

  mainMealTags = (mealKey, mealTags) => {
    Object.keys(mealTags).map((key) => {

      mealTags[key].map((tag) => {
        this.initMealsTags(tag, key, mealKey);
      });
    });
  }

  translate = (id: string) => {
    const item = this.dictionary.find((item)=> item.id === id )
    if(getCurrentLang() === "ar"){
      return item.name_ar;
    }
    return item.name_he;
  }
}

export const menuStore = new MenuStore();
