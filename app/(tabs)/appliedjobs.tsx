import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import API from "@/api";
import { formatDate } from "@/lib/utils";
import { JobApplication } from "@/types";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const appliedjobs = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const getStatusColor = (state: string): string => {
    switch (state) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const fetchAppliedJobs = async (): Promise<void> => {
    try {
      setError(null);
      const response = await API.get("/applications/my");
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      setError("Failed to load your applications. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const onRefresh = (): void => {
    setRefreshing(true);
    fetchAppliedJobs();
  };

  const renderJobApplication = ({ item }: { item: JobApplication }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <Text className="text-lg font-bold">{item.jobTitle}</Text>
      <View className="flex-row justify-between items-center mt-2 mb-3">
        <Text className="text-gray-500">
          Applied on: {formatDate(item.appliedAt)}
        </Text>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(
            item.status.state
          )}`}
        >
          <Text className="font-medium text-xs">{item.status.state}</Text>
        </View>
      </View>
      {item.message && (
        <View className="bg-gray-50 p-3 rounded-md mb-2">
          <Text className="text-gray-700">{item.message}</Text>
        </View>
      )}
      <TouchableOpacity className="mt-2 self-end">
        <Text className="text-blue-500 font-medium">View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0369a1" />
        <Text className="mt-2 text-gray-600">Loading your applications...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 w-full bg-white">
      <View className="px-4 py-2 border-b border-gray-200">
        <Text className="text-2xl font-bold">Applied Jobs</Text>
      </View>
      {error ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 mb-3">{error}</Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-2 rounded-lg"
            onPress={fetchAppliedJobs}
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : applications.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg text-gray-600 mb-2">
            No applications yet
          </Text>
          <Text className="text-gray-500 text-center mb-4">
            When you apply for jobs, they will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={renderJobApplication}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default appliedjobs;
