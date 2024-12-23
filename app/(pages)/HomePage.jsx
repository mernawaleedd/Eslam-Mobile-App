import React from "react";
import Header from "../../components/layout/header";
import { UserInfo } from "../../components";
import { View } from "react-native";
import SmallButton from "../../components/UI/SmallButton"
import { useRouter } from "expo-router";
import { icons } from "../../constants";
import Navbar from "../../components/Navebar";
import { Notifcation } from "../../components";
function HomePage() {
    const router = useRouter();
    return (
        <>
            <Navbar />
            <UserInfo />

            <View className="flex-row justify-between items-center p-4 mr-2">
                <SmallButton title="Chatbot"
                    icon={icons.Robot}
                    handlePress={() => router.navigate("/Chatbot")}
                />
                <SmallButton title="الإشعارات"
                    icon={icons.Notifcations}
                    handlePress={() => router.navigate("/NotificationPage")}
                />
            </View>
        </>
    );
}

export default HomePage;
