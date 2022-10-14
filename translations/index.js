import * as Localization from "expo-localization";
import arLang from "./languages/ar.json";
import { I18n } from "i18n-js";

// Set the key-value pairs for the different languages you want to support.
const translations = {
    ar: arLang,
    ja: { welcome: "こんにちは" },
  };
  const i18n = new I18n(translations);
  // Set the locale once at the beginning of your app.
  i18n.locale = 'ar';
  
  // When a value is missing from a language it'll fallback to another language with the key present.
  i18n.enableFallback = true;
  // To see the fallback mechanism uncomment line below to force app to use Japanese language.
  // i18n.locale = 'ja';
  
export default i18n;