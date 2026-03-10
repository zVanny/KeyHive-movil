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
import { loginUser } from "../../application/use-cases/loginUser";

export default function LoginView() {
  const router = useRouter();
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");

  const authRepository = new SupabaseAuthRepository();

  const onLogin = async () => {
    try {
      await loginUser(authRepository, matricula, password);
      router.replace("/(app)/inicio");
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
            <Pressable style={styles.back} onPress={() => router.replace("/")}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>

            <View style={styles.logoCircle}>
              <Image
                source={require("../../../../assets/images/Capa 1.png")}
                style={styles.logo}
              />
            </View>

            <Text style={styles.title}>Inicio</Text>

            <Text style={styles.label}>Usuario:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu usuario..."
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

            <Text style={styles.forgot}>Olvidé mi Contraseña</Text>

            <Pressable style={styles.button} onPress={onLogin}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Pressable>
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
    justifyContent: "center",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  back: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backText: {
    color: "white",
    fontSize: 40,
  },
  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#4a2f16",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 26,
  },
  label: {
    color: "white",
    fontSize: 18,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#e5e5e5",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
  },
  forgot: {
    color: "white",
    textAlign: "right",
    marginTop: 10,
    marginBottom: 25,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#B59A2A",
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});