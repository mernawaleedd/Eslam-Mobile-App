import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const questions = [
  'What is the number of notifications?',
  'What is the number of users?',
  'What is the number of notifications?',
  'What is the number of users?',
];

const Slider = ({ onSelect }) => {
  return (
    <FlatList
      data={questions}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.questionContainer}
          onPress={() => onSelect(item)} 
        >
          <Text style={styles.question}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    width: Dimensions.get('window').width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#d9d9d9',
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom:10,
  },
  question: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default Slider;
