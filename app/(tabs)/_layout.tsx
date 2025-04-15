import React from "react";
import { Platform } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@/context/provider";
import Icon from "react-native-vector-icons/FontAwesome";

const TabLayout = () => {
  const { role } = useAuth();

  if (!role) {
    return <Redirect href="/signin" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#e159e3",
        tabBarInactiveTintColor: "#b9b9c9",
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="dedent" size={24} color={color} />
          ),
          href: role === "APPLICANT" ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="appliedjobs"
        options={{
          title: "Applied Jobs",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="folder-open" size={24} color={color} />
          ),
          href: role === "APPLICANT" ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
          href: role === "EMPLOYER" ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="plus-square-o" size={24} color={color} />
          ),
          href: role === "EMPLOYER" ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
