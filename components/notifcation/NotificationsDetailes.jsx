import React from "react";
import { View, Text } from "react-native";

const NotificationsDetailes = ({ data }) => {

    console.log(data, "99");

    const {
        TrxMainID, YearID, SubsidryName, TrxMainNo, TrxDate, TrxMainDescription, TotalTrxDrLocal, SystemID, SubsidryID,
        LimitDays, LimitValueFrom, LimitValueTo, IsMandatory, Accepted, Rejected, ApproveBefor, ApprovalDate, insert_user, insert_time
    } = data[0];

    return (
        <View className="w-full bg-[#d9d9d9] p-2 mb-4 rounded-lg">
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>الإذن</Text>
                <Text>{SubsidryName}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>السنة</Text>
                <Text>{YearID}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>رقم الإذن</Text>
                <Text>{TrxMainNo}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>تاريخ الإذن</Text>
                <Text>{TrxDate}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>البيان</Text>
                <Text>{TrxMainDescription}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>القيمة من</Text>
                <Text>{LimitValueFrom}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>القيمة</Text>
                <Text>{TotalTrxDrLocal}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text> القيمة الى</Text>
                <Text>{LimitValueTo}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>يعتمد قبل</Text>
                <Text>{ApproveBefor}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>تاريخ الإعتماد</Text>
                <Text>{ApprovalDate}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>مدخل البيانات</Text>
                <Text>{insert_user}</Text>
            </View>
            <View className="border-b border-[#E4E7EC] my-1" />
            <View className="text-lg font-tbold p-1 flex flex-row-reverse justify-between">
                <Text>وقت الإدخال</Text>
                <Text>{insert_time}</Text>
            </View>
        </View>
    );
};

export default NotificationsDetailes;
