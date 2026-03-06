import { View, Text, StyleSheet } from "react-native";

export default function Contactos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contactos</Text>
      <Text>Facebook</Text>
      <Text>Instagram</Text>
      <Text>TikTok</Text>
      <Text>Whatsapp</Text>
      <Text>serviciosescolares@utim.edu.mx</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
});