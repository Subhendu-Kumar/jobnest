import {
  View,
  Text,
  Image,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "@/config";
import { images } from "@/constants";
import { SignUpSchema } from "@/types";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

const signup = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<SignUpSchema>({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
    role: "APPLICANT",
  });

  const submit = async () => {
    console.log(form);
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.mobileNo ||
      !form.role
    ) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/api/v1/users/signup`, form);
      router.replace("/signin");
    } catch (error: any) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
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
              style={{ height: 48 }}
              dropdownIconColor="#6366F1"
            >
              <Picker.Item label="Applicant" value="APPLICANT" />
              <Picker.Item label="Employer" value="EMPLOYER" />
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
          disabled={isSubmitting}
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
