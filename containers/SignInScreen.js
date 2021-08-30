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

export default function SignUpScreen({ setToken, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRevealedPassword, setIsRevealedPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [onSubmission, setOnSubmission] = useState(false);

  const handleSubmit = async () => {
    try {
      if (email && password) {
        setErrorMessage("");
        setOnSubmission(true);
        const response = await axios.post(
          "https://airbnb-api-remi.herokuapp.com/user/login",
          {
            email,
            password,
          }
        );
        if (response.data.token) {
          setOnSubmission(false);
          setToken(response.data.token);
          alert(`Welcome back ${response.data.account.username}!`);
        }
      } else {
        setErrorMessage("All the fields must be filled in");
      }
    } catch (error) {
      setOnSubmission(false);
      if (error.response.data.message === "Unauthorized") {
        setErrorMessage("Wrong email or password");
      }
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          style={styles.logoAirbnb}
          source={require("../assets/images/airbnb-logo.png")}
          resizeMode="contain"
        />
        <Text style={[styles.titlePage, styles.text]}>Sign in</Text>
        <TextInput
          onChangeText={(text) => {
            setEmail(text);
          }}
          value={email}
          placeholder="email"
          style={styles.textInput}
          autoCapitalize="none"
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
          {isRevealedPassword ? (
            <Ionicons
              style={styles.iconEye}
              name="eye-outline"
              size={24}
              color="black"
              onPress={() => setIsRevealedPassword(!isRevealedPassword)}
            />
          ) : (
            <Ionicons
              name="eye-off-outline"
              size={24}
              color="black"
              onPress={() => setIsRevealedPassword(!isRevealedPassword)}
              style={styles.iconEye}
            />
          )}
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
          style={styles.buttonSignin}
          disabled={onSubmission}
        >
          <Text style={styles.text}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[styles.text, styles.textNoAccount]}>
            No account? Register
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  textNoAccount: {
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
