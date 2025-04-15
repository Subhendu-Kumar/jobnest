import { UserRole } from "@/types";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import { ROLE_KEY, TOKEN_KEY, USER_KEY } from "@/config";

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const saveRole = async (role: UserRole): Promise<void> => {
  await SecureStore.setItemAsync(ROLE_KEY, role);
};

export const getRole = async (): Promise<any | null> => {
  const role = await SecureStore.getItemAsync(ROLE_KEY);
  return role ? role : null;
};

export const getToken = async (): Promise<string | null> => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        await clearUserData();
        return null;
      }
      return token;
    } catch (error) {
      console.error("Invalid token", error);
      await clearUserData();
      return null;
    }
  }
  return null;
};

export const setUser = async (user: object): Promise<void> => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<any | null> => {
  const userData = await SecureStore.getItemAsync(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const clearUserData = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
