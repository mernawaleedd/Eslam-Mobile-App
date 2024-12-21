import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../utils/api";
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
	const [isLogged, setIsLogged] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const checkAuth = async () => {
		try {
			const username = JSON.parse(await SecureStore.getItemAsync("username"));
			const lastActive = JSON.parse(
				await SecureStore.getItemAsync("lastActive")
			);
			const UserTypeID = JSON.parse(
				await SecureStore.getItemAsync("UserTypeID")
			);
			const UserDepartmentID = JSON.parse(
				await SecureStore.getItemAsync("UserDepartmentID")
			);
			const UserDepartmentName = JSON.parse(
				await SecureStore.getItemAsync("UserDepartmentName")
			);

			if (username) {
				setIsLogged(true);
				setUser({
					username: username,
					lastActive: lastActive,
					type: UserTypeID,
					selectedDepartmentID: UserDepartmentID,
					DepartmentID: UserDepartmentID,
					UserDepartmentName: UserDepartmentName,
				});
			} else {
				setIsLogged(false);
			}
		} catch (error) {
			console.error("Error checking authentication:", error);
			setIsLogged(false);
		}
		setLoading(false);
	};

	const saveTokens = async (
		accessToken,
		refreshToken,
		username,
		lastActive,
		UserTypeID,
		UserDepartmentID,
		UserDepartmentName
	) => {
		await SecureStore.setItemAsync("accessToken", accessToken);
		await SecureStore.setItemAsync("refreshToken", refreshToken);
		await SecureStore.setItemAsync("username", JSON.stringify(username));
		await SecureStore.setItemAsync("lastActive", JSON.stringify(lastActive));
		await SecureStore.setItemAsync("UserTypeID", JSON.stringify(UserTypeID));
		await SecureStore.setItemAsync(
			"UserDepartmentName",
			JSON.stringify(UserDepartmentName)
		);
		await SecureStore.setItemAsync(
			"UserDepartmentID",
			JSON.stringify(UserDepartmentID)
		);
	};

	// Usage in your login function

	const login = async (email, password, fcmToken) => {
		try {
			const response = await api.post(`/auth/signin`, {
				emailOrUsername: email,
				password,
				fcmToken: fcmToken,
			});
			const { accessToken, refreshToken, user, success } = response.data;
			const {
				username,
				lastActive,
				UserTypeID,
				UserDepartmentID,
				UserDepartmentName,
			} = user;

			await saveTokens(
				accessToken,
				refreshToken,
				username,
				lastActive,
				UserTypeID,
				UserDepartmentID,
				UserDepartmentName
			);

			setUser({
				username: user?.username,
				lastActive: user?.lastActive,
				type: user?.UserTypeID,
				DepartmentID: user?.UserDepartmentID,
				UserDepartmentName: user?.UserDepartmentName,
			});
			setIsLogged(true);
		} catch (error) {
			return Promise.reject(error);
		}
	};

	const getFunction = async (url) => {
		try {
			const response = await api.get(url);
			return response;
		} catch (error) {
			if (error.response?.status === 403 || error.response?.status === 401) {
				await logOut();
			} else {
				return Promise.reject(error);
			}
		}
	};
	const postFunction = async (url, data) => {
		try {
			const response = await api.post(url, data);
			return response;
		} catch (error) {
			if (error.response?.status === 403 || error.response?.status === 401) {
				await logOut();
			} else {
				return Promise.reject(error);
			}
		}
	};
	const putFunction = async (url, data) => {
		try {
			const response = await api.put(url, data);
			return response;
		} catch (error) {
			if (error.response?.status === 403 || error.response?.status === 401) {
				await logOut();
			} else {
				return Promise.reject(error);
			}
		}
	};
	const deleteFunction = async (url) => {
		try {
			const response = await api.delete(url);
			return response;
		} catch (error) {
			if (error.response?.status === 403 || error.response?.status === 401) {
				await logOut();
			} else {
				return Promise.reject(error);
			}
		}
	};

	const logOut = async () => {
		try {
			await api.get("/auth/signout");
			await SecureStore.deleteItemAsync("accessToken");
			await SecureStore.deleteItemAsync("refreshToken");
			await SecureStore.deleteItemAsync("username");
			await SecureStore.deleteItemAsync("lastActive");
			await SecureStore.deleteItemAsync("UserTypeID");
			await SecureStore.deleteItemAsync("UserDepartmentID");
			setIsLogged(false);
			setUser(null);
		} catch (error) {
			if (error.response?.status === 401 || error.response?.status === 403) {
				await SecureStore.deleteItemAsync("accessToken");
				await SecureStore.deleteItemAsync("refreshToken");
				await SecureStore.deleteItemAsync("username");
				await SecureStore.deleteItemAsync("lastActive");
				await SecureStore.deleteItemAsync("UserTypeID");
				await SecureStore.deleteItemAsync("UserDepartmentID");
				setIsLogged(false);
				setUser(null);
			}
			return Promise.reject(error);
		}
	};

	return (
		<GlobalContext.Provider
			value={{
				logOut,
				isLogged,
				setIsLogged,
				login,
				setLoading,
				user,
				setUser,
				loading,
				checkAuth,
				getFunction,
				postFunction,
				putFunction,
				deleteFunction,
			}}>
			{children}
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;
