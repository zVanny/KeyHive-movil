import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { register } from "../../lib/auth";

export default function Registro() {

  const router = useRouter();

  const [nombre,setNombre] = useState("");
  const [matricula,setMatricula] = useState("");
  const [password,setPassword] = useState("");
  const [telefono,setTelefono] = useState("");
  const [carrera,setCarrera] = useState("");

  const onRegister = async () => {
    try{

      await register(
        matricula,
        password,
        nombre,
        telefono,
        carrera
      );

      router.replace("/(auth)/login");

    }catch(e:any){
      alert(e.message);
    }
  };

  return(

  <View style={styles.container}>

    <Image
      source={require("../../assets/images/ia.jpg")}
      style={styles.header}
    />

    <Pressable
      style={styles.back}
      onPress={()=>router.replace("/")}
    >
    
    </Pressable>

    <View style={styles.form}>

      <Text style={styles.title}>Registro</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre..."
        placeholderTextColor="#777"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Matrícula:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu matrícula..."
        placeholderTextColor="#777"
        value={matricula}
        onChangeText={setMatricula}
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu contraseña..."
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Telefono:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu teléfono..."
        placeholderTextColor="#777"
        value={telefono}
        onChangeText={setTelefono}
      />

      <Text style={styles.label}>Carrera:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu carrera..."
        placeholderTextColor="#777"
        value={carrera}
        onChangeText={setCarrera}
      />

      <View style={styles.buttons}>

        <Pressable
          style={styles.saveBtn}
          onPress={onRegister}
        >
          <Text style={styles.saveText}>Guardar Registro</Text>
        </Pressable>

        <Pressable
          style={styles.backBtn}
          onPress={()=>router.replace("/")}
        >
          <Text style={styles.backBtnText}>Volver al Inicio</Text>
        </Pressable>

      </View>

    </View>

  </View>

  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#0B3B2E"
},

header:{
width:"100%",
height:200
},

back:{
position:"absolute",
top:60,
left:20
},

backText:{
color:"white",
fontSize:18
},

form:{
flex:1,
padding:30
},

title:{
color:"white",
fontSize:34,
fontWeight:"900",
marginBottom:20
},

label:{
color:"white",
fontSize:20,
marginTop:10,
marginBottom:6
},

input:{
backgroundColor:"#e5e5e5",
borderRadius:30,
paddingHorizontal:20,
paddingVertical:14,
fontSize:16
},

buttons:{
flexDirection:"row",
justifyContent:"space-between",
marginTop:30
},

saveBtn:{
backgroundColor:"#B59A2A",
paddingVertical:14,
paddingHorizontal:20,
borderRadius:40
},

saveText:{
color:"white",
fontWeight:"800",
fontSize:16
},

backBtn:{
backgroundColor:"#B59A2A",
paddingVertical:14,
paddingHorizontal:20,
borderRadius:40
},

backBtnText:{
color:"white",
fontWeight:"800",
fontSize:16
}

});