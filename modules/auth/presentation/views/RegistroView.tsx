import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SupabaseAuthRepository } from "../../infrastructure/repositories/SupabaseAuthRepository";
import { registerUser } from "../../application/use-cases/registerUser";

export default function RegistroView() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [carrera, setCarrera] = useState("");

  const authRepository = new SupabaseAuthRepository();

  const onRegister = async () => {
    try {
      await registerUser(
        authRepository,
        matricula,
        password,
        nombre,
        telefono,
        carrera
      );
      router.replace("/(auth)/login");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Image
              source={require("../../../../assets/images/ia.jpg")}
              style={styles.header}
            />

            <Pressable style={styles.back} onPress={() => router.replace("/")}>
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
                <Pressable style={styles.saveBtn} onPress={onRegister}>
                  <Text style={styles.saveText}>Guardar Registro</Text>
                </Pressable>

                <Pressable
                  style={styles.backBtn}
                  onPress={() => router.replace("/")}
                >
                  <Text style={styles.backBtnText}>Volver al Inicio</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B3B2E",
  },
  scroll: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#0B3B2E",
  },
  header: {
    width: "100%",
    height: 200,
  },
  back: {
    marginTop: 10,
    marginLeft: 20,
  },
  backText: {
    color: "white",
    fontSize: 18,
  },
  form: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#e5e5e5",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
  },
  buttons: {
    marginTop: 30,
    gap: 14,
  },
  saveBtn: {
    backgroundColor: "#B59A2A",
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
  backBtn: {
    backgroundColor: "#8A8A8A",
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: "center",
  },
  backBtnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
});