import React, { useState, useEffect } from "react";

import { COLORS } from "../assets/helpers/constants";

import { View, StyleSheet, ActivityIndicator } from "react-native";

import MapView from "react-native-maps";
import { Callout } from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export default function AroundMeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const askPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const obj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCoords(obj);
          const response = await axios.get(
            `https://airbnb-api-remi.herokuapp.com/rentals/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
          );
          setData(response.data);
          setData(response.data);
        } else {
          const response = await axios.get(
            `https://airbnb-api-remi.herokuapp.com/rentals`
          );
          setData(response.data.rooms);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    askPermission();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={`${COLORS.pinkColor}`}
          style={styles.containerLoader}
        />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coords.latitude || 48.856614,
              longitude: coords.longitude || 2.3522219,
              latitudeDelta: 0.2,
              longitudeDelta: 0.2,
            }}
            showsUserLocation={true}
          >
            {data.map((marker) => {
              return (
                <Marker
                  key={marker._id}
                  coordinate={{
                    latitude: marker.rental_gps_location[1],
                    longitude: marker.rental_gps_location[0],
                  }}
                  title={marker.rental_name}
                  description={marker.rental_description}
                >
                  <Callout
                    onPress={() =>
                      navigation.navigate("Room", { id: marker._id })
                    }
                  ></Callout>
                </Marker>
              );
            })}
          </MapView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
});
