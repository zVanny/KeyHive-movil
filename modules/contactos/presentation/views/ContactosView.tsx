import { View, Text, StyleSheet } from "react-native";

export default function ContactosView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contactos</Text>
      <Text style={styles.item}>Facebook</Text>
      <Text style={styles.item}>Instagram</Text>
      <Text style={styles.item}>TikTok</Text>
      <Text style={styles.item}>Whatsapp</Text>
      <Text style={styles.item}>serviciosescolares@utim.edu.mx</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  item: { fontSize: 16, marginBottom: 10 },
});