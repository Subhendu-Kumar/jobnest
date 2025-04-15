import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { images } from "../constants";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/provider";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { loading, isAuthenticated, role } = useAuth();

  if (!loading && isAuthenticated) {
    if (role === "APPLICANT") {
      return router.replace("/dashboard");
    } else {
      return router.replace("/home");
    }
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[80vh] justify-center mt-6 items-center px-4">
          <Image
            source={images.indesPageImage}
            className="w-full h-60"
            resizeMode="contain"
          />
          <View className="w-full border-b border-gray-200 my-2" />
          <View className="flex-row items-center justify-center gap-4">
            {/* <Image
                source={images.logo}
                className="w-10 h-10"
                resizeMode="contain"
              /> */}
            <Text className="font-pbold text-2xl text-cyan-400">JobNest</Text>
          </View>
          <Text className="text-sm font-pregular mt-3 text-center text-[#7a6a6a]">
            Where passion meets purpose, and skills shape your story. Jobnest is
            your gateway to discovering endless career possibilities.
          </Text>
          <TouchableOpacity
            disabled={loading}
            onPress={() => router.push(`/signin`)}
            className="w-full bg-purple-400 mt-6 rounded-lg justify-center items-center p-2"
          >
            <Text className="text-white text-center font-psemibold text-lg">
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-psemibold text-white">
                  Get Started
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="#c9c8c5" />
    </SafeAreaView>
  );
};

export default Home;
