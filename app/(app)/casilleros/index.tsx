import { View, Text, StyleSheet } from "react-native";

export default function Casilleros() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitud de Casillero</Text>
      <Text>(Aquí vamos a pintar tu grid de 42 casilleros: verde/amarillo/rojo)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
});