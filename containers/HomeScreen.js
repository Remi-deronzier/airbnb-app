import React, { useState, useEffect, useRef } from "react";

import RoomCard from "../components/RoomCard";
import Header from "../components/Header";

import { FlatList, View, StyleSheet } from "react-native";

import axios from "axios";
import Constants from "expo-constants";
import LottieView from "lottie-react-native";

export default function HomeScreen() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const animation = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        animation.current.play();
        const response = await axios.get(
          "https://airbnb-api-remi.herokuapp.com/rentals"
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      {isLoading ? (
        <View style={styles.animationContainer}>
          <LottieView
            ref={animation}
            style={styles.animation}
            source={require("../assets/homeLoader.json")}
          />
        </View>
      ) : (
        <FlatList
          style={styles.containerFlatList}
          data={data.rooms}
          keyExtractor={(item) => String(item._id)}
          renderItem={({ item }) => <RoomCard item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  containerFlatList: {
    padding: 20,
  },
  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  animation: {
    width: 400,
    height: 400,
  },
});
