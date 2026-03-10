import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SupabaseReporteRepository } from "../../infrastructure/repositories/SupabaseReporteRepository";
import { getReportes } from "../../application/use-cases/getReportes";
import { Reporte } from "../../domain/entities/Reporte";

export default function ReportesView() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const repo = new SupabaseReporteRepository();
        const data = await getReportes(repo);
        setReportes(data);
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
      <Text style={styles.title}>Bandeja de Reportes</Text>

      {loading ? (
        <Text>Cargando...</Text>
      ) : reportes.length === 0 ? (
        <Text>No hay reportes.</Text>
      ) : (
        reportes.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              Casillero: {item.no_casillero ?? "Sin asignar"}
            </Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>Reporte: {item.reporte}</Text>
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