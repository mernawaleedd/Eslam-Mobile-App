import { View } from "react-native";
import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { ErrorMassege, ScrollComponent, MainLayout } from "../../components";
import { Notifcation } from "../../components";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const NotificationPage = () => {
  const [data, setData] = useState(false);
  const [loader, setLoader] = useState(true);
  const router = useRouter(); 
  const { getFunction } = useGlobalContext()
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoader(true);
      try {
        const response = await getFunction("notify/notify-org/1");
        setData(response.data.data);
        console.log("marnooon",response.data.data);
        
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoader(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotificationClick = () => {
    router.navigate(`/NotificationDetailesPage`);
  };

  return (
    <MainLayout title={"التنبيهات"} loading={loader}>
      <>
        {data.length === 0 ? (
          <ErrorMassege err={"لا يوجد تنبيهات"} />
        ) : (
          <ScrollComponent
            parentContainerStyle={"min-h-[85vh]"}
            isLoading={loader}
          >
            <View className="p-4">
              {data &&
                data.map((item, index) => (
                  <Notifcation
                    key={index}
                    data={item}
                    onPress={() => handleNotificationClick(
                      0
                    )}
                  />
                ))}
            </View>
          </ScrollComponent>
        )}
      </>
    </MainLayout>
  );
};

export default NotificationPage;
