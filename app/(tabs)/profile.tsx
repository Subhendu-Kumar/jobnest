import React from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/provider";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";

const profile = () => {
  const { user, logout } = useAuth();
  const initial = user?.name ? user?.name.charAt(0) : "?";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          logout();
          Alert.alert("Logged out", "You have been logged out successfully.");
          router.replace("/signin");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="w-full h-full bg-white">
      <ScrollView className="w-full">
        <View className="w-full items-center pt-8 pb-6">
          <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-4">
            <Text className="text-4xl font-semibold text-white">{initial}</Text>
          </View>
          <Text className="text-2xl font-bold">{user?.name}</Text>
        </View>
        <View className="px-4 py-2">
          <Text className="text-base text-gray-500 mb-1">
            Personal Information
          </Text>
          <View className="bg-gray-100 rounded-lg p-4 mb-3">
            <Text className="text-sm text-gray-500 mb-1">Full Name</Text>
            <Text className="text-base">{user?.name}</Text>
          </View>
          <View className="bg-gray-100 rounded-lg p-4 mb-3">
            <Text className="text-sm text-gray-500 mb-1">Email</Text>
            <Text className="text-base">{user?.email}</Text>
          </View>
          <View className="bg-gray-100 rounded-lg p-4 mb-6">
            <Text className="text-sm text-gray-500 mb-1">Mobile</Text>
            <Text className="text-base">+91 {user?.mobileNo}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-pink-500 py-3 rounded-lg items-center"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold">Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
