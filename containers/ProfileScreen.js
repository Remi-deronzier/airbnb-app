import React, { useState, useEffect, useCallback } from "react";

import Header from "../components/Header";

import { COLORS } from "../assets/helpers/constants";

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
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [onSubmission, setOnSubmission] = useState(false);

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
        console.log(error.response.data);
      }
    };
    fetchData();
  }, []);

  const handleImagePicked = (pickerResult) => {
    if (!pickerResult.cancelled) {
      setImage(pickerResult.uri);
    }
  };

  const handleUpdate = useCallback(async (pickerResult) => {
    let uploadResponse;
    try {
      setUploading(true);
      if (!pickerResult.cancelled) {
        // Note:
        // Uncomment this if you want to experiment with local server
        //
        // if (Constants.isDevice) {
        //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
        // } else {
        //   apiUrl = `http://localhost:3000/upload`
        // }

        const uri = pickerResult.uri;

        // Pour isoler l'extension du fichier, afin de connaitre son type (jpg, png...)
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        // FormData() va nous servir à envoyer un fichier en body de la requête
        const formData = new FormData();

        // On ajoute à l'object formData une clé photo
        formData.append("picture", {
          uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`, // la clé type doit être obligatoirement précisée en React Native
        });

        // La requête pour envoyer l'image au serveur
        uploadResponse = await axios.put(
          // Ici, il faut envoyer l'id du user en query
          // id rentré en dur dans l'exemple, mais doit être dynamique dans votre code
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
        console.log(uploadResponse.data.photo[0].url);

        if (
          Array.isArray(uploadResponse.data.photo) === true &&
          uploadResponse.data.photo.length > 0
        ) {
          setImage(uploadResponse.data.photo[0].url);
        }
      }
    } catch (e) {
      // console.log({ uploadResponse });
      // console.log({ uploadResult });
      // console.log({ e });
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  });

  return (
    <View style={styles.container}>
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
                {data.account.avatar || image ? (
                  <Image
                    style={styles.avatar}
                    source={{
                      uri: image ? image : data.account.avatar.secure_url,
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
                setEmail(text);
              }}
              value={email}
              placeholder="email"
              style={styles.textInput}
              autoCapitalize="none"
            />
            <TextInput
              onChangeText={(text) => {
                setUsername(text);
              }}
              value={username}
              placeholder="username"
              style={styles.textInput}
            />
            <TextInput
              style={styles.textArea}
              onChangeText={(text) => {
                setDescription(text);
              }}
              value={description}
              placeholder="Describe yourself in a few words..."
              multiline={true}
              numberOfLines={10}
            />
            <Text style={styles.textError}>{errorMessage}</Text>
            {onSubmission && (
              <ActivityIndicator
                size="large"
                color={`${COLORS.pinkColor}`}
                style={styles.loader}
              />
            )}
            <TouchableOpacity
              // onPress={handleSubmit}
              style={styles.buttonSignin}
              disabled={onSubmission}
            >
              <Text style={[styles.text, styles.textButton]}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setToken(null, null)}
              style={[styles.buttonSignin, styles.buttonLogOut]}
              disabled={onSubmission}
            >
              <Text style={[styles.text, styles.textButton]}>Log out</Text>
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
  text: {
    color: "gray",
  },
  textButton: {
    fontSize: 20,
  },
  buttonSignin: {
    borderColor: `${COLORS.pinkColor}`,
    borderWidth: 3,
    height: 45,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginBottom: 20,
  },
  textError: {
    color: `${COLORS.pinkColor}`,
    marginBottom: 10,
  },
  loader: {
    marginBottom: 16,
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
