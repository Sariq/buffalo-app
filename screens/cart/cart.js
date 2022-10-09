
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { Dimensions } from 'react-native';

import * as Location from 'expo-location';

export default function CartScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  if(!location){
      return null;
  }
  return (
    <View >
      <Text >{text}</Text>
      <MapView
                style={ styles.container }
                initialRegion={{
                    "latitude": location.coords.latitude,
                    "latitudeDelta": 0.01,
                    "longitude": location.coords.longitude,
                    "longitudeDelta": 0.01,
                }}
            >
                <MapView.Marker
                    title="YIKES, Inc."
                    description="Web Design and Development"
                    coordinate={{"latitude":location.coords.latitude,"longitude":location.coords.longitude}}
                />
            </MapView>
    </View>
  );
}
// MapScreen.navigationOptions = {
//     header: null
// }

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("window").width,
        height: 200,
    },
})
// import { StyleSheet, Text, View } from "react-native";

// export default function CartScreen() {
//   return (
//     <View >
//       <Text>CartScreen</Text>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   footerTabs: {
//     backgroundColor: "blue",
//     width: "100%",
//     position: "absolute",
//     bottom: 0,
//   },
// });

