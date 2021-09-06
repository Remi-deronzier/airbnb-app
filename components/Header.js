import React from "react";

import { COLORS } from "../assets/helpers/constants";

import { View, StyleSheet, Image, SafeAreaView } from "react-native";

export default function Header() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../assets/images/airbnb-logo.png")}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: `${COLORS.grayColor}`,
    borderBottomWidth: 1,
  },
  image: {
    width: 50,
    height: 50,
  },
});
