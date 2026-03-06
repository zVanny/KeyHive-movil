import { View, Text, StyleSheet } from "react-native";

export default function Reportes() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bandeja de Reportes</Text>
      <Text>(Aquí conectamos Supabase para guardar y listar reportes)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
});