import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { globalStyle } from "../globalStyleSheet.style";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

// --- Types ---
type RecipeCardProps = {
  title: string;
  image: any;
};

const RecipeCard = ({ title, image }: RecipeCardProps) => (
  <View style={styles.recipeCard}>
    <Image source={image} style={styles.recipeImage} />
    <View style={styles.recipeLabelContainer}>
      <Text style={styles.recipeLabelText}>{title}</Text>
    </View>
  </View>
);

function GenerateRecipesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const suggestedIngredients = ["Tomato", "Carrot", "Chicken"];

  // Add ingredient logic
  const handleAddInput = () => {
    if (ingredientInput.trim().length > 0) {
      if (!selectedIngredients.includes(ingredientInput.trim())) {
        setSelectedIngredients([
          ...selectedIngredients,
          ingredientInput.trim(),
        ]);
      }
      setIngredientInput("");
    }
  };

  const handleQuickAdd = (item: string) => {
    if (!selectedIngredients.includes(item)) {
      setSelectedIngredients([...selectedIngredients, item]);
    }
  };

  const removeIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  return (
    <View style={[styles.container, globalStyle.container]}>
      {/* 1. MAIN SCREEN CONTENT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainWrapper}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>
            What ingredients do you have with you?
          </Text>

          {/* --- NEW SEARCH BAR (Contains Ingredients + Input) --- */}
          <View style={styles.searchContainer}>
            {/* 1. Render Selected Ingredients as Chips INSIDE the bar */}
            {selectedIngredients.map((tag, index) => (
              <Pressable
                key={index}
                onPress={() => removeIngredient(index)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{tag} ✕</Text>
              </Pressable>
            ))}

            {/* 2. The Text Input (No Plus Button) */}
            <TextInput
              style={styles.textInput}
              placeholder={
                selectedIngredients.length === 0
                  ? "Type an ingredient..."
                  : "Add more..."
              }
              placeholderTextColor="#999"
              value={ingredientInput}
              onChangeText={setIngredientInput}
              onSubmitEditing={handleAddInput} // Hit Enter to add
              blurOnSubmit={false} // Keep keyboard open for rapid entry
            />
          </View>

          {/* SUGGESTION BUTTONS */}
          <View style={styles.suggestionRow}>
            {suggestedIngredients.map((item) => (
              <Pressable
                key={item}
                style={styles.suggestionBtn}
                onPress={() => handleQuickAdd(item)}
              >
                <Text style={styles.suggestionText}>+ {item}</Text>
              </Pressable>
            ))}
          </View>

          {/* MASCOT */}
          <View style={styles.mascotSection}>
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>
                Hello, there! I'm here to guide you through the recipe!
              </Text>
            </View>
          </View>

          {/* GENERATE BUTTON */}
          <Pressable
            style={({ pressed }) => [
              styles.mainGenerateBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.generateBtnText}>Generate Recipes</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 2. FLOATING POP-UP (Modal with Blur) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        {/* BlurView fills the entire screen behind the card */}
        <BlurView intensity={40} tint="dark" style={styles.absoluteFill}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsModalVisible(false)}
          >
            {/* Floating Card */}
            <Pressable
              style={styles.popupCard}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.popupHeader}>
                <Text style={styles.expandedTitle}>Generated Recipes</Text>
                <Pressable
                  onPress={() => setIsModalVisible(false)}
                  style={styles.closeX}
                >
                  <Text style={{ fontSize: 20, color: "#999" }}>✕</Text>
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ width: "100%" }}
              >
                <RecipeCard
                  title="Corn & Parmesan Pasta"
                  image={require("../../assets/images/Home-page-Mascot.jpg")}
                />
                <RecipeCard
                  title="Garlic Herb Chicken"
                  image={require("../../assets/images/Home-page-Mascot.jpg")}
                />
                <Pressable
                  style={styles.closeBtn}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.closeBtnText}>Done</Text>
                </Pressable>
              </ScrollView>
            </Pressable>
          </Pressable>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6",
  },
  mainWrapper: {
    flex: 1,
  },
  scrollContent: {
    padding: 25,
    paddingTop: 80,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3E3E3E",
    marginBottom: 20,
  },

  /* --- NEW SEARCH CONTAINER --- */
  searchContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows tags to wrap to next line
    backgroundColor: "#fff",
    width: "100%",
    minHeight: 50,
    padding: 8,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  /* The Chips inside the search bar */
  chip: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginVertical: 4,
  },
  chipText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  /* The Input itself */
  textInput: {
    flex: 1, // Takes up remaining space
    minWidth: 100, // Ensures it doesn't get squished too small
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
    marginLeft: 5,
  },

  // --- Suggestion Buttons ---
  suggestionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
  },
  suggestionBtn: {
    backgroundColor: "#EFE5DA",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DBCFB0",
  },
  suggestionText: {
    color: "#5D4037",
    fontWeight: "600",
    fontSize: 14,
  },

  // --- Mascot ---
  mascotSection: {
    alignItems: "center",
    marginVertical: 10,
  },
  chatBubble: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    marginBottom: 5,
    elevation: 2,
    shadowOpacity: 0.1,
    borderBottomLeftRadius: 0,
  },
  chatText: { textAlign: "center", color: "#5D4037", fontSize: 15 },
  mascotPlaceholder: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  mainGenerateBtn: {
    backgroundColor: "#EBC390",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCA370",
  },
  generateBtnText: { color: "#4A3B2C", fontSize: 18, fontWeight: "bold" },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },

  /* --- Floating Modal Styles --- */
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'rgba(0,0,0,0.3)', // Optional tint if BlurView fails
  },
  popupCard: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
    // Floating Shadow Effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  popupHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  closeX: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  expandedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  recipeImage: { width: "100%", height: 120, backgroundColor: "#eee" },
  recipeLabelContainer: {
    backgroundColor: "#C4734D",
    padding: 10,
    alignItems: "center",
  },
  recipeLabelText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  closeBtn: {
    backgroundColor: "#2D8A4E",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  closeBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});

export default GenerateRecipesPage;
