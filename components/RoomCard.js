import React from "react";

import { COLORS } from "../assets/helpers/constants";
import { displayStars } from "../assets/helpers/helperFunctions";

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";

import { useNavigation } from "@react-navigation/core";

export default function RoomCard({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Room", { id: item._id })}
    >
      <ImageBackground
        source={{ uri: item.rental_image[0].secure_url }}
        style={styles.image}
      >
        <View style={styles.priceView}>
          <Text style={styles.textPrice}>{item.rental_price_one_night} €</Text>
        </View>
      </ImageBackground>
      <View style={styles.roomDetail}>
        <View style={styles.firstCall}>
          <Text style={styles.textTitle} numberOfLines={1}>
            {item.rental_name}
          </Text>
          <View style={styles.viewStarsAndReviews}>
            {displayStars(item.rental_rating_value)}
            <Text style={styles.textReview}>{item.rental_reviews} reviews</Text>
          </View>
        </View>
        <Image
          style={styles.avatar}
          source={{ uri: item.land_lord.account.avatar.secure_url }}
        />
      </View>
    </TouchableOpacity>
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
