import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function formatDateInput(value: string) {
  const clean = value.replace(/\D/g, "").slice(0, 8);
  if (clean.length <= 2) return clean;
  if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`;
}

export default function MiCasilleroView() {
  const router = useRouter();
  const params = useLocalSearchParams<{ locker?: string }>();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [carrera, setCarrera] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const noCasillero = params.locker ?? "...";

  const handleSave = () => {
    if (!nombre || !correo || !matricula || !carrera || !fechaInicio || !fechaFin) {
      Alert.alert("Faltan datos", "Completa todos los campos.");
      return;
    }

    Alert.alert(
      "Listo",
      `Tu solicitud para el casillero ${noCasillero} está lista.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0E5A2B" />

      <View style={styles.topGreen} />

      <View style={styles.topGold}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="white" />
          <Text style={styles.backText}>Regresar</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Datos del Alumno</Text>

        <View style={styles.separator} />

        <View style={styles.formSection}>
          <View style={styles.row}>
            <Text style={styles.label}>No. Casillero:</Text>
            <View style={styles.smallBadge}>
              <Text style={styles.badgeText}>{noCasillero}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#878787"
              style={styles.input}
            />
            <Ionicons name="help-circle-outline" size={22} color="#111" />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Correo:</Text>
            <TextInput
              value={correo}
              onChangeText={setCorreo}
              placeholder="@gmail.com"
              placeholderTextColor="#878787"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Ionicons name="help-circle-outline" size={22} color="#111" />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Matricula:</Text>
            <TextInput
              value={matricula}
              onChangeText={setMatricula}
              placeholder="Ingresa tu matricula"
              placeholderTextColor="#878787"
              style={styles.input}
            />
            <Ionicons name="help-circle-outline" size={22} color="#111" />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Carrera:</Text>
            <TextInput
              value={carrera}
              onChangeText={setCarrera}
              placeholder="Escoge tu carrera"
              placeholderTextColor="#878787"
              style={styles.input}
            />
            <Ionicons name="help-circle-outline" size={22} color="#111" />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha Inicio:</Text>
            <TextInput
              value={fechaInicio}
              onChangeText={(text) => setFechaInicio(formatDateInput(text))}
              placeholder="DD/MM/AA"
              placeholderTextColor="#878787"
              keyboardType="numeric"
              style={styles.input}
            />
            <Ionicons name="help-circle-outline" size={22} color="#111" />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha Fin:</Text>
            <TextInput
              value={fechaFin}
              onChangeText={(text) => setFechaFin(formatDateInput(text))}
              placeholder="DD/MM/AA"
              placeholderTextColor="#878787"
              keyboardType="numeric"
              style={styles.input}
            />
            <Ionicons name="help-circle-outline" size={22} color="#111" />
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" size={28} color="#111" />
            <Text style={styles.saveButtonText}>Guardar</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.bottomGold} />
      <View style={styles.bottomGreen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0E5A2B",
  },
  topGreen: {
    height: 40,
    backgroundColor: "#0E5A2B",
  },
  topGold: {
    height: 30,
    backgroundColor: "#9C8600",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  backText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 2,
  },
  main: {
    flex: 1,
    backgroundColor: "#ECECEC",
  },
  scrollContent: {
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#111",
    marginTop: 22,
    marginBottom: 18,
  },
  separator: {
    height: 1,
    backgroundColor: "#8F8F8F",
  },
  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  label: {
    width: 115,
    fontSize: 17,
    color: "#111",
  },
  smallBadge: {
    width: 76,
    height: 36,
    backgroundColor: "#D9D6D6",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: "#D9D6D6",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111",
    marginRight: 10,
  },
  saveButton: {
    marginTop: 44,
    alignSelf: "center",
    minWidth: 200,
    height: 58,
    borderRadius: 22,
    backgroundColor: "#D9D3D3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  bottomGold: {
    height: 28,
    backgroundColor: "#9C8600",
  },
  bottomGreen: {
    height: 24,
    backgroundColor: "#2D7A1F",
  },
});