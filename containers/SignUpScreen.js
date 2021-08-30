import React, { useState } from "react";

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
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen({ setToken }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isRevealedPassword, setIsRevealedPassword] = useState(true);
  const [isRevealedConfirmedPassword, setIsRevealedConfirmedPassword] =
    useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [onSubmission, setOnSubmission] = useState(false);

  const handleSubmit = async () => {
    try {
      if (email && password && confirmedPassword && description) {
        if (password === confirmedPassword) {
          setErrorMessage("");
          setOnSubmission(true);
          const response = await axios.post(
            "https://airbnb-api-remi.herokuapp.com/user/signup",
            {
              email,
              username,
              description,
              password,
            }
          );
          if (response.data.token) {
            setOnSubmission(false);
            setToken(response.data.token);
            alert("Succesful registration !");
          }
        } else {
          setErrorMessage("Passwords must be the same");
        }
      } else {
        setErrorMessage("All the fields must be filled in");
      }
    } catch (error) {
      setOnSubmission(false);
      if (error.response.data.message === "The email is already taken") {
        setErrorMessage("This email already has an account");
      }
      if (error.response.data.message === "The username is already taken") {
        setErrorMessage("This username is already taken");
      }
    }
  };

  return (
    <KeyboardAwareScrollView>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          style={styles.logoAirbnb}
          source={require("../assets/images/airbnb-logo.png")}
          resizeMode="contain"
        />
        <Text style={[styles.titlePage, styles.text]}>Sign Up</Text>
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
        <View style={styles.viewPassWord}>
          <TextInput
            onChangeText={(text) => {
              setPassword(text);
            }}
            value={password}
            placeholder="password"
            style={styles.textInputPassword}
            secureTextEntry={isRevealedPassword}
          />
          <Ionicons
            style={styles.iconEye}
            name="eye-outline"
            size={24}
            color="black"
            onPress={() => setIsRevealedPassword(!isRevealedPassword)}
          />
        </View>
        <View style={styles.viewPassWord}>
          <TextInput
            onChangeText={(text) => {
              setConfirmedPassword(text);
            }}
            value={confirmedPassword}
            placeholder="confirm password"
            style={styles.textInputPassword}
            secureTextEntry={isRevealedConfirmedPassword}
          />
          <Ionicons
            style={styles.iconEye}
            name="eye-outline"
            size={24}
            color="black"
            onPress={() =>
              setIsRevealedConfirmedPassword(!isRevealedConfirmedPassword)
            }
          />
        </View>
        <Text style={styles.textError}>{errorMessage}</Text>
        {onSubmission && (
          <ActivityIndicator
            size="large"
            color={`${COLORS.pinkColor}`}
            style={styles.loader}
          />
        )}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.buttonSignup}
          disabled={onSubmission}
        >
          <Text style={styles.text}>Sign up</Text>
        </TouchableOpacity>
        <Text style={[styles.text, styles.textAlreadyAnAccount]}>
          Already an account? Sign in
        </Text>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: `${COLORS.pinkColor}`,
    borderBottomWidth: 1,
    width: "80%",
    marginBottom: 40,
  },
  textInputPassword: {
    borderBottomColor: `${COLORS.pinkColor}`,
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 40,
  },
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  textArea: {
    width: "80%",
    borderColor: `${COLORS.pinkColor}`,
    borderWidth: 2,
    height: 100,
    marginBottom: 40,
    paddingLeft: 10,
    paddingTop: 5,
    textAlignVertical: "top",
  },
  logoAirbnb: {
    height: 150,
    marginTop: 30,
    marginBottom: 30,
  },
  text: {
    color: "gray",
  },
  titlePage: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 30,
  },
  buttonSignup: {
    borderColor: `${COLORS.pinkColor}`,
    borderWidth: 3,
    height: 45,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginBottom: 20,
  },
  textAlreadyAnAccount: {
    marginBottom: 100,
  },
  textError: {
    color: `${COLORS.pinkColor}`,
    marginBottom: 10,
  },
  viewPassWord: {
    position: "relative",
    width: "80%",
  },
  iconEye: {
    position: "absolute",
    right: 0,
  },
  loader: {
    marginBottom: 16,
  },
});
