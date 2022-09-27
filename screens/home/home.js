import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { CONSTS_ICONS } from "../../consts/consts-icons";
import themeStyle from "../../styles/theme.style";

/* styles */
import theme from '../../styles/theme.style';

export default function HomeScreen({ navigation }) {
  const goToNewOrder = () => {
    navigation.navigate("menuScreen");
  };
  return (
    <View >
      <ImageBackground source={require('../../assets/burj.png')} resizeMode="cover" style={styles.image}>
      <View style={styles.container}>

        <TouchableOpacity onPress={goToNewOrder} style={[styles.button, styles.bottomView]}>
        <SvgXml
              xml={CONSTS_ICONS.newOrderIcon}
              style={[
                {
                  color: true
                    ? themeStyle.GRAY_700
                    : themeStyle.GRAY_300,
                },
              ]}
            />
          <Text style={styles.buttonText}>طلبية جديدة</Text>
        </TouchableOpacity>
        </View>

      </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

  },
  bottomView: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    marginBottom:30
  },
  buttonText: {
    fontSize: 20,
    color: "black",
    paddingRight: 15,
    paddingTop: 5
  },
  image: {
    height: "100%",
  },
});
