import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
  ActivityIndicator, // <-- add this import
} from "react-native";
import { WebView } from "react-native-webview";
import Text from "../controls/Text";
import Button from "../controls/button/button";
import Icon from "../icon";
import themeStyle from "../../styles/theme.style";
import { useTranslation } from "react-i18next";
import { StoreContext } from "../../stores";
import { getCurrentLang } from "../../translations/i18n";
import {
  getCreditCardPaymentPage,
  getCreditCards,
  isCustomerHasSavedCreditCard,
  deleteCreditCard,
  TCreditCard,
} from "./api/credit-card-controller";
import BackButton from "../back-button";

export type TNewCreditCardProps = {
  isOpen: boolean;
  onClose: () => void;
  onCardSaved: (card?: TCreditCard) => void;
};

const NewCreditCard: React.FC<TNewCreditCardProps> = ({
  isOpen,
  onClose,
  onCardSaved,
}) => {
  const { t } = useTranslation();
  const { languageStore } = useContext(StoreContext);
  const [paymentPageUrl, setPaymentPageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedCards, setSavedCards] = useState<TCreditCard[]>([]);
  const [hasSavedCards, setHasSavedCards] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [isCardsLoading, setIsCardsLoading] = useState(false);

  // Get app language code (1 for Hebrew, 2 for Arabic, etc.)
  const getAppLanguageCode = () => {
    const lang = getCurrentLang();
    switch (lang) {
      case "he":
        return 0;
      case "ar":
        return 1;
      default:
        return 1; // Default to Hebrew
    }
  };

  // Load saved credit cards
  const loadSavedCards = async () => {
    setIsCardsLoading(true);
    try {
      const hasCardsResponse = await isCustomerHasSavedCreditCard();
      console.log("hasCardsResponse", hasCardsResponse);
      if (true) {
        setHasSavedCards(true);
        const cardsResponse = await getCreditCards();
        console.log("cardsResponse", cardsResponse);
        if (!cardsResponse.has_err) {
          setSavedCards(cardsResponse.cards);
        }
      } else {
        setSavedCards([]);
        setHasSavedCards(false);
      }
    } catch (error) {
      setSavedCards([]);
      setHasSavedCards(false);
      console.error("Error loading saved cards:", error);
    } finally {
      setIsCardsLoading(false);
    }
  };

  // Get payment page URL
  const getPaymentPage = async () => {
    setIsLoading(true);
    try {
      const response = await getCreditCardPaymentPage(getAppLanguageCode());
      if (!response.has_err && response.url) {
        setPaymentPageUrl(response.url);
        setShowPaymentPage(true);
      } else {
        Alert.alert(t("error"), t("failed-to-load-payment-page"));
      }
    } catch (error) {
      console.error("Error getting payment page:", error);
      Alert.alert(t("error"), t("failed-to-load-payment-page"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle WebView navigation state changes
  const handleWebViewNavigationStateChange = async (navState: any) => {
    // Check if the URL contains success/error indicators
    const url = navState.url;
    console.log("url", url);
    // You might need to adjust these URLs based on your payment provider's redirect URLs
    if (url.includes("success") || url.includes("payment-success")) {
      setShowPaymentPage(false);
      await loadSavedCards(); // Ensure cards are reloaded after add
      onCardSaved(); // This will trigger the cart to reload cards
      onClose();
    } else if (url.includes("error") || url.includes("payment-error")) {
      setShowPaymentPage(false);
      Alert.alert("خطأ", "فشل في إضافة البطاقة");
    }
  };

  // Handle card selection
  const handleCardSelect = (card: TCreditCard) => {
    onCardSaved(card); // Pass the selected card
    onClose();
  };

  // Delete a credit card
  const handleDeleteCard = async (cardId: number) => {
    Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذه البطاقة؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await deleteCreditCard(cardId);
            if (!response.has_err) {
              await loadSavedCards();
              // If no cards left, notify parent
              if (savedCards.length === 1) { // because state updates after
                onCardSaved(undefined);
              }
            } else {
              Alert.alert("خطأ", "فشل في حذف البطاقة");
              await loadSavedCards();
            }
          } catch (error) {
            console.error("Error deleting card:", error);
            Alert.alert("خطأ", "فشل في حذف البطاقة");
            await loadSavedCards();
          }
        },
      },
    ]);
  };

  // Open payment page in external browser
  const openPaymentPageInBrowser = () => {
    if (paymentPageUrl) {
      Linking.openURL(paymentPageUrl);
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log("NewCreditCard opened, resetting to cards list view");
      setShowPaymentPage(false);
      setPaymentPageUrl(null);
      loadSavedCards();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  console.log(
    "NewCreditCard rendering - showPaymentPage:",
    showPaymentPage,
    "paymentPageUrl:",
    paymentPageUrl
  );
  return (
    <Modal
      visible={isOpen}
      presentationStyle="overFullScreen"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          {showPaymentPage && paymentPageUrl ? (
            <View style={styles.webViewContainer}>
              {/* WebView Header with Close Button */}
              <View style={styles.webViewHeader}>
                <View style={styles.webViewPlaceholder} />
                <View style={{ marginRight: 10 }}>
                  <BackButton isClose={true} onClose={() => {
                    setShowPaymentPage(false);
                    setPaymentPageUrl(null);
                  }} />
                </View>
                <Text style={styles.webViewTitle}>
                  {t("add-new-credit-card")}
                </Text>
             
              </View>
                  <View style={{padding: 15,flex: 1}} >
              <WebView
                source={{ uri: paymentPageUrl }}
                style={styles.webView}
                onNavigationStateChange={handleWebViewNavigationStateChange}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <View style={{ marginRight: 10 }}>
                  <BackButton isClose={true} onClose={onClose} />
                </View>
                <Text style={styles.headerTitle}>
                  بطاقات الإئتمان الخاصة بي
                </Text>
              </View>

              {/* Add New Card Button */}
              {isLoading ? (
                <View style={[styles.addCardButton, { justifyContent: 'center', alignItems: 'center', height: 50 }]}> 
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addCardButton}
                  onPress={getPaymentPage}
                >
                  <View style={styles.addCardContent}>
                    <View style={styles.addCardRight}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon
                          icon="credit_card_icom"
                          size={24}
                          style={{ marginRight: 10 }}
                        />
                        <Text style={{ fontSize: 16, fontFamily: "ar-SemiBold" }}>
                          إضافة بطاقة ائتمات جديدة
                        </Text>
                      </View>
                    </View>
                    <View style={styles.addCardLeft}>
                      <View style={styles.plusIcon}>
                        <Text style={styles.plusText}>+</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}

              {/* Saved Cards Section */}
              {isCardsLoading ? (
                <Text style={{ textAlign: "center", marginVertical: 20 }}>
                  جاري تحميل البطاقات...
                </Text>
              ) : hasSavedCards && savedCards.length > 0 ? (
                <View style={styles.savedCardsSection}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.sectionTitle}>
                      اختيار بطاقة محفوظة مسبقاً
                    </Text>
                  </View>
                  {savedCards.map((card) => (
                    <TouchableOpacity
                      key={card.id}
                      style={styles.cardItem}
                      onPress={() => handleCardSelect(card)}
                    >
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card.id);
                        }}
                        style={styles.deleteButton}
                      >
                        <Icon icon="delete" size={20} color="red" />
                      </TouchableOpacity>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardMask}>{card.cardMask}</Text>
                        <Text style={styles.cardExp}>
                          {card.cardExp && card.cardExp.length === 4
                            ? `${card.cardExp.slice(0, 2)}/${card.cardExp.slice(
                                2
                              )}`
                            : card.cardExp}
                        </Text>
                      </View>
                      {/* <View style={styles.cardType}>
                        <Text style={styles.visaText}>VISA</Text>
                      </View> */}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noCardsSection}>
                  <Text style={styles.sectionTitle}>لا توجد بطاقات محفوظة</Text>
                  <Text style={styles.sectionSubtitle}>
                    اضغط على الزر أعلاه لإضافة بطاقة جديدة
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Move height/width here so they're in scope for styles
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    height: height * 0.6,
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 30,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: themeStyle.PRIMARY_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "ar-Bold",
    color: themeStyle.BROWN_700,
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: themeStyle.GRAY_100,
    alignItems: "center",
    justifyContent: "center",
  },
  addCardButton: {
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 15,
    padding: 10,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addCardLeft: {
    flex: 1,
    alignItems: "flex-end",
  },
  plusIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addCardCenter: {},
  addCardText: {
    fontSize: 16,
    fontFamily: "ar-SemiBold",
    color: "white",
  },
  addCardRight: {
    marginLeft: 15,
  },
  savedCardsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "ar-SemiBold",
    color: themeStyle.BROWN_700,
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "ar-Regular",
    color: themeStyle.GRAY_600,
    marginBottom: 10,
  },
  cardItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  deleteButton: {
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 10,
  },
  cardMask: {
    fontSize: 16,
    fontFamily: "ar-SemiBold",
    color: themeStyle.BROWN_700,
    marginBottom: 5,
  },
  cardExp: {
    fontSize: 14,
    fontFamily: "ar-Regular",
  },
  cardType: {
    marginLeft: 15,
  },
  visaText: {
    fontSize: 14,
    fontFamily: "ar-Bold",
    color: "#1A1F71", // VISA blue color
  },
  closeButton: {
    backgroundColor: themeStyle.GRAY_300,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: "auto",
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: "ar-SemiBold",
    color: themeStyle.BROWN_700,
  },
  webViewContainer: {
    flex: 1,
    padding: 0,
  },
  webViewHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  webViewCloseButton: {
    padding: 5,
  },
  webViewTitle: {
    fontSize: 20,
    fontFamily: "ar-Bold",
    color: themeStyle.BROWN_700,
    textAlign: "center",
  },
  webViewPlaceholder: {},
  webView: {
    flex: 1,
  },
  noCardsSection: {
    marginBottom: 30,
    alignItems: "center",
    paddingVertical: 20,
  },
});

export default NewCreditCard;
