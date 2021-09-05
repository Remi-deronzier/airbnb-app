import React from "react";

import { COLORS } from "../assets/helpers/constants";

import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

export default function MyModal({
  text,
  modalVisible,
  setModalVisible,
  sucess,
  welcome,
}) {
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <AntDesign
                name="closesquareo"
                size={30}
                color={`${COLORS.pinkColor}`}
              />
            </TouchableOpacity>
          </View>
          {sucess && (
            <Image
              source={require("../assets/images/success-animation.gif")}
              resizeMode="contain"
              style={styles.image}
            />
          )}
          {welcome && (
            <Image
              source={require("../assets/images/welcome-image.png")}
              resizeMode="contain"
              style={styles.image}
            />
          )}
          <Text style={styles.modalText}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("window").width * 0.75,
    height: Dimensions.get("window").height / 2.5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: `${COLORS.pinkColor}`,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: `${COLORS.pinkColor}`,
  },
  closeButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: Dimensions.get("window").width * 0.75,
  },
});
