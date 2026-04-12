import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
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
import { useRouter } from "expo-router";
import { createReport } from "../../application/use-cases/createReport";
import { SupabaseReporteRepository } from "../../infrastructure/repositories/SupabaseReporteRepository";
import type { Reporte } from "../../domain/entities/Reporte";
import { getReports } from "../../application/use-cases/getReportes";

const { width } = Dimensions.get("window");
const isSmallPhone = width < 380;

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

  const [menuOpen, setMenuOpen] = useState(false);

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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="light" backgroundColor="#0E5A2B" />

      <View style={styles.screen}>
        <View style={styles.headerWrap}>
          <View style={styles.topBar}>
            <Pressable
              onPress={() => setMenuOpen(true)}
              style={styles.iconButton}
            >
              <Ionicons name="menu" size={30} color="white" />
            </Pressable>

            <Text style={styles.headerTitle}>Reportes</Text>

            <View style={styles.iconButton} />
          </View>
        </View>

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainCard}>
            <Text style={styles.title}>Bandeja de Reportes</Text>

            <View style={styles.sectionCard}>
              <View style={styles.fieldRow}>
                <Text style={styles.label}>No. Casillero</Text>
                <TextInput
                  value={noCasillero}
                  onChangeText={setNoCasillero}
                  keyboardType="numeric"
                  placeholder="..."
                  placeholderTextColor="#8B8B8B"
                  style={styles.smallInput}
                />
              </View>

              <View style={styles.fieldColumn}>
                <View style={styles.rowLabel}>
                  <Text style={styles.label}>Fecha</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#6B7280"
                  />
                </View>

                <TextInput
                  value={fecha}
                  onChangeText={setFecha}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#8B8B8B"
                  style={styles.dateInput}
                />
              </View>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.sectionTitle}>Reporte</Text>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#6B7280"
                />
              </View>

              <TextInput
                value={reporte}
                onChangeText={setReporte}
                placeholder="Escribe aquí el motivo del reporte..."
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
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </>
                )}
              </Pressable>
            </View>

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
          </View>
        </ScrollView>

        {menuOpen && (
          <View style={styles.drawerWrapper}>
            <Pressable
              style={styles.overlay}
              onPress={() => setMenuOpen(false)}
            />

            <View style={styles.drawer}>
              <View style={styles.drawerHeader}>
                <View style={styles.drawerTopRow}>
                  <Text style={styles.drawerTitle}>Menú</Text>

                  <Pressable onPress={() => setMenuOpen(false)}>
                    <Ionicons name="close" size={30} color="#111" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.userSection}>
                <Ionicons name="person-circle" size={54} color="#0E5A2B" />
                <Text style={styles.userText}>Usuario</Text>
              </View>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/inicio");
                }}
              >
                <Ionicons name="home-outline" size={20} color="#111" />
                <Text style={styles.menuText}>Inicio</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/contactos");
                }}
              >
                <Ionicons name="call-outline" size={20} color="#111" />
                <Text style={styles.menuText}>Contactos</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/casilleros");
                }}
              >
                <Ionicons name="cube-outline" size={20} color="#111" />
                <Text style={styles.menuText}>Solicitación de Casillero</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/casilleros/mi-casillero");
                }}
              >
                <Ionicons name="file-tray-full-outline" size={20} color="#111" />
                <Text style={styles.menuText}>Ver mi Casillero</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/reportes");
                }}
              >
                <Ionicons name="document-text-outline" size={20} color="#111" />
                <Text style={styles.menuText}>Reportes</Text>
              </Pressable>

              <View style={styles.drawerSpacer} />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0E5A2B",
  },

  screen: {
    flex: 1,
    backgroundColor: "#F4F6F8",
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  iconButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  main: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  scrollContent: {
    paddingBottom: 28,
  },

  mainCard: {
    backgroundColor: "#F4F6F8",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 8,
  },

  title: {
    fontSize: isSmallPhone ? 28 : 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#0F172A",
    marginBottom: 18,
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

  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },

  fieldColumn: {
    gap: 8,
  },

  rowLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  smallInput: {
    width: 96,
    height: 42,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  dateInput: {
    width: "100%",
    minHeight: 42,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },

  textArea: {
    minHeight: 170,
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  saveButton: {
    marginTop: 18,
    alignSelf: "center",
    minWidth: 170,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#0E5A2B",
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
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  historyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  centerState: {
    paddingVertical: 18,
    alignItems: "center",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 15,
  },

  reportItem: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
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
    fontSize: 13,
    fontWeight: "800",
    color: "#9C8600",
  },

  reportItemLocker: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0E5A2B",
  },

  reportItemText: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 21,
  },

  drawerWrapper: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.78,
    maxWidth: 320,
    backgroundColor: "#F8FAFC",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 3, height: 0 },
    elevation: 10,
  },

  drawerHeader: {
    paddingTop: 22,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  drawerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  drawerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  userSection: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  userText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },

  drawerSpacer: {
    flex: 1,
  },
});