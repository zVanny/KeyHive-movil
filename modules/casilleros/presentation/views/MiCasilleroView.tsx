import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { crearSolicitudCasillero } from "../../application/use-cases/crearSolicitudCasillero";
import { getMiCasillero } from "../../application/use-cases/getMiCasillero";
import type { PerfilAlumno } from "../../domain/entities/Casillero";
import { SupabaseCasilleroRepository } from "../../infrastructure/repositories/SupabaseCasilleroRepository";

function formatDateInput(value: string) {
  const clean = value.replace(/\D/g, "").slice(0, 8);
  if (clean.length <= 2) return clean;
  if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`;
}

function parseDateToDb(value: string): string | null {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, dd, mm, yyyy] = match;
  const iso = `${yyyy}-${mm}-${dd}`;
  const test = new Date(`${iso}T00:00:00`);

  if (Number.isNaN(test.getTime())) return null;
  return iso;
}

export default function MiCasilleroView() {
  const router = useRouter();
  const params = useLocalSearchParams<{ casilleroId?: string; noCasillero?: string }>();
  const repository = useMemo(() => new SupabaseCasilleroRepository(), []);

  const [perfil, setPerfil] = useState<PerfilAlumno | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const casilleroId = Number(params.casilleroId ?? "0");
  const noCasillero = params.noCasillero ?? "...";

  async function loadData() {
    try {
      setLoading(true);

      const solicitudActual = await getMiCasillero(repository);

      if (solicitudActual) {
        Alert.alert(
          "Aviso",
          `Ya tienes una solicitud activa para el casillero ${solicitudActual.noCasillero}.`,
          [
            {
              text: "OK",
              onPress: () => router.replace("/casilleros"),
            },
          ]
        );
        return;
      }

      const perfilActual = await repository.getPerfilActual();
      setPerfil(perfilActual);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudieron cargar tus datos.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSave() {
    if (!casilleroId) {
      Alert.alert("Error", "No se recibió un casillero válido.");
      return;
    }

    const fechaInicioDb = parseDateToDb(fechaInicio);
    const fechaFinDb = parseDateToDb(fechaFin);

    if (!fechaInicioDb || !fechaFinDb) {
      Alert.alert("Fechas inválidas", "Usa el formato DD/MM/AAAA en ambas fechas.");
      return;
    }

    if (fechaFinDb < fechaInicioDb) {
      Alert.alert("Fechas inválidas", "La fecha fin no puede ser anterior a la fecha inicio.");
      return;
    }

    try {
      setSaving(true);

      await crearSolicitudCasillero(repository, {
        casilleroId,
        fechaInicio: fechaInicioDb,
        fechaFin: fechaFinDb,
      });

      Alert.alert(
        "Listo",
        `Tu solicitud para el casillero ${noCasillero} fue enviada.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/casilleros"),
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo guardar la solicitud.";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  }

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

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color="#0E5A2B" />
          </View>
        ) : (
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
                value={perfil?.nombre ?? ""}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Correo:</Text>
              <TextInput
                value={perfil?.correo ?? ""}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Matrícula:</Text>
              <TextInput
                value={perfil?.matricula ?? ""}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Carrera:</Text>
              <TextInput
                value={perfil?.carrera ?? ""}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Fecha Inicio:</Text>
              <TextInput
                value={fechaInicio}
                onChangeText={(text) => setFechaInicio(formatDateInput(text))}
                placeholder="DD/MM/AAAA"
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
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#878787"
                keyboardType="numeric"
                style={styles.input}
              />
              <Ionicons name="help-circle-outline" size={22} color="#111" />
            </View>

            <Pressable
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#111" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={28} color="#111" />
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </>
              )}
            </Pressable>
          </View>
        )}
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
  centerState: {
    paddingVertical: 50,
    alignItems: "center",
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
  inputDisabled: {
    color: "#555",
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
  saveButtonDisabled: {
    opacity: 0.7,
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