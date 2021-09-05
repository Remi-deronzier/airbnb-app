import React, { useState, useEffect } from "react";

import Header from "../components/Header";

import { COLORS } from "../assets/helpers/constants";
import { displayStars } from "../assets/helpers/helperFunctions";

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import axios from "axios";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import MapView from "react-native-maps";
import { ScrollView } from "react-native-gesture-handler";

export default function RoomScreen({ route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [isRevealedDescription, setIsRevealedDescription] = useState(false);

  const id = route.params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://airbnb-api-remi.herokuapp.com/rental/${id}`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={`${COLORS.pinkColor}`}
            style={styles.containerLoader}
          />
        ) : (
          <>
            <View style={styles.caroussel}>
              <SwiperFlatList
                autoplay={true}
                autoplayDelay={5}
                autoplayLoop={true}
                data={data.rental_image}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.secure_url }}
                    style={styles.image}
                  />
                )}
              />
              <View style={styles.priceView}>
                <Text style={styles.textPrice}>
                  {data.rental_price_one_night} €
                </Text>
              </View>
            </View>
            <View style={styles.roomDetail}>
              <View style={styles.firstCall}>
                <View style={styles.rateAndTitle}>
                  <Text style={styles.textTitle} numberOfLines={1}>
                    {data.rental_name}
                  </Text>
                  <View style={styles.viewStarsAndReviews}>
                    {displayStars(data.rental_rating_value)}
                    <Text style={styles.textReview}>
                      {data.rental_reviews} reviews
                    </Text>
                  </View>
                </View>
                <Image
                  style={styles.avatar}
                  source={{ uri: data.land_lord.account.avatar.secure_url }}
                />
              </View>
              <View>
                <Text numberOfLines={!isRevealedDescription ? 3 : null}>
                  {data.rental_description}
                </Text>
              </View>
              {!isRevealedDescription ? (
                <TouchableOpacity
                  style={styles.buttonHideAndShow}
                  onPress={() => setIsRevealedDescription(true)}
                >
                  <Text style={styles.textShowAndHide}>Show More</Text>
                  <MaterialIcons
                    name="expand-more"
                    size={24}
                    color={`${COLORS.grayColor}`}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.buttonHideAndShow}
                  onPress={() => setIsRevealedDescription(false)}
                >
                  <Text style={styles.textShowAndHide}>Show less</Text>
                  <MaterialIcons
                    name="expand-less"
                    size={24}
                    color={`${COLORS.grayColor}`}
                  />
                </TouchableOpacity>
              )}
            </View>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: data.rental_gps_location[1],
                longitude: data.rental_gps_location[0],
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showsUserLocation={true}
            >
              <MapView.Marker
                key={data._id}
                coordinate={{
                  latitude: data.rental_gps_location[1],
                  longitude: data.rental_gps_location[0],
                }}
                title={data.rental_name}
                description={data.rental_description}
              />
            </MapView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  image: {
    justifyContent: "flex-end",
    width,
    height: 300,
    marginBottom: 10,
  },
  priceView: {
    height: 50,
    width: 100,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 10,
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
    justifyContent: "space-between",
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 10,
  },
  firstCall: {
    marginBottom: 30,
    flexDirection: "row",
  },
  rateAndTitle: {
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
  buttonHideAndShow: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  textShowAndHide: {
    color: `${COLORS.grayColor}`,
  },
  caroussel: {
    position: "relative",
  },
  containerLoader: {
    backgroundColor: "#fff",
    marginTop: Dimensions.get("window").height / 2,
    transform: [
      {
        translateY: -100,
      },
    ],
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
  },
});
