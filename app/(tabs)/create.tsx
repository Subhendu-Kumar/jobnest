import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import API from "@/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { JobPostData } from "@/types";

const create = () => {
  const [errors, setErrors] = useState<Partial<JobPostData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [jobData, setJobData] = useState<JobPostData>({
    title: "",
    description: "",
    company: "",
  });

  const handleChange = (field: keyof JobPostData, value: string) => {
    setJobData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<JobPostData> = {};
    if (!jobData.title.trim()) {
      newErrors.title = "Job title is required";
    }
    if (!jobData.company.trim()) {
      newErrors.company = "Company name is required";
    }
    if (!jobData.description.trim()) {
      newErrors.description = "Job description is required";
    } else if (jobData.description.trim().length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post("/jobs", { jobData });
      console.log(res.data);
      setJobData({
        title: "",
        description: "",
        company: "",
      });
      Alert.alert("Success", "Job post created successfully!");
    } catch (error) {
      console.error("Error creating job post:", error);
      Alert.alert("Error", "Failed to create job post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold">Create Job Post</Text>
          <Text className="text-gray-500">
            Fill in the details to post a new job
          </Text>
        </View>
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-1">Job Title *</Text>
          <TextInput
            className={`border rounded-lg p-3 bg-gray-50 ${
              errors.title ? "border-red-500" : "border-indigo-500"
            }`}
            placeholder="e.g. Senior React Native Developer"
            value={jobData.title}
            onChangeText={(text) => handleChange("title", text)}
          />
          {errors.title && (
            <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>
          )}
        </View>
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-1">Company Name *</Text>
          <TextInput
            className={`border rounded-lg p-3 bg-gray-50 ${
              errors.company ? "border-red-500" : "border-indigo-500"
            }`}
            placeholder="e.g. Tech Solutions Inc."
            value={jobData.company}
            onChangeText={(text) => handleChange("company", text)}
          />
          {errors.company && (
            <Text className="text-red-500 text-xs mt-1">{errors.company}</Text>
          )}
        </View>
        <View className="mb-6">
          <Text className="text-sm text-gray-600 mb-1">Job Description *</Text>
          <TextInput
            className={`border rounded-lg p-3 h-48 bg-gray-50 ${
              errors.description ? "border-red-500" : "border-indigo-500"
            }`}
            placeholder="Describe the job responsibilities, requirements, and benefits..."
            value={jobData.description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.description}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className={`flex-1 rounded-lg py-3 items-center ${
            isSubmitting ? "bg-blue-300" : "bg-blue-500"
          }`}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-white font-medium ml-2">Posting...</Text>
            </View>
          ) : (
            <Text className="text-white font-medium">Post Job</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default create;
