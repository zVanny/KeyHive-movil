import { StyleSheet, Text, View } from "react-native";

export default function MiCasillero() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos de mi Casillero</Text>
      <Text>(Aquí mostraremos el número y el botón “Dar de baja”)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
});