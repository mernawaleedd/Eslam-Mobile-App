import React, { useState, useEffect } from "react";
import { ScrollView, View,Text} from "react-native";
import NotificationsDetailes from "../../components/notifcation/NotificationsDetailes";
import { MainButton,ErrorMassege } from "../../components";
import { icons } from "../../constants";
import api from "../../utils/api";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from 'expo-router';
import Navbar from "../../components/Navebar";

const NotificationsPage = () => {
    const {id} = useLocalSearchParams()
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);
    const { getFunction } = useGlobalContext()
    useEffect(() => {
        console.log(id, " mernaaaaaaaaaaaaaaaaaaaaa");
        if (id){
            const fetchNotifications = async () => {
                setLoader(true);
                try {
                    const response = await getFunction(`tsk/${id}`);
                    if (response?.data?.data) {
                        setData(response.data.data);
                        console.log(response.data.data, " dataaaaaaaaaaaaaaaaa");
                    }
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                } finally {
                    setLoader(false);
                }
            };
            fetchNotifications();
        }
    }, [id]);
    return (

        <View style={{ flex: 1 }}>
            <Navbar />
            <ScrollView style={{ flex: 1, padding: 16 }}>
                {data.length > 0 ? (
                    <NotificationsDetailes data={data} />
                ) : (
                    <View>
                        <ErrorMassege err="لا يوجد تفاصيل"/>
                    </View>
                )}
            </ScrollView>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 16,
                    gap: 16,
                }}
            >
                <MainButton
                    icon={icons.False}
                    iconStyles={"mr-2 mt-1"}
                    containerStyles={"w-[100px] min-h-[45px]"}
                    title={"رفض"}
                />
                <MainButton
                    icon={icons.Check}
                    iconStyles={"mr-2 mt-1"}
                    containerStyles={"w-[100px] min-h-[45px]"}
                    title={"قبول"}
                />
            </View>
        </View>
    );
};

export default NotificationsPage;
