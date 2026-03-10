import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SupabaseCasilleroRepository } from "../../infrastructure/repositories/SupabaseCasilleroRepository";
import { getMiCasillero } from "../../application/use-cases/getMiCasillero";
import { Casillero } from "../../domain/entities/Casillero";

export default function MiCasilleroView() {
  const [casillero, setCasillero] = useState<Casillero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const repo = new SupabaseCasilleroRepository();
        const data = await getMiCasillero(repo);
        setCasillero(data);
      } catch (e: any) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos de mi Casillero</Text>

      {loading ? (
        <Text>Cargando...</Text>
      ) : !casillero ? (
        <Text>No tienes un casillero asignado.</Text>
      ) : (
        <>
          <Text style={styles.item}>Número: {casillero.no_casillero}</Text>
          <Text style={styles.item}>Área: {casillero.area}</Text>
          <Text style={styles.item}>Planta: {casillero.planta}</Text>
          <Text style={styles.item}>Estado: {casillero.estado}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  item: { fontSize: 16, marginBottom: 8 },
});