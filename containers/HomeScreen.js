import React, { useState, useEffect, useRef } from "react";

import RoomCard from "../components/RoomCard";
import Header from "../components/Header";
import MyModal from "../components/MyModal";
import FooterFlatList from "../components/FooterFlatList";

import { FlatList, View, StyleSheet } from "react-native";

import axios from "axios";
import Constants from "expo-constants";
import LottieView from "lottie-react-native";

export default function HomeScreen({
  username,
  welcomeModalVisible,
  welcomeBackModalVisible,
  setWelcomeModalVisible,
  setWelcomeBackModalVisible,
}) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const animation = useRef(null);

  const fetchData = async () => {
    try {
      if (animation.current) {
        animation.current.play();
      }
      const response = await axios.get(
        "https://airbnb-api-remi.herokuapp.com/rentals"
      );
      setData(response.data);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <MyModal
        text={`Welcome ${username} 👋`}
        modalVisible={welcomeModalVisible}
        setModalVisible={setWelcomeModalVisible}
        sucess={false}
        welcome={true}
      />
      <MyModal
        text={`Welcome back ${username} 👋`}
        modalVisible={welcomeBackModalVisible}
        setModalVisible={setWelcomeBackModalVisible}
        sucess={false}
        welcome={true}
      />
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
          data={data.rooms}
          keyExtractor={(item) => String(item._id)}
          renderItem={({ item }) => <RoomCard item={item} />}
          ListFooterComponent={<FooterFlatList />}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
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
