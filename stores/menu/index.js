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

    Object.keys(this.meals).map((key) => {
      const extras = this.getMealTags(key);
      this.meals[key].extras = extras;
      this.mainMealTags(key, extras);
      this.meals[key].data = CONSTS_MENU_API.menu.find((product)=> product.id == key)
     });
  };

  getMealByKey = (key) => {
    const temp = JSON.parse(JSON.stringify(this.meals[key]))//{...this.meals[key]}
    return temp;
  }

  initMealsTags = (value, tag, type, key) => {
    tag.value = value;
    if (tag.type === "CHOICE" && !tag.multiple_choice) {
      const extrasType = this.meals[key].extras[type].map((tagItem)=>{
        if(tagItem.id === tag.id){
          tagItem.value = value
        }else{
          tagItem.value = !value
        }
        return tagItem;
      })
      this.meals[key].extras[type] = extrasType;
      this.meals[key] = {...this.meals[key], extras:this.meals[key].extras };
    }else{
      const extrasType = this.meals[key].extras[type].map((tagItem)=>{
        if(tagItem.id === tag.id){
          tagItem.value = value
        }
        return tagItem;
      })
      this.meals[key].extras[type] = extrasType;
      this.meals[key] = {...this.meals[key], extras:this.meals[key].extras };
      
    }
  };

  mainMealTags = (mealKey, mealTags) =>{
    Object.keys(mealTags).map((key) => {

      if (mealTags[key][0].type === "CHOICE") {
        if (!mealTags[key][0].multiple_choice) {
          mealTags[key].map((tag) => {
            if (tag.isdefault) {
              this.initMealsTags(tag.isdefault, tag, key, mealKey);
            }
          });
        }
      }

      if (mealTags[key][0].type === "COUNTER") {
        mealTags[key].map((tag) => {
          this.initMealsTags(tag.counter_init_value, tag, key, mealKey);
        });
      }

    });
  }
}

export default MenuStore;
