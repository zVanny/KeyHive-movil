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
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { crearSolicitudCasillero } from "../../application/use-cases/crearSolicitudCasillero";
import { getMiCasillero } from "../../application/use-cases/getMiCasillero";
import type { PerfilAlumno } from "../../domain/entities/Casillero";
import { SupabaseCasilleroRepository } from "../../infrastructure/repositories/SupabaseCasilleroRepository";

const { width } = Dimensions.get("window");
const isSmallPhone = width < 380;

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

export default function SolicitarCasilleroView() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    casilleroId?: string;
    noCasillero?: string;
  }>();
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
          `Ya tienes una solicitud o casillero activo (${solicitudActual.noCasillero}).`,
          [
            {
              text: "OK",
              onPress: () => router.replace("/casilleros/mi-casillero"),
            },
          ]
        );
        return;
      }

      const perfilActual = await repository.getPerfilActual();
      setPerfil(perfilActual);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar tus datos.";

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
      Alert.alert(
        "Fechas inválidas",
        "Usa el formato DD/MM/AAAA en ambas fechas."
      );
      return;
    }

    if (fechaFinDb < fechaInicioDb) {
      Alert.alert(
        "Fechas inválidas",
        "La fecha fin no puede ser anterior a la fecha inicio."
      );
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
            onPress: () => router.replace("/casilleros/mi-casillero"),
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la solicitud.";

      if (
        message.includes("solicitudes_casillero_unica_por_casillero") ||
        message.toLowerCase().includes("duplicate key value")
      ) {
        Alert.alert(
          "Casillero no disponible",
          "Ese casillero ya tiene una solicitud registrada. Elige otro casillero."
        );
      } else {
        Alert.alert("Error", message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="light" backgroundColor="#0E5A2B" />

      <View style={styles.headerWrap}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Volver</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Solicitud</Text>

          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.title}>Datos del Alumno</Text>
          <Text style={styles.subtitle}>
            Revisa tu información y define el periodo para solicitar el
            casillero.
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#0E5A2B" />
          </View>
        ) : (
          <>
            <View style={styles.sectionCard}>
              <View style={styles.badgeRow}>
                <Text style={styles.sectionTitle}>Casillero seleccionado</Text>
                <View style={styles.smallBadge}>
                  <Text style={styles.badgeText}>{noCasillero}</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Información personal</Text>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  value={perfil?.nombre ?? ""}
                  editable={false}
                  style={[styles.input, styles.inputDisabled]}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Correo</Text>
                <TextInput
                  value={perfil?.correo ?? ""}
                  editable={false}
                  style={[styles.input, styles.inputDisabled]}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Matrícula</Text>
                <TextInput
                  value={perfil?.matricula ?? ""}
                  editable={false}
                  style={[styles.input, styles.inputDisabled]}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Carrera</Text>
                <TextInput
                  value={perfil?.carrera ?? ""}
                  editable={false}
                  style={[styles.input, styles.inputDisabled]}
                />
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Periodo solicitado</Text>

              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Fecha Inicio</Text>
                  <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                </View>
                <TextInput
                  value={fechaInicio}
                  onChangeText={(text) => setFechaInicio(formatDateInput(text))}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#878787"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Fecha Fin</Text>
                  <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                </View>
                <TextInput
                  value={fechaFin}
                  onChangeText={(text) => setFechaFin(formatDateInput(text))}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#878787"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <Pressable
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Guardar solicitud</Text>
                  </>
                )}
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0E5A2B",
  },

  headerWrap: {
    backgroundColor: "#0E5A2B",
    paddingBottom: 10,
  },

  topBar: {
    minHeight: 62,
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: "#9C8600",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },

  backButton: {
    width: 90,
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 2,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 90,
  },

  main: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 34,
  },

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  title: {
    fontSize: isSmallPhone ? 28 : 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#0F172A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    color: "#6B7280",
    paddingHorizontal: 8,
  },

  centerState: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  smallBadge: {
    minWidth: 70,
    height: 38,
    backgroundColor: "#EEF2F7",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  badgeText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "700",
  },

  fieldBlock: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },

  input: {
    width: "100%",
    minHeight: 46,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  inputDisabled: {
    color: "#6B7280",
  },

  saveButton: {
    marginTop: 10,
    alignSelf: "center",
    minWidth: 210,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#0E5A2B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 8,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});