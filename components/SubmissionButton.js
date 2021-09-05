import React from "react";

import { COLORS } from "../assets/helpers/constants";
import { BUTTON } from "../assets/helpers/constants";

import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function SubmissionButton({ uploading, handleUpdate, text }) {
  return (
    <View style={styles.containerLoaderSubmission}>
      {uploading && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.loaderSubmission}
        />
      )}
      <TouchableOpacity
        onPress={handleUpdate}
        style={
          !uploading
            ? [BUTTON.button, styles.buttonNotUploading]
            : [BUTTON.button, styles.buttonUploading]
        }
        disabled={uploading}
      >
        {!uploading && <Text style={BUTTON.text}>{text}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonNotUploading: {
    backgroundColor: "#fff",
  },
  buttonUploading: {
    backgroundColor: `${COLORS.pinkColor}`,
  },
  loaderSubmission: {
    marginBottom: 20,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
  },
  containerLoaderSubmission: {
    position: "relative",
  },
});
