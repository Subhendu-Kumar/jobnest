import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import API from "@/api";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { formatDate } from "@/lib/utils";
import { Application, ApplicationStatus } from "@/types";

const ViewApplicationsPage = () => {
  const { job_id } = useLocalSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string | null>(
    null
  );
  const [selectedApplicantName, setSelectedApplicantName] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/applications/job/${job_id}`);
      setApplications(res?.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch applications");
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      setProcessingIds((prev) => [...prev, applicationId]);
      await API.put(
        `/applications/${applicationId}/status?status=${newStatus}`
      );
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                status: {
                  ...app.status,
                  state: newStatus,
                  reviewedAt: new Date().toISOString(),
                },
              }
            : app
        )
      );
      Alert.alert(
        "Success",
        `Application ${
          newStatus === "ACCEPTED" ? "accepted" : "rejected"
        } successfully.`
      );
    } catch (err) {
      console.error(
        `Error ${
          newStatus === "ACCEPTED" ? "accepting" : "rejecting"
        } application:`,
        err
      );
      Alert.alert(
        "Error",
        `Failed to ${
          newStatus === "ACCEPTED" ? "accept" : "reject"
        } application. Please try again.`
      );
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== applicationId));
    }
  };

  const handleAccept = (applicationId: string) => {
    Alert.alert(
      "Accept Application",
      "Are you sure you want to accept this application?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => updateApplicationStatus(applicationId, "ACCEPTED"),
        },
      ]
    );
  };

  const handleReject = (applicationId: string) => {
    Alert.alert(
      "Reject Application",
      "Are you sure you want to reject this application?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => updateApplicationStatus(applicationId, "REJECTED"),
        },
      ]
    );
  };

  const getStatusColor = (state: ApplicationStatus["state"]) => {
    switch (state) {
      case "PENDING":
        return "text-yellow-600";
      case "ACCEPTED":
        return "text-green-600";
      case "REJECTED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const renderApplicationItem = ({ item }: { item: Application }) => {
    const isProcessing = processingIds.includes(item.id);
    const isPending = item.status.state === "PENDING";

    return (
      <View className="bg-white p-4 rounded-lg shadow mb-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-gray-800">
            {item.applicantName}
          </Text>
          <Text className={`font-medium ${getStatusColor(item.status.state)}`}>
            {item.status.state}
          </Text>
        </View>
        <Text className="text-gray-700 font-medium mb-1">{item.jobTitle}</Text>
        <View className="border-t border-gray-200 my-2" />
        <TouchableOpacity
          onPress={() => {
            setSelectedResumeUrl(item.resumeUrl);
            setSelectedApplicantName(item.applicantName);
            setVisible(true);
          }}
          className="w-full h-10 my-2 bg-green-500 rounded-lg items-center justify-center flex-1"
        >
          <Text className="text-lg font-psemibold text-white">
            View Resume/Cv
          </Text>
        </TouchableOpacity>
        <View className="flex-row gap-1 justify-between">
          <Text className="text-gray-500 text-sm">
            Applied: {formatDate(item.appliedAt)}
          </Text>
          {item?.status?.reviewedAt && item?.status?.state !== "PENDING" && (
            <Text className="text-gray-500 text-sm">
              Reviewed: {formatDate(item.status.reviewedAt)}
            </Text>
          )}
        </View>
        {isPending && (
          <View className="flex-row mt-3 space-x-2 gap-2">
            <TouchableOpacity
              className="flex-1 bg-green-600 py-2 rounded-md items-center"
              onPress={() => handleAccept(item.id)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-medium">Accept</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-600 py-2 rounded-md items-center"
              onPress={() => handleReject(item.id)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-medium">Reject</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {selectedResumeUrl && (
        <Modal
          visible={visible}
          animationType="slide"
          onRequestClose={() => setVisible(false)}
        >
          <View className="flex-1 bg-white">
            <View className="flex-row items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">
                {selectedApplicantName}'s Resume
              </Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text className="text-blue-600 text-base font-medium">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            <WebView
              source={{ uri: selectedResumeUrl }}
              startInLoadingState
              renderLoading={() => (
                <ActivityIndicator
                  size="large"
                  color="#4F46E5"
                  className="mt-4"
                />
              )}
              className="flex-1"
            />
          </View>
        </Modal>
      )}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-2 text-gray-600">Loading applications...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">{error}</Text>
          <TouchableOpacity
            className="mt-3 bg-indigo-600 px-4 py-2 rounded-md"
            onPress={fetchApplications}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              Applications for
              {applications.length > 0 && (
                <Text className="text-indigo-600">
                  {" "}
                  {applications[0].jobTitle}
                </Text>
              )}
            </Text>
            <Text className="text-gray-600">
              Review and manage job applications
            </Text>
          </View>
          <FlatList
            data={applications}
            keyExtractor={(item) => item.id}
            renderItem={renderApplicationItem}
            contentContainerClassName="pb-4"
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-8">
                <Text className="text-gray-500">No applications found</Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
};

export default ViewApplicationsPage;
