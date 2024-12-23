import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Define your API base URL

const API_BASE_URL = "http://192.168.1.197:5000/api";

const api = axios.create({
	baseURL: API_BASE_URL,
});

api.interceptors.request.use(
	async (config) => {
		try {
			const accessToken = await SecureStore.getItemAsync("accessToken");
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
		} catch (error) {
			console.log("Error getting access token:", error);
			Promise.reject(error)
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (!(await SecureStore.getItemAsync("refreshToken"))) {
			return;
		}

		if (error.response?.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshToken = await SecureStore.getItemAsync("refreshToken");
				console.log(accessToken);
				// Request a new access token using the refresh token
				const response = await axios.post(`${API_BASE_URL}/auth/token`, {
					refreshToken,
				});

				const { accessToken } = response.data;

				// Save the new access token to SecureStore
				await SecureStore.setItemAsync("accessToken", accessToken);

				// Update the authorization header and retry the original request
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;

				return api(originalRequest);
			} catch (error) {
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);

export default api;
