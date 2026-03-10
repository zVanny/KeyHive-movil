import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SupabaseCasilleroRepository } from "../../infrastructure/repositories/SupabaseCasilleroRepository";
import { getCasilleros } from "../../application/use-cases/getCasilleros";
import { Casillero } from "../../domain/entities/Casillero";

export default function CasillerosView() {
  const [casilleros, setCasilleros] = useState<Casillero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const repo = new SupabaseCasilleroRepository();
        const data = await getCasilleros(repo);
        setCasilleros(data);
      } catch (e: any) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Solicitud de Casillero</Text>

      {loading ? (
        <Text>Cargando...</Text>
      ) : casilleros.length === 0 ? (
        <Text>No hay casilleros.</Text>
      ) : (
        casilleros.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>Casillero {item.no_casillero}</Text>
            <Text>Área: {item.area}</Text>
            <Text>Planta: {item.planta}</Text>
            <Text>Estado: {item.estado}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  card: {
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
});