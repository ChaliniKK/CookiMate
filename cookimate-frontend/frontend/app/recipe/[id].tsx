import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const debuggerHost = Constants.expoConfig?.hostUri;
const address = debuggerHost ? debuggerHost.split(":")[0] : "localhost";
const API_URL = `http://${address}:5000`;

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleStartCooking = () => {
    setCurrentStepIndex(0);
    setCookingMode(true);
  };

  const handleNextStep = () => {
    if (recipe && recipe.steps && currentStepIndex < recipe.steps.length) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const closeCookingMode = () => {
    setCookingMode(false);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const storedFavs = await AsyncStorage.getItem("userFavorites");
        if (storedFavs) {
          const favorites = JSON.parse(storedFavs);
          setIsFavorite(favorites.includes(id));
        }
      } catch (error) {
        console.log("Error checking favorite", error);
      }
    };

    if (id) checkFavorite();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const storedFavs = await AsyncStorage.getItem("userFavorites");
      let favorites = storedFavs ? JSON.parse(storedFavs) : [];

      if (isFavorite) {
        favorites = favorites.filter((favId: string) => favId !== id);
      } else {
        favorites.push(id);
      }

      await AsyncStorage.setItem("userFavorites", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log("Error toggling favorite", error);
    }
  };

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load recipe details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5F4436" />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Recipe not found"}</Text>
        <TouchableOpacity
          style={styles.backButtonFixed}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          {recipe.image ? (
            <Image source={{ uri: recipe.image }} style={styles.headerImage} />
          ) : (
            <View style={[styles.headerImage, { backgroundColor: "#ddd" }]} />
          )}

          <TouchableOpacity
            style={styles.roundBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#5F4436" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color={isFavorite ? "#e74c3c" : "#5F4436"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.title}>{recipe.name}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#5F4436" />
              <Text style={styles.statText}>{recipe.totalTime || "N/A"}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="restaurant-outline" size={20} color="#5F4436" />
              <Text style={styles.statText}>
                {recipe.servings ? `${recipe.servings} Servings` : "General"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.startCookingButton}
            onPress={handleStartCooking}
          >
            <Ionicons
              name="play-circle"
              size={24}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.startCookingText}>Start Cooking</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Ingredients</Text>
          {Array.isArray(recipe.ingredients_raw_str) ? (
            recipe.ingredients_raw_str.map((ing: string, index: number) => (
              <View key={index} style={styles.listItemRow}>
                <View style={styles.bullet} />
                <Text style={styles.listItem}>{ing}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.listItem}>No ingredients listed.</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Instructions</Text>
          {Array.isArray(recipe.steps) ? (
            recipe.steps.map((step: string, index: number) => (
              <View key={index} style={styles.stepContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.listItem}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.listItem}>
              {recipe.instructions || "No instructions provided."}
            </Text>
          )}
        </View>
      </ScrollView>
      //Cooking Mode Modal
      <Modal
        visible={cookingMode}
        animationType="slide"
        transparent={false}
        onRequestClose={closeCookingMode}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeCookingMode}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color="#5F4436" />
            </TouchableOpacity>

            {recipe?.steps && currentStepIndex < recipe.steps.length && (
              <Text style={styles.stepProgress}>
                Step {currentStepIndex + 1} of {recipe.steps.length}
              </Text>
            )}
          </View>

          <View style={styles.modalContent}>
            {recipe?.steps && currentStepIndex < recipe.steps.length ? (
              <View style={styles.stepCard}>
                <Text style={styles.stepBigNumber}>{currentStepIndex + 1}</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.stepText}>
                    {recipe.steps[currentStepIndex]}
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.nextStepButton}
                  onPress={handleNextStep}
                >
                  <Text style={styles.nextStepText}>
                    {currentStepIndex === recipe.steps.length - 1
                      ? "Finish Cooking"
                      : "Next Step"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.completedContainer}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={50} color="#fff" />
                </View>
                <Text style={styles.completedTitle}>Bon Appétit!</Text>
                <Text style={styles.completedSub}>
                  You have finished cooking {recipe?.name}.
                </Text>

                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={closeCookingMode}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2ece2" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2ece2",
  },
  imageWrapper: { width: "100%", height: 300, position: "relative" },
  headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  roundBackButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  startCookingButton: {
    backgroundColor: "#cbaacb",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  startCookingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#f2ece2",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 10,
  },
  stepProgress: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8a6666",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "center",
  },

  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 30,
    height: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  stepBigNumber: {
    fontSize: 240,
    fontWeight: "bold",
    color: "rgba(203, 170, 203, 0.15)",
    position: "absolute",
    top: 80,
    zIndex: -1,
  },
  stepScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  stepText: {
    fontSize: 24,
    color: "#4a4a4a",
    textAlign: "center",
    lineHeight: 36,
    fontWeight: "500",
    marginBottom: 20,
  },
  nextStepButton: {
    backgroundColor: "#5F4436",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    justifyContent: "center",
    zIndex: 1,
  },
  nextStepText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },

  completedContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5F4436",
    marginBottom: 10,
  },
  completedSub: {
    fontSize: 16,
    color: "#8a6666",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  doneButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  heartButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  contentSection: {
    flex: 1,
    marginTop: -30,
    backgroundColor: "#f2ece2",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 500,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5F4436",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 24,
    marginBottom: 16,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { color: "#5F4436", fontWeight: "600", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#dccfc6", marginVertical: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5F4436",
    marginBottom: 12,
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#cbaacb",
    marginTop: 8,
    marginRight: 10,
  },
  listItem: { fontSize: 16, color: "#4a4a4a", lineHeight: 24, flex: 1 },
  stepContainer: { flexDirection: "row", marginBottom: 16 },
  stepNumber: {
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#cbaacb",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
  },
  errorText: { color: "red", fontSize: 16, marginBottom: 20 },
  backButtonFixed: { padding: 10, backgroundColor: "#5F4436", borderRadius: 8 },
  backButtonText: { color: "white" },
});
