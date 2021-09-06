import React from "react";

import { COLORS } from "../assets/helpers/constants";

import { Text, StyleSheet, View } from "react-native";

export default function FooterFlatList() {
  return (
    <View style={styles.container}>
      <Text style={styles.footer}>END</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: `${COLORS.pinkColor}`,
    marginBottom: 20,
    color: "#fff",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    fontSize: 20,
  },
  container: {
    alignItems: "center",
  },
});
