import { View } from "react-native";
import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { ErrorMassege, ScrollComponent, MainLayout } from "../../components";
import { Notifcation } from "../../components";

const NotificationPage = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  const fetchNotifications = async () => {
    setLoader(true);
    try {
      const response = await api.get("notify/notify-org/1");
      setData(response.data); 
      console.log(data,"data");
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); 
  }, []);

  return (
    <MainLayout title={"التنبيهات"} loading={loader}>
      <>
        {data.length === 0 ? (
          <ErrorMassege err={"لا يوجد تنبيهات"} />
        ) : (
          <ScrollComponent
            parentContainerStyle={"min-h-[85vh]"}
            refreshingFunction={fetchNotifications}
            isLoading={loader}
          >
            <View className="p-4">
              {data.map((item, index) => (
                <Notifcation key={index} data={item} />
              ))}
            </View>
          </ScrollComponent>
        )}
      </>
    </MainLayout>
  );
};

export default NotificationPage;
