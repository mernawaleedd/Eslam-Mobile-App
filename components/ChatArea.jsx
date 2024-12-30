import React, { useState, useRef, useEffect,Image } from "react";
import Datatable from "./DataTable";
import { icons } from "../constants";
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  Pressable, 
  Animated, 
  Clipboard, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Markdown from 'react-native-markdown-display';
import EventSource from 'react-native-event-source';
import styles from "../app/Styles";
import { Audio } from 'expo-av';
import {transcripeUrl, streamBaseUrl, sqlUrl} from "../config"
import api from "../api";
import Slider from "./UI/Slider";
import { useGlobalContext } from "../context/GlobalProvider";

const ChatArea = ({ messages, setMessages, file, setFile, openCamera, openDocumentPicker, id, ItemType }) => {
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false); 
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false); 
  const [data, setData] = useState(false)
  const [sql, setSql] = useState(false)
  let type = "doc"
  const flatListRef = useRef();
  const { user } = useGlobalContext();

  const closeConnection = (eventSource) => {
    eventSource.close();
    console.log("Connection closed.");
    setLoading(false);
  };
  const stopRecording = async () => {
    try {
      if (isRecording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  async function transcripeAudio(uri) {
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      name: 'recording.m4a', 
      type: 'audio/m4a', 
    });
  
    try {
      // Upload audio
      const response = await fetch(`${transcripeUrl}/transcribe`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = await response.json();
      setInput(result.transcription)
      console.log('Server response:', result.transcription);
  
    } catch (error) {
      console.log('Error uploading audio:', error);
    }
  }

  const sendMessage = async () => {
    if (input === "") return;
    const userMessage = { id: Date.now().toString(), text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); 
    setLoading(true);

    const botMessageId = Date.now().toString() + "2"; 
    let fullResponse = "";

    try {
      let context = "";
      let context2=[]

      if (file) {
        const formData = new FormData();
        formData.append("file", {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
        });

        const response = await fetch(`${streamBaseUrl}/docs`, {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        const result = await response.json();
        context = result.context;
        type = "doc"
        console.log(result)

        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now().toString() + "4", text: `Extracted Text:\n\n ${result.context}`, isUser: false },
          // { id: Date.now().toString() + "5", text: `Translated Text:\n\n ${context}`, isUser: false },
        ]);
        setFile(false); 
      } else if(data) {
        if (ItemType == 1){
          console.log(data)
          const response = await fetch(`${streamBaseUrl}/docs-from-url`, {
            method: "POST",
            body: JSON.stringify({
              "url": data.ItemSrc,
            }),
            headers: { "Content-Type": "application/json" },
          });
  
          const result = await response.json();
          context = result.context;
          console.log(result)
          type = "doc"
        } else if(ItemType == 2){
          console.log(sqlUrl)
          console.log(data)
          const response = await fetch(`${sqlUrl}`, {
            method: "POST",
            body: JSON.stringify({
              "user_massage": input,
              "table_names":[`${data.ItemName}`],
              "appName":"BILLS"
            }),
            headers: { "Content-Type": "application/json", "x-api-key":user.ApiKeyID },
          });
          // const responseText = await response.text(); // Read response as plain text
          console.log("Raw response:", response);
          
            const result = await response.json();
            console.log(result)
            setSql(result.sql)
            const response2 = await fetch(`${transcripeUrl}/query?q=${encodeURIComponent(result.sql)}`, {
              method: "POST",
              headers: { "Content-Type": "application/json"},
            });
            // const responseText = await response.text(); // Read response as plain text
            console.log("Raw response:", response2);
              const result2 = await response2.json();
              context2 = JSON.parse(result2.results)
              console.log(context2)
              type = "db"
              setMessages((prevMessages) => [
                ...prevMessages,
                { id: Date.now().toString() + "3", rows: context2, role: "db", isUser: false },
              ]);
            
          // context = result;
          // console.log(result)
        }
      }
      // Add bot placeholder message after user message
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: botMessageId, text: "", isUser: false },
      ]);

      const url = `${streamBaseUrl}/stream`;  
      const eventSource = new EventSource(url, {
        method: 'POST',
        body: JSON.stringify({
          "user_massage": input,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      eventSource.addEventListener("message", ({ data }) => {
        const msgObj = JSON.parse(data);
        fullResponse += msgObj;

        setMessages((prevMessages) => {
          const existingBotMessage = prevMessages.find((message) => message.id === botMessageId);

          if (existingBotMessage) {
            return prevMessages.map((message) =>
              message.id === botMessageId
                ? { ...message, text: (message.text || "") + msgObj }
                : message
            );
          } else {
            return [
              ...prevMessages,
              { id: botMessageId, text: msgObj, isUser: false },
            ];
          }
        });

        flatListRef.current?.scrollToEnd();
      });

      eventSource.addEventListener('end', () => {
        console.log('Stream ended.');
        closeConnection(eventSource); 
      });

    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => {
        const existingBotMessage = prevMessages.find((message) => message.id === botMessageId);
        return existingBotMessage
          ? prevMessages.map((message) =>
              message.id === botMessageId
                ? { ...message, text: (message.text || "") + "An Error Occurred. Try again." }
                : message
            )
          : [
              ...prevMessages,
              { id: botMessageId, text: "An Error Occurred. Try again.", isUser: false },
            ];
      });
      setLoading(false);
    }
  };
  const handleQuestionSelect = (question) => {
    setInput(question);
  };
  const handleTextCopy = (text) => {
    Clipboard.setString(text);
    alert("Text copied to clipboard!");
  };

  const startRecording = async () => {
    try {
      if (input){
        return
      }
      if (isRecording) {
        await recording.stopAndUnloadAsync();
        transcripeAudio(recording.getURI());
        console.log(recording, "from start")
        setRecording(null);
        setIsRecording(false);
      }else{
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access microphone is required!');
          return;
        }
        
        const recordingInstance = new Audio.Recording();
        await recordingInstance.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await recordingInstance.startAsync();
    
        setRecording(recordingInstance);
        setIsRecording(true);
        console.log(recordingInstance)
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  
  
  const handleMicPressIn = () => {
    if (input.trim() === "") {
      Animated.spring(scaleAnim, {
        toValue: 3, 
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMicPressOut = async () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    if (isRecording){
      // await stopRecording()
    }
  };

  const rows = [
    {"TotalBills": "261661531.27"}
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/document/${id}`);
        console.log(response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getData()
  }, [])
  
  const renderMessage = ({ item }) => {
    const userMessageStyles = {
      backgroundColor: item.isUser ? "#686D76" : "#F0F0F0", 
      color: item.isUser ? "#fff" : "#000",
    };
  
    return (
      <View>
        {item.isUser ? (
          <View
            style={[
              styles.messageContainer,
              { alignSelf: "flex-end", flexDirection: "row-reverse" }
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle-outline" size={24} color="#686D76" />
            </View>
            <View
              style={[
                styles.messageBubble,
                { backgroundColor: userMessageStyles.backgroundColor }
              ]}
            >
              <Text style={{ color: userMessageStyles.color, fontSize: 16 }}>
                {item.text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleTextCopy(item.text)}>
              <Ionicons name="copy" size={20} color="#686D76" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.messageContainer,
              { alignSelf: "flex-start", flexDirection: "row" }
            ]}
          >
            <MaterialIcons name="smart-toy" size={24} color="#686D76" />
            <View
              style={[
                styles.messageBubble,
                { backgroundColor: userMessageStyles.backgroundColor }
              ]}
            >
              <Text style={{ color: userMessageStyles.color, fontSize: 16 }}>
                {item.text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleTextCopy(item.text)}>
              <Ionicons name="copy" size={20} color="#686D76" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
 
  return (
    <View style={styles.chatArea}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        ref={flatListRef}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      /> 
      <View><Slider onSelect={handleQuestionSelect}/></View>   
      <View style={styles.inputContainer}>
        <View style={styles.inputWithMic}>
          {/* <TouchableOpacity onPress={openCamera} style={styles.iconContainer}>
            <MaterialIcons name="photo-camera" size={24} color="#2579A7" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openDocumentPicker} style={styles.iconContainer}>
            <MaterialIcons name="attach-file" size={24} color="#2579A7" />
          </TouchableOpacity> */}
          <TextInput
            style={[
              styles.input,
              { textAlignVertical: "center", paddingVertical: 8 }
            ]}
            placeholder="Type a message..."
            placeholderTextColor="#aaa" 
            value={input}
            onChangeText={setInput}
            multiline={true}
            numberOfLines={4}
          />
        </View>
    
        <Pressable
          onPressIn={() => {
            if(loading){
              return
            }else{
              handleMicPressIn();
              startRecording();
            }
          }}
          
          onPressOut={handleMicPressOut}
          onPress={sendMessage}
          disabled={loading}
          style={({ pressed }) => [
            styles.sendButton,
            pressed && { opacity: 0.8, scale: 1.5 },
            isRecording && {
              shadowColor: "#2b2b2b",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 6,
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={input ? "send" : isRecording ? "mic" : "mic-outline"}
              size={20}
              color={input ? "#686D76" : isRecording ? "#686D76" : "#2b2b2b"}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

export default ChatArea;
