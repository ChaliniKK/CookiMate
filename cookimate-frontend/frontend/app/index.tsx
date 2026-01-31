import { Link } from "expo-router";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View ,Image} from "react-native";

type NavCardProps = {
  title: string;
  icon: string;
  description: string;
  href: string;
};
const NavCard = ({ title, icon, description,href }: NavCardProps) => {
  return (
    <Pressable
    onPress={() => router.push(href as any)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconCircle}>
        <Text>{icon}</Text>
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </Pressable>
  );
};

function HomePage() {
  return (
    <View style={styles.mainContainer}>

      <View style={styles.topSubContainer}>
        <Text style={styles.welcomemsg}>Welcome Back!!</Text>
        <View style={styles.bubble}>
              <Text style={styles.bubbleText}>hii hope you ajhhhhre having a good day</Text>
             
              <View style={styles.bubbleTail} />
           </View>

        <View style={styles.mascotCircle}>
          <Image source={require('../assets/images/logo.png')} 
          style={styles.mascotImg}  />
          
        </View>
        

        

      </View>

      <View style={styles.bottomSubContainer}>
        
        
          <NavCard
            title="search-page"
            icon="🔍"
            href="/loginPage"
            description="Testing the Reusable Card component"
          />
        
        <NavCard
          title="community -page"
          icon="🔍"
          href="/loginPage"
          description={"Testing the Reusable Card component 2"}
        ></NavCard>
         
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,

    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: "#f9f9f9cb",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18,fontWeight:'bold', color: "#333" },
  cardDescription: { fontSize: 14, color: "#777", marginTop: 2 },
  mainContainer: {
    borderWidth: 1,
    borderColor: "#751212",
    borderStyle: "solid",
  },
  bottomSubContainer:{
    borderWidth:1,
    borderColor: "#26e30d",
    borderStyle: "solid",
    padding:25,

  },
  topSubContainer:{
     borderWidth:1,
    borderColor: "#e6391b",
    borderStyle: "solid",
    padding:15,
    alignItems:'center',
    margin:25,
  },
  mascotCircle: {
    width: 225,
    height :225,
     borderWidth:1,
    borderColor: "#e6391b",
    borderStyle: "solid",
    padding:25,
    
    borderRadius: 150,
    overflow:'hidden',
    backgroundColor: '#fff',
    
    
  },
  mascotImg: { width: '100%', height: '100%' },
  welcomemsg:{
    marginRight:"auto",
    fontWeight:'bold',
    marginBottom:10,
    fontSize:18,
    padding:0
  },
  bubble: {
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 20,
    marginBottom: 20,
    maxWidth: '99%',
    position: 'relative', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  bubbleText: {
    fontSize: 16,
    color: '#5D4037',
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8, 
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    zIndex: -1, 
  },



  


});

export default HomePage;
