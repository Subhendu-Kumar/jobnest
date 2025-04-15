import API from "@/api";
import { JobPost } from "@/types";
import { useAuth } from "@/context/provider";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[] | []>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderItem = ({ item }: { item: JobPost }) => {
    const truncatedDescription =
      item?.description?.length > 40
        ? `${item.description.substring(0, 40)}...`
        : item.description;
    const formattedDate = `${new Date(item.createdAt).getDate()}/${new Date(
      item.createdAt
    ).getMonth()}/${new Date(item.createdAt).getFullYear()}`;

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: `/apply/${item.id}` as any,
            params: {
              jobTitle: item.title,
              company: item.company,
              postedAt: formattedDate,
              description: item.description,
            },
          })
        }
        className="bg-white rounded-lg p-4 shadow-md border border-gray-200 mb-3"
      >
        <View className="w-full flex-row items-center justify-between">
          <Text className="text-lg font-bold mb-1">{item.title}</Text>
          <View className="py-1 px-3 bg-blue-100 rounded-md">
            <Text className="text-sm font-psemibold text-blue-600">Apply</Text>
          </View>
        </View>
        <Text className="text-base text-gray-600">{item.company}</Text>
        <Text className="text-sm text-gray-700 mb-3">
          {truncatedDescription}
        </Text>
        <Text className="text-xs text-gray-500 self-end">
          Posted on: {formattedDate}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="h-full bg-white px-4">
      <View className="justify-between flex-row items-start my-3 pb-2 border-b border-gray-200">
        <View>
          <Text className="font-pmedium text-sm text-gray-500">
            Welcome back,
          </Text>
          <Text className="text-2xl text-purple-500 font-psemibold capitalize">
            {user?.name?.split(" ")[0]}
          </Text>
        </View>
        <View className="w-10 h-10 bg-blue-400 rounded-full" />
      </View>

      <Text className="text-xl font-psemibold mb-4 mt-2">Recent Job Posts</Text>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="w-full h-60 flex-1 items-center justify-center">
              <Text className="text-lg font-pmedium text-red-500">
                No Jobs Found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default dashboard;
