import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Heading from "../components/Heading";
import TextBlock from "../components/TextBlock";
import ReusableButton from "../components/ReusableButton";
import InputField from "../components/InputField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/CustomAlert";
import InformationIcon from "../assets/information_icon.png"

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const handleInputChange = (field, value) => {
    console.log(`Field: ${field}, Value: ${value}`); // Debug log
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = async () => {
    console.log("Form Data at submission:", formData); // Debug log
    const { firstName, lastName, email } = formData;

    if (!firstName || !lastName || !email) {
      setAlertConfig({
        icon: InformationIcon,
        title: "Error",
        message: "All fields are required.",
        onContinue: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
      console.log("Generated OTP:", generatedOtp); // Debug log
      await AsyncStorage.setItem(
        "signupData",
        JSON.stringify({ ...formData, otp: generatedOtp })
      );

      setAlertConfig({
        icon: InformationIcon,
        title: "OTP Verification",
        message: `Your OTP code has been sent to your email. Your Otp code is ${generatedOtp}.`,
        onContinue: () => {
          setAlertVisible(false);
          navigation.navigate("OTPVerification", { email });
        },
      });
      setAlertVisible(true);
    } catch (error) {
      console.error("Error saving data:", error);
      setAlertConfig({
        icon: "⚠️",
        title: "Error",
        message: "Failed to save data. Please try again.",
        onContinue: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    }
  };

  return (
    <LinearGradient
      colors={["#5885AF", "#5885AF"]}
      style={styles.background}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#616161" />
        </TouchableOpacity>
        <Heading
          navigation={navigation}
          heading="Enter your Personal Information"
        />
        <TextBlock text="Please enter your valid information for account creation." />
        <InputField
          label="First Name"
          placeholder="Enter your First Name"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange("firstName", value)}
        />
        <InputField
          label="Last Name"
          placeholder="Enter your Last Name"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange("lastName", value)}
        />
        <InputField
          label="Email"
          placeholder="Enter your Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        <View style={{ height: 20 }}></View>
        <ReusableButton text="Next" onPress={handleNext} />
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.signupText}>
            Already have an account?{" "}
            <Text style={styles.signupLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}></View>

        {/* Custom Alert */}
        <CustomAlert
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          {...alertConfig}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "flex-end",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  signupText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 40,
  },
  signupLink: {
    color: "#274472",
    fontWeight: "600",
  },
});

export default SignUpScreen;