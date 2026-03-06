import { View, Text, Pressable, StyleSheet, Image, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* BACKGROUND LOCKERS */}
      <ImageBackground
        source={require("../assets/images/casilleros.jpg")}
        style={styles.background}
        resizeMode="cover"
      >

        {/* VENADOS LOGO FULL SCREEN */}
        <Image
          source={require("../assets/images/venadosutim.jpg")}
          style={styles.venados}
        />

        {/* GREEN OVERLAY */}
        <View style={styles.overlay} />

        {/* CONTENT */}
        <View style={styles.content}>

          <Text style={styles.title}>Bienvenido a</Text>

          <Image
            source={require("../assets/images/Capa 1.png")}
            style={styles.logo}
          />

          <View style={styles.buttons}>
            <Pressable
              style={styles.loginBtn}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.loginText}>Iniciar Sesión</Text>
            </Pressable>

            <Pressable
              style={styles.registerBtn}
              onPress={() => router.push("/(auth)/registro")}
            >
              <Text style={styles.registerText}>Regístrate</Text>
            </Pressable>
          </View>

        </View>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({

container:{
flex:1
},

background:{
flex:1,
justifyContent:"center",
alignItems:"center"
},

venados:{
position:"absolute",
width:"120%",
height:"120%",
resizeMode:"contain",
opacity:0.12
},

overlay:{
...StyleSheet.absoluteFillObject,
backgroundColor:"rgba(6,60,46,0.75)"
},

content:{
alignItems:"center",
justifyContent:"center"
},

title:{
color:"white",
fontSize:32,
fontWeight:"900",
marginBottom:20
},

logo:{
width:300,
height:300,
marginBottom:30,
resizeMode:"contain"
},

buttons:{
flexDirection:"row",
gap:12
},

loginBtn:{
backgroundColor:"#B59A2A",
paddingVertical:14,
paddingHorizontal:25,
borderRadius:40
},

loginText:{
color:"white",
fontWeight:"800",
fontSize:16
},

registerBtn:{
backgroundColor:"white",
paddingVertical:14,
paddingHorizontal:25,
borderRadius:40
},

registerText:{
color:"black",
fontWeight:"800",
fontSize:16
}

});