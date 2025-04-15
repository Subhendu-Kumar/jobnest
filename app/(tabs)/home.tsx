import API from "@/api";
import { JobPost } from "@/types";
import { useAuth } from "@/context/provider";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

const home = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[] | []>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setFetching(true);
      try {
        const res = await API.get("/jobs/my");
        setJobs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setFetching(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="justify-between flex-row items-start my-3 px-4 pb-2 border-b border-gray-200">
        <View>
          <Text className="font-pmedium text-sm text-gray-500">
            Welcome back,
          </Text>
          <Text className="text-2xl text-purple-500 font-psemibold capitalize">
            {user?.name.split(" ")[0]}
          </Text>
        </View>
        {/* <Image source={images.logo} className="w-9 h-10" resizeMode="contain" /> */}
        <View className="w-10 h-10 bg-blue-400 rounded-full" />
      </View>
      <ScrollView className="w-full h-full px-4">
        <Text className="text-xl font-psemibold mb-4 mt-2">
          Job Postd by Me
        </Text>
        {fetching ? (
          <View className="w-full h-60 items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : jobs?.length > 0 ? (
          jobs.map((job, idx) => {
            const truncatedDescription =
              job.description?.length > 40
                ? `${job?.description?.substring(0, 40)}...`
                : job.description;
            const formattedDate = `${new Date(
              job.createdAt
            ).getDate()}/${new Date(job.createdAt).getMonth()}/${new Date(
              job.createdAt
            ).getFullYear()}`;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() =>
                  router.push(`/viewapplications/${job.id}` as any)
                }
                className="bg-white rounded-lg p-4 shadow-md border border-gray-200 mb-3"
              >
                <View className="w-full flex-row items-center justify-between">
                  <Text className="text-lg font-bold mb-1">{job.title}</Text>
                  <View className="py-1 px-3 bg-blue-100 rounded-md">
                    <Text className="text-sm font-psemibold text-blue-600">
                      View
                    </Text>
                  </View>
                </View>
                <Text className="text-base text-gray-600">{job.company}</Text>
                <Text className="text-sm text-gray-700 mb-3">
                  {truncatedDescription}
                </Text>
                <Text className="text-xs text-gray-500 self-end">
                  Posted on: {formattedDate}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="w-full h-60 flex-1 items-center justify-center">
            <Text className="text-lg font-pmedium text-red-500">
              No Jobs Found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;
