import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
// import axios from "axios";
// import { BASE_URL } from "@/config";
import { images } from "@/constants";
import React, { useState } from "react";
// import { FormStateSignUp } from "@/types";
import { Link, router } from "expo-router";
// import FormField from "@/components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";

const signup = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
    role: "",
  });

  const submit = async () => {
    console.log(form);
    // if (!form.username || !form.email || !form.password) {
    //   Alert.alert("Error", "Please fill all the fields");
    //   return;
    // }
    // setIsSubmitting(true);
    // try {
    //   await axios.post(`${BASE_URL}/register/`, form);
    //   router.replace("/signin");
    // } catch (error: any) {
    //   if (error.response && error.response.data) {
    //     const errorData = error.response.data;
    //     let messages = [];
    //     if (typeof errorData === "object") {
    //       for (const key in errorData) {
    //         if (Array.isArray(errorData[key])) {
    //           errorData[key].forEach((msg) => {
    //             messages.push(`${key}: ${msg}`);
    //           });
    //         } else {
    //           messages.push(`${key}: ${errorData[key]}`);
    //         }
    //       }
    //     } else {
    //       messages.push("Something went wrong. Please try again.");
    //     }
    //     Alert.alert("Error", messages.join("\n"));
    //   } else {
    //     Alert.alert("Error", "Something went wrong. Please try again.");
    //   }
    //   console.log(error);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <SafeAreaView className="h-full w-full bg-white items-center justify-center">
      <ScrollView className="w-full h-full px-4">
        <View className="flex-1 justify-center items-center">
          <Image
            source={images.signin_signup}
            className="w-72 h-52"
            resizeMode="contain"
          />
        </View>
        <Text className="text-2xl text-center font-psemibold text-[#7a6a6a]">
          Sign up to <Text className="text-[#09bff1]">JobNest</Text>
        </Text>
        <View className="flex-1 items-start justify-start gap-1 mt-2">
          <Text className="font-psemibold text-base">Role:</Text>
          <View className="border border-indigo-500 rounded-md w-full h-12 justify-center">
            <Picker
              selectedValue={form.role}
              onValueChange={(itemValue) =>
                setForm({ ...form, role: itemValue })
              }
              style={{ height: 48 }} // Native style needed here
              dropdownIconColor="#6366F1" // optional, for Indigo color
            >
              <Picker.Item label="Select your role" value="" />
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Recruiter" value="recruiter" />
              <Picker.Item label="HR" value="hr" />
            </Picker>
          </View>
        </View>
        <View className="flex-1 items-start justify-start gap-1 mt-3">
          <Text className="font-psemibold text-base">Name:</Text>
          <TextInput
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            placeholder="Enter your name"
            className="p-2 w-full h-12 border border-indigo-500 rounded-md"
          />
        </View>
        <View className="flex-1 items-start justify-start gap-1 mt-3">
          <Text className="font-psemibold text-base">Email:</Text>
          <TextInput
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            placeholder="Enter email"
            className="p-2 w-full h-12 border border-indigo-500 rounded-md"
          />
        </View>
        <View className="flex-1 items-start justify-start gap-1 mt-3">
          <Text className="font-psemibold text-base">Password:</Text>
          <TextInput
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            placeholder="Enter password"
            secureTextEntry={true}
            className="p-2 w-full h-12 border border-indigo-500 rounded-md"
          />
        </View>
        <View className="flex-1 items-start justify-start gap-1 mt-3">
          <Text className="font-psemibold text-base">MobileNo.:</Text>
          <TextInput
            value={form.mobileNo}
            onChangeText={(text) => setForm({ ...form, mobileNo: text })}
            keyboardType="numeric"
            placeholder="Enter mobile no."
            className="p-2 w-full h-12 border border-indigo-500 rounded-md"
          />
        </View>
        <TouchableOpacity
          onPress={submit}
          className="w-full bg-purple-400 mt-6 rounded-lg justify-center items-center p-2"
        >
          {isSubmitting ? (
            <ActivityIndicator size="large" />
          ) : (
            <Text className={`text-white text-center font-psemibold text-lg`}>
              Submit
            </Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center pt-5 gap-2">
          <Text className="text-lg text-gray-600 font-pregular">
            Already have an account?
          </Text>
          <Link
            href="/signin"
            className="text-lg text-purple-400 font-psemibold text-secondary"
          >
            Sign in
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signup;
