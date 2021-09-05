import React, { useState, useEffect, useCallback } from "react";

import Header from "../components/Header";
import SubmissionButton from "../components/SubmissionButton";
import MyModal from "../components/MyModal";

import { COLORS } from "../assets/helpers/constants";
import { BUTTON } from "../assets/helpers/constants";

import {
  Text,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ id, setToken, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [email, setEmail] = useState("");
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [username, setUsername] = useState("");
  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  const [description, setDescription] = useState("");
  const [isDescriptionChanged, setIsDescriptionChanged] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://airbnb-api-remi.herokuapp.com/user/${id}`
        );
        setData(response.data);
        setEmail(response.data.email);
        setUsername(response.data.account.username);
        setDescription(response.data.account.description);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchData();
  }, []);

  const handleImagePicked = (pickerResult) => {
    if (!pickerResult.cancelled) {
      setPreviewImage(pickerResult.uri);
      setIsImageChanged(true);
    }
  };

  const handleUpdate = useCallback(async () => {
    let uploadImageResponse;
    let isUpadateSuccessful = true;
    try {
      setUploading(true);
      setErrorMessage("");
      if (isImageChanged) {
        // Enter in the condition only if the user has changed his image whether using the gallery or the camera
        const uriParts = previewImage.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const formData = new FormData();
        formData.append("picture", {
          uri: previewImage,
          name: "picture",
          type: `prevpreviewImage/${fileType}`,
        });
        uploadImageResponse = await axios.put(
          `https://airbnb-api-remi.herokuapp.com/user/upload-picture/${id}`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + token,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      const data = {};
      // Many conditions to prevent to make useless updates when no fields have been changed by the user since last upload to the server
      if (isEmailChanged) {
        // only if the user update his email
        data.email = email;
      }
      if (isUsernameChanged) {
        // only if the user update his username
        data.username = username;
      }
      if (isDescriptionChanged) {
        // only if the user update his description
        data.description = description;
      }
      const responseUpdateOtherFields = await axios.put(
        "https://airbnb-api-remi.herokuapp.com/user/update",
        data,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      // update all change checkers for email, description and username according to user modifications
      setIsEmailChanged(email !== responseUpdateOtherFields.data.email);
      setIsUsernameChanged(
        username !== responseUpdateOtherFields.data.account.username
      );
      setIsDescriptionChanged(
        description !== responseUpdateOtherFields.data.account.description
      );
    } catch (error) {
      if (
        error.response.data.message === "Missing parameters" &&
        !isImageChanged
      ) {
        isUpadateSuccessful = false;
        setErrorMessage("You must modify at least one field or your avatar");
      }
      if (
        error.response.data.message === "Username already exists" &&
        !isImageChanged
      ) {
        isUpadateSuccessful = false;
        setErrorMessage("Username already exists");
      }
      if (
        error.response.data.message === "Email already exists" &&
        !isImageChanged
      ) {
        isUpadateSuccessful = false;
        setErrorMessage("Email already exists");
      }
    } finally {
      if (isUpadateSuccessful) {
        setShowModal(true);
      }
      setUploading(false);
      setIsImageChanged(false);
    }
  });

  return (
    <View style={styles.container}>
      <MyModal
        text="Successful update 🎉"
        modalVisible={showModal}
        setModalVisible={setShowModal}
        sucess={true}
        welcome={false}
      />
      <Header />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={`${COLORS.pinkColor}`}
          style={styles.containerLoader}
        />
      ) : (
        <KeyboardAwareScrollView>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.pictureSection}>
              <View style={styles.avatarView}>
                {data.account.avatar || previewImage ? (
                  <Image
                    style={styles.avatar}
                    source={{
                      uri: previewImage
                        ? previewImage
                        : data.account.avatar.secure_url,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Avatar
                    rounded
                    title={data.account.username[0]} // take the inital
                    size={150}
                    overlayContainerStyle={{
                      backgroundColor: `${COLORS.grayColor}`,
                    }}
                  />
                )}
                <View style={styles.avatarBorder}></View>
              </View>
              <View style={styles.iconPictures}>
                <MaterialIcons
                  name="insert-photo"
                  size={30}
                  color="gray"
                  onPress={async () => {
                    const cameraRollPerm =
                      await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (cameraRollPerm.status === "granted") {
                      const pickerResult =
                        await ImagePicker.launchImageLibraryAsync({
                          allowsEditing: true,
                          aspect: [4, 3],
                        });
                      handleImagePicked(pickerResult);
                    }
                  }}
                />
                <MaterialIcons
                  name="photo-camera"
                  size={30}
                  color="gray"
                  onPress={async () => {
                    const cameraPerm =
                      await ImagePicker.requestCameraPermissionsAsync();
                    const cameraRollPerm =
                      await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (
                      cameraPerm.status === "granted" &&
                      cameraRollPerm.status === "granted"
                    ) {
                      const pickerResult = await ImagePicker.launchCameraAsync({
                        allowsEditing: true,
                        aspect: [4, 3],
                      });
                      handleImagePicked(pickerResult);
                    }
                  }}
                />
              </View>
            </View>
            <TextInput
              onChangeText={(text) => {
                setIsEmailChanged(true);
                setEmail(text);
              }}
              value={email}
              placeholder="email"
              style={styles.textInput}
              autoCapitalize="none"
            />
            <TextInput
              onChangeText={(text) => {
                setIsUsernameChanged(true);
                setUsername(text);
              }}
              value={username}
              placeholder="username"
              style={styles.textInput}
            />
            <TextInput
              style={styles.textArea}
              onChangeText={(text) => {
                setIsDescriptionChanged(true);
                setDescription(text);
              }}
              value={description}
              placeholder="Describe yourself in a few words..."
              multiline={true}
              numberOfLines={10}
            />
            <Text style={styles.textError}>{errorMessage}</Text>
            <SubmissionButton
              uploading={uploading}
              handleUpdate={handleUpdate}
              text="Update"
            />
            <TouchableOpacity
              onPress={() => setToken(null, null, null)}
              style={[BUTTON.button, styles.buttonLogOut]}
            >
              <Text style={BUTTON.text}>Log out</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAwareScrollView>
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
  textInput: {
    borderBottomColor: `${COLORS.pinkColor}`,
    borderBottomWidth: 1,
    width: "80%",
    marginBottom: 40,
  },
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
  avatar: {
    height: "100%",
    width: "100%",
    borderRadius: 1000,
  },
  avatarView: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  avatarBorder: {
    borderRadius: 1000,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: `${COLORS.pinkColor}`,
  },
  pictureSection: {
    height: 150,
    width: 150,
    marginTop: 30,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  iconPictures: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    justifyContent: "space-between",
  },
  textError: {
    color: `${COLORS.pinkColor}`,
    marginBottom: 10,
  },
  containerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textArea: {
    width: "80%",
    borderColor: `${COLORS.pinkColor}`,
    borderWidth: 1,
    height: 100,
    marginBottom: 40,
    paddingLeft: 10,
    paddingTop: 5,
    textAlignVertical: "top",
  },
  buttonLogOut: {
    backgroundColor: "#e7e5e5",
  },
});
