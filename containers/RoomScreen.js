import React, { useState, useEffect, useRef } from "react";

import RoomCard from "../components/RoomCard";
import { COLORS } from "../assets/helpers/constants";

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";

import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function RoomScreen({ route }) {
  const id = route.params.id;
  console.log(id);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // animation.current.play();
        const response = await axios.get(
          `https://airbnb-api-remi.herokuapp.com/rental/${id}`
        );
        setData(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();
  }, []);
  //   console.log(data);

  const displayStars = (ratingValue) => {
    const numberOfFullStars =
      ratingValue - Math.floor(ratingValue) >= 0.25 &&
      ratingValue - Math.floor(ratingValue) <= 0.75
        ? Math.floor(ratingValue)
        : Math.round(ratingValue);
    const numberOfHalfStars =
      ratingValue - Math.floor(ratingValue) >= 0.25 &&
      ratingValue - Math.floor(ratingValue) <= 0.75
        ? 1
        : 0;
    const tab = [];
    for (let i = 0; i < numberOfFullStars; i++) {
      tab.push(
        <Ionicons name="star-sharp" size={24} color="#eba834" key={i} />
      );
    }
    for (let i = 0; i < numberOfHalfStars; i++) {
      tab.push(
        <Ionicons
          name="star-half-sharp"
          size={24}
          color="#eba834"
          key={i + 10}
        />
      );
    }
    return tab;
  };

  //   const animation = useRef(null);

  return (
    <View>
      <ImageBackground
        source={{ uri: data.rental_image[0].secure_url }}
        style={styles.image}
      >
        <View style={styles.priceView}>
          <Text style={styles.textPrice}>{data.rental_price_one_night} €</Text>
        </View>
      </ImageBackground>
      <View style={styles.roomDetail}>
        <View style={styles.firstCall}>
          <Text style={styles.textTitle} numberOfLines={1}>
            {data.rental_name}
          </Text>
          <View style={styles.viewStarsAndReviews}>
            {displayStars(data.rental_rating_value)}
            <Text style={styles.textReview}>{data.rental_reviews} reviews</Text>
          </View>
        </View>
        <Image
          style={styles.avatar}
          source={{ uri: data.land_lord.account.avatar.secure_url }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 250,
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  priceView: {
    height: 50,
    width: 100,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  textPrice: {
    color: "#fff",
    fontSize: 20,
  },
  textTitle: {
    fontSize: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  roomDetail: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: `${COLORS.grayColor}`,
    borderBottomWidth: 1,
  },
  firstCall: {
    width: "70%",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  textReview: {
    color: `${COLORS.grayColor}`,
    marginLeft: 10,
  },
  viewStarsAndReviews: {
    flexDirection: "row",
    alignItems: "center",
  },
});
