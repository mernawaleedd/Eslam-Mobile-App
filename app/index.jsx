import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { icons } from "../constants";
import { MainButton, FormField, LogoBar, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
import { I18nManager } from "react-native";

const Welcome = () => {
	const { isLogged, user, loading, checkAuth, login } = useGlobalContext();
	const [isSubmitting, setSubmitting] = useState(false);
	I18nManager.forceRTL(false);
	I18nManager.allowRTL(false);

	const [form, setForm] = useState({
		username: "",
		password: "",
	});
	const router = useRouter();

	const submit = async () => {
		if (form.username === "" || form.password === "") {
			Toast.show({
				type: "error",
				text1: "خطأ",
				text2: "من فضلك ادخل البيانات المطلوبه",
				autoHide: true,
				visibilityTime: 3000,
				text1Style: {
					textAlign: "right",
				},
				text2Style: {
					textAlign: "right",
				},
			});
			return;
		}

		try {
			setSubmitting(true);

			const result = await login(form.username, form.password); //fcmToken

			Toast.show({
				type: "success",
				text1: "عملية ناجحه",
				text2: "تم تسجيل الدخول بنجاح",
				autoHide: true,
				visibilityTime: 3000,
				text1Style: {
					textAlign: "right",
				},
				text2Style: {
					textAlign: "right",
				},
			});
		} catch (error) {
			console.log("error", error);
			Toast.show({
				type: "error",
				text1: "فشلت العملية",
				text2: error?.response.data.message,
				autoHide: true,
				visibilityTime: 3000,
				text1Style: {
					textAlign: "right",
				},
				text2Style: {
					textAlign: "right",
				},
			});
		} finally {
			setSubmitting(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	useEffect(() => {
		if (isLogged && user) {
			router.replace("/Home");
		}
	}, [isLogged, user]);

	return (
		<SafeAreaView className="bg-white h-full">
			<ScrollView>
				{loading ? (
					<Loader isLoading={loading} />
				) : (
					<>
						<LogoBar />
						<View className="h-full px-4 my-6 mt-20">
							<Text className="text-dark text-center text-2xl font-tbold mb-10">
								تسجيل الدخول
							</Text>
							<FormField
								inputStyle={"p-4"}
								title="اسم المستخدم"
								value={form.username}
								handleChangeText={(e) => setForm({ ...form, username: e })}
								otherStyles="mt-7"
								keyboardType="email-address"
								icon={icons.User}
								placeholder="اسم المستخدم"
								inputIconUser={form.username && icons.deleteIcon}
								handlePress={() =>
									setForm({ ...form, username: "", password: "" })
								}
							/>
							<FormField
								inputStyle={"p-4"}
								title="كلمة المرور"
								value={form.password}
								handleChangeText={(e) => setForm({ ...form, password: e })}
								otherStyles="mt-7"
								icon={icons.lock}
								placeholder="ادخل كلمة المرور"
							/>
							<MainButton
								title="تسجيل الدخول"
								handlePress={submit}
								containerStyles="mt-14"
								isLoading={isSubmitting}
								icon={icons.Signin}
							/>
						</View>
						<Toast />
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default Welcome;

// Request FCM permission and get token
// const authStatus = await messaging().requestPermission();
// const enabled =
// 	authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
// 	authStatus === messaging.AuthorizationStatus.PROVISIONAL;

// let fcmToken = null;
// if (enabled) {
// 	fcmToken = await messaging().getToken();
// }

// // Proceed with login regardless of FCM token status

// import "@react-native-firebase/app";
// import messaging from "@react-native-firebase/messaging";
