import { makeAutoObservable } from "mobx";
// import i18n from "../../translations";
import i18n from "../../translations/i18n";

class LanguageStore {
  selectedLang = 'ar';
  fontFamily = 'ar-Bold'

  constructor() {
    makeAutoObservable(this);

  }


  changeLang = (lng) => {
    // @ts-ignore
    i18n.changeLanguage(lng);
    this.selectedLang = lng;
  };
}

export const languageStore = new LanguageStore();
