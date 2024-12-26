import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { icons } from "../../constants";
import { formatDate } from "../../utils/dateFormater";
import { useRoute } from "@react-navigation/native";
const Notify = ({ data, handlePress }) => {
	const { Head, Body, InsertTime,InsertUser, TskID,Status,NotificationID } =
		data;
		const router=useRoute();
	const date = formatDate(new Date(InsertTime), true);

	return (
		<Pressable onPress={handlePress}>
		<View className={`w-full bg-[#d9d9d9] p-2 mb-4 rounded-lg`}>
			<View className="flex flex-row-reverse justify-between mb-2 w-full">
				<View className="flex-row p-2">
				<Text className="font-tbold  text-base">{Head}</Text>
			<Image
					source={icons.Dot}
					resizeMode="contain"
					className="m-2"
				/>
				
				</View>
				<Image
					source={icons.Check}
					resizeMode="contain"
					className="w-5 m-3"
				/>
			</View>
			{/* <View className="w-full ">
				<Text className=" font-tlight text-xs">
					{DepartmentID == 0 ? "النظام" : data?.DepartmentName}
				</Text>
			</View> */}
			<View>
				<Text className=" font-tregular   mb-2 px-3 text-lg">{InsertUser}</Text>
			</View>
			<View>
				<Text className=" font-tregular text-base text-[#7C7878] px-3">{Body}</Text>
			</View>

			<View>
				<Text className=" font-light mt-2 text-xs mb-2 px-3">{`${date[1]}       ${date[0]} `}</Text>
			</View>
		</View>
		</Pressable>
	);
};

export default Notify;
