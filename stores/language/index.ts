import { makeAutoObservable } from "mobx";
import i18n from "../../translations";

class LanguageStore {
  selectedLang = 'ar';
  fontFamily = 'ar-Bold'

  constructor() {
    makeAutoObservable(this);

  }


  changeLang = (lng) => {
    i18n.locale = lng;
    this.selectedLang = lng;
  };
}

export const languageStore = new LanguageStore();
