import { useEffect } from "react";
import { useFonts } from "expo-font";

import { SplashScreen, Stack } from "expo-router";

import GlobalProvider from "../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const RootStack = () => {
	const [fontsLoaded, error] = useFonts({
		"Tajawal-Bold": require("../assets/fonts/Tajawal-Bold.ttf"),
		"Tajawal-Light": require("../assets/fonts/Tajawal-Light.ttf"),
		"Tajawal-Medium": require("../assets/fonts/Tajawal-Medium.ttf"),
		"Tajawal-Regular": require("../assets/fonts/Tajawal-Regular.ttf"),
	});

	useEffect(() => {
		if (error) throw error;

		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, error]);

	if (!fontsLoaded) {
		return null;
	}

	if (!fontsLoaded && !error) {
		return null;
	}

	return (
		<GlobalProvider>
			<SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
				<Stack>
					<Stack.Screen
						name="index"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="(pages)"
						options={{ headerShown: false }}
					/>
				</Stack>
			</SafeAreaView>
		</GlobalProvider>
	);
};

export default RootStack;

// import "@react-native-firebase/app";
// import messaging from "@react-native-firebase/messaging";
// import notifee, { AndroidImportance } from "@notifee/react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
//load the font to the app
// useEffect(() => {
// 	const unsubscribeForeground = messaging().onMessage(
// 		async (remoteMessage) => {
// 			// Display a custom notification using Notifee
// 			const channelId = await notifee.createChannel({
// 				id: "default",
// 				name: "Default Channel",
// 				android: {
// 					importance: AndroidImportance.HIGH,
// 				},
// 			});

// 			await notifee.displayNotification({
// 				title: remoteMessage.notification?.title,
// 				body: remoteMessage.notification?.body,
// 				android: {
// 					channelId: channelId,
// 				},
// 			});
// 		}
// 	);

// 	return unsubscribeForeground;
// }, []);

// useEffect(() => {
// 	messaging().setBackgroundMessageHandler(async (remoteMessage) => {
// 		console.log("Message handled in the background!", remoteMessage);

// 		// Handle navigation based on notification data
// 		const { type, ...data } = remoteMessage.data;
// 		if (type === "specificType") {
// 			navigation.navigate("TargetScreen", { data });
// 		}
// 	});

// 	messaging()
// 		.getInitialNotification()
// 		.then((remoteMessage) => {
// 			if (remoteMessage) {
// 				console.log(
// 					"Notification caused app to open from quit state:",
// 					remoteMessage
// 				);

// 				// Handle deep linking based on the message content
// 				const { type, ...data } = remoteMessage.data;
// 				if (type === "specificType") {
// 					navigation.navigate("TargetScreen", { data });
// 				}
// 			}
// 		});
// }, [navigation]);
