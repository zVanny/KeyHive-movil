import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { createReport } from "../../application/use-cases/createReport";
import { SupabaseReporteRepository } from "../../infrastructure/repositories/SupabaseReporteRepository";
import type { Reporte } from "../../domain/entities/Reporte";
import { getReports } from "../../application/use-cases/getReportes";

function getTodayForInput(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear());
  return `${day}/${month}/${year}`;
}

function formatDatePretty(date: string): string {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
}

function parseInputDateToDb(date: string): string | null {
  const cleaned = date.trim();
  const match = cleaned.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, dd, mm, yyyy] = match;
  const iso = `${yyyy}-${mm}-${dd}`;
  const test = new Date(`${iso}T00:00:00`);

  if (Number.isNaN(test.getTime())) return null;

  return iso;
}

export default function ReportesView() {
  const router = useRouter();
  const reporteRepository = useMemo(() => new SupabaseReporteRepository(), []);

  const [noCasillero, setNoCasillero] = useState("");
  const [fecha, setFecha] = useState(getTodayForInput());
  const [reporte, setReporte] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [misReportes, setMisReportes] = useState<Reporte[]>([]);

  async function loadInitialData() {
    try {
      setLoading(true);

      const [lockerNumber, reports] = await Promise.all([
        reporteRepository.getAssignedLockerNumber(),
        getReports(reporteRepository),
      ]);

      if (lockerNumber !== null) {
        setNoCasillero(String(lockerNumber));
      }

      setMisReportes(reports);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar los datos.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  async function handleSave() {
    const reporteLimpio = reporte.trim();
    const fechaDb = parseInputDateToDb(fecha);

    if (!fechaDb) {
      Alert.alert("Fecha inválida", "Usa el formato DD/MM/AAAA.");
      return;
    }

    if (!reporteLimpio) {
      Alert.alert("Campo requerido", "Escribe el motivo del reporte.");
      return;
    }

    const lockerValue =
      noCasillero.trim() === "" ? null : Number(noCasillero.trim());

    if (noCasillero.trim() !== "" && Number.isNaN(lockerValue)) {
      Alert.alert("Dato inválido", "El número de casillero debe ser numérico.");
      return;
    }

    try {
      setSaving(true);

      await createReport(reporteRepository, {
        noCasillero: lockerValue,
        fecha: fechaDb,
        reporte: reporteLimpio,
      });

      Alert.alert("Listo", "El reporte se guardó correctamente.");
      setReporte("");
      setFecha(getTodayForInput());

      await loadInitialData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo guardar el reporte.";
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
        <Pressable
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("./inicio");
            }
          }}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
          <Text style={styles.backText}>Regresar</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Bandeja de Reportes</Text>

        <View style={styles.sectionCard}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>No. Casillero:</Text>
            <TextInput
              value={noCasillero}
              onChangeText={setNoCasillero}
              keyboardType="numeric"
              placeholder="..."
              placeholderTextColor="#8B8B8B"
              style={styles.smallInput}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Fecha:</Text>
            <TextInput
              value={fecha}
              onChangeText={setFecha}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#8B8B8B"
              style={styles.dateInput}
            />
            <Ionicons name="help-circle-outline" size={22} color="#111" />
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.sectionCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.label}>Reporte:</Text>
            <Ionicons name="help-circle-outline" size={22} color="#111" />
          </View>

          <TextInput
            value={reporte}
            onChangeText={setReporte}
            placeholder="Motivo de reporte........"
            placeholderTextColor="#7E7E7E"
            multiline
            textAlignVertical="top"
            style={styles.textArea}
          />

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

        <View style={styles.separator} />

        <View style={styles.sectionCard}>
          <Text style={styles.historyTitle}>Mis reportes recientes</Text>

          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator color="#0E5A2B" />
            </View>
          ) : misReportes.length === 0 ? (
            <Text style={styles.emptyText}>Aún no has enviado reportes.</Text>
          ) : (
            misReportes.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.reportItem}>
                <View style={styles.reportItemTop}>
                  <Text style={styles.reportItemDate}>
                    {formatDatePretty(item.fecha)}
                  </Text>
                  <Text style={styles.reportItemLocker}>
                    Casillero: {item.noCasillero ?? "N/A"}
                  </Text>
                </View>

                <Text style={styles.reportItemText}>{item.reporte}</Text>
              </View>
            ))
          )}
        </View>
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
    height: 88,
    backgroundColor: "#0E5A2B",
  },

  topGold: {
    height: 58,
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
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 4,
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

  sectionCard: {
    paddingHorizontal: 24,
    paddingVertical: 18,
  },

  separator: {
    height: 1,
    backgroundColor: "#8E8E8E",
  },

  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  label: {
    fontSize: 17,
    color: "#111",
    marginRight: 12,
  },

  smallInput: {
    width: 92,
    height: 36,
    backgroundColor: "#D9D6D6",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111",
  },

  dateInput: {
    flex: 1,
    height: 36,
    backgroundColor: "#D9D6D6",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111",
    marginRight: 10,
  },

  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },

  textArea: {
    minHeight: 180,
    backgroundColor: "#D9D6D6",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111",
  },

  saveButton: {
    marginTop: 26,
    alignSelf: "center",
    minWidth: 170,
    height: 56,
    borderRadius: 22,
    backgroundColor: "#D9D3D3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  historyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
  },

  centerState: {
    paddingVertical: 18,
    alignItems: "center",
  },

  emptyText: {
    color: "#666",
    fontSize: 15,
  },

  reportItem: {
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  reportItemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 10,
  },

  reportItemDate: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9C8600",
  },

  reportItemLocker: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0E5A2B",
  },

  reportItemText: {
    fontSize: 15,
    color: "#111",
    lineHeight: 22,
  },

  bottomGold: {
    height: 50,
    backgroundColor: "#9C8600",
  },

  bottomGreen: {
    height: 35,
    backgroundColor: "#2D7A1F",
  },
});