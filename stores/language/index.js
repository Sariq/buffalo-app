import { makeAutoObservable } from "mobx";
import i18n from "../../translations";

class LanguageStore {
  selectedLang = 'ar';
  fontFamily = 'ar-Bold'

  constructor() {
    makeAutoObservable(this);

  }


  changeLang = (lng) => {
    this.selectedLang = lng;
    i18n.locale = lng;
  };
}

export default LanguageStore;
