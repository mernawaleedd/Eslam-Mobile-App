import React from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

const Slider = () => {
  // Static questions for testing
  const questions = [
    "What is your favorite color?",
    "How often do you exercise?",
    "What is your dream job?",
    "What is your favorite movie?",
    "Where do you see yourself in 5 years?",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={true} // Enable navigation buttons
        loop={false} // Disable infinite loop
        paginationStyle={{ bottom: 10 }} // Adjust pagination dots
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        scrollEnabled={true} // Allow swipe gestures
      >
        {questions.map((question, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.questionText}>{question}</Text>
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    width: width * 0.9, // Slider width is 90% of screen width
    height: 200, // Fixed height for testing
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  questionText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  dot: {
    backgroundColor: "#ddd",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#333",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});
