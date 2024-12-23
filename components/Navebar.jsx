import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet,Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../app/Styles";
import { useRouter } from "expo-router";
import MainButton from "./UI/MainButton";
const Navbar = ({ onOpenSidebar, showChatIcon = false, onNewChat }) => {
  const [isOnDropdownPage, setIsOnDropdownPage] = useState(false);
  const router = useRouter(); 

  const handleBackAndLogin = () => {
    router.back();
  };

  return (
    <View style={styles.navbar}>
      {/* <TouchableOpacity onPress={onOpenSidebar}>
        <Ionicons name="menu-outline" size={28} color="#2b2b2b" />
      </TouchableOpacity> */}
      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto" }}>
        {showChatIcon && (
          <TouchableOpacity onPress={onNewChat}>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={28}
              color="#2b2b2b"
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleBackAndLogin} style={customStyles.roundedIcon}>
          <Ionicons name="arrow-forward-outline" size={20} color="#2b2b2b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const customStyles = StyleSheet.create({
  roundedIcon: {
    backgroundColor: "#d9d9d9",
    borderRadius: 50,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Navbar;
