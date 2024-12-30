// Import necessary libraries
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Reusable Header component
const Header = ({ onBack, title }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Ionicons name="arrow-back" size={24} color="#616161" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

// Reusable Card component
const FeelingsCard = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.card, isSelected && styles.selectedCard]}
    onPress={onPress}
  >
    <View style={styles.circle}>
      <Ionicons name="arrow-forward" size={24} color="#274472" />
    </View>
    <Text style={styles.cardText}>{item.text}</Text>
  </TouchableOpacity>
);

const RadioButtonCard = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.card, isSelected && styles.selectedCard]}
    onPress={onPress}
  >
    <Ionicons
      name={isSelected ? "radio-button-on" : "radio-button-off"}
      size={36}
      color="#fff"
    />
    <Text style={styles.cardText}>{item.text}</Text>
  </TouchableOpacity>
);

const Feelings = ({ navigation }) => {
  const [knowledge, setKnowledge] = useState([]);
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedRadioButtonId, setSelectedRadioButtonId] = useState(null);

  useEffect(() => {
    const loadKnowledge = async () => {
      try {
        const storedKnowledge = await AsyncStorage.getItem("knowledge");
        if (storedKnowledge) {
          setKnowledge(JSON.parse(storedKnowledge));
        } else {
          const dummyData = [
            "Topic 1: Lorem ipsum dolor sit amet.",
            "Topic 2: Lorem ipsum dolor sit amet.",
            "Topic 3: Lorem ipsum dolor sit amet.",
            "Topic 4: Lorem ipsum dolor sit amet.",
            "Topic 5: Lorem ipsum dolor sit amet.",
          ];
          setKnowledge(dummyData);
          await AsyncStorage.setItem("knowledge", JSON.stringify(dummyData));
        }
      } catch (error) {
        console.error("Failed to load knowledge from AsyncStorage:", error);
      }
    };

    loadKnowledge();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const feelingsData = Array.from({ length: 9 }, (_, index) => ({
    id: index,
    text: `Feeling ${index + 1}`,
  }));

  const addAnswer = () => {
    if (text.trim()) {
      const newAnswers = [...answers, text.trim()];
      setAnswers(newAnswers);
      setText("");
    }
  };

  return (
    <LinearGradient colors={["#5885AF", "#5885AF"]} style={styles.background}>
      <Header onBack={() => navigation.goBack()} title="Need" />

      <View style={styles.container}>
        <FlatList
          data={knowledge}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <>
              <TouchableOpacity onPress={() => toggleExpand(index)}>
                <View style={styles.listItem}>
                  <View style={styles.itemContent}>
                    <View style={styles.itemNumber}>
                      <Text style={styles.itemNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.itemText}>{item}</Text>
                    <Ionicons
                      name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                      size={24}
                      color="#FFF"
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {expandedIndex === index && (
                <FlatList
                  data={feelingsData}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    selectedCardId === null ? (
                      <FeelingsCard
                        item={item}
                        isSelected={selectedCardId === item.id}
                        onPress={() => setSelectedCardId(item.id)}
                      />
                    ) : (
                      <RadioButtonCard
                        item={item}
                        isSelected={selectedRadioButtonId === item.id}
                        onPress={() => setSelectedRadioButtonId(item.id)}
                      />
                    )
                  )}
                  numColumns={3}
                  contentContainerStyle={styles.grid}
                />
              )}
            </>
          )}
        />

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your text..."
              placeholderTextColor="#FFFFFF"
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity onPress={addAnswer} style={styles.sendButton}>
              <Ionicons name="paper-plane-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.questionIcon}>
            <Ionicons name="help" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Feelings;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  grid: {
    padding: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "#FFFFFF1A",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCard: {
    backgroundColor: "#274472",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    marginTop: 8,
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    backgroundColor: "#274472",
    borderRadius: 50,
    padding: 8,
    marginBottom: 5,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  itemNumberText: {
    color: "#FFF",
    fontSize: 14,
  },
  itemText: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#41729F",
    padding: 12,
    borderRadius: 10,
    width: "90%",
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    paddingVertical: 0,
  },
  questionIcon: {
    backgroundColor: "#274472",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
});
