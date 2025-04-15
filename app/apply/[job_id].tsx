import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import API from "@/api";
import * as DocumentPicker from "expo-document-picker";

const JobApplyPage = () => {
  const { job_id, jobTitle, company, postedAt, description } =
    useLocalSearchParams();

  const [message, setMessage] = useState<string>("");
  const [cv, setCv] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickResume = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
      });
      if (res.canceled) {
        return Alert.alert("No file selected");
      }
      const file = res.assets[0];
      if (!file) {
        return Alert.alert("No resume selected");
      }
      setCv(file);
      Alert.alert("Resume selected", file.name);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim() || !cv) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("cvFile", {
        uri: cv.uri,
        name: cv.name,
        type: "application/pdf",
      } as any);
      const response = await API.post(
        `/applications/${job_id}/apply?message=${message}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        setCv(null);
        setMessage("");
        Alert.alert(
          "Application Submitted",
          "Your application has been successfully submitted.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to submit application. Please try again later."
      );
      console.error("Application submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text className="text-2xl font-bold mb-2">{jobTitle}</Text>
          <Text className="text-lg text-gray-700 mb-1">{company}</Text>
          <Text className="text-sm text-gray-500 mb-4">
            Posted on: {postedAt}
          </Text>
          <Text className="text-base font-medium mb-2">Description</Text>
          <Text className="text-base text-gray-700">{description}</Text>
        </View>
        <View className="mb-6">
          <Text className="text-xl font-bold mb-4">
            Apply for this position
          </Text>
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Message *</Text>
            <TextInput
              className="border border-indigo-400 p-4 rounded-lg text-base text-gray-700 h-48"
              placeholder="Paste the message for recruter here..."
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>
          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-1">Resume/CV *</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePickResume}
              className="bg-indigo-500 w-full py-3 rounded-lg mt-3"
            >
              <Text className="text-white text-center font-pbold text-base">
                {cv ? cv.name : "Tap to select PDF file"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className={`rounded-lg py-3 items-center ${
              isSubmitting ? "bg-blue-300" : "bg-blue-500"
            }`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text className="text-white font-semibold">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobApplyPage;
