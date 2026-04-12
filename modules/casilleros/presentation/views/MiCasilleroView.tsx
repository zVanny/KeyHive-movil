import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { darDeBajaMiCasillero } from "../../application/use-cases/darDeBajaMiCasillero";
import { getMiCasillero } from "../../application/use-cases/getMiCasillero";
import type { MiCasillero } from "../../domain/entities/Casillero";
import { SupabaseCasilleroRepository } from "../../infrastructure/repositories/SupabaseCasilleroRepository";

function formatDate(value: string | null) {
  if (!value) return "--/--/----";
  const [yyyy, mm, dd] = value.split("-");
  if (!yyyy || !mm || !dd) return value;
  return `${dd}/${mm}/${yyyy}`;
}

function getStatusConfig(status: string) {
  if (status === "ASIGNADO") {
    return {
      label: "Asignado",
      bg: "#E8F5E9",
      color: "#1B5E20",
      border: "#B7DFC0",
      icon: "checkmark-circle" as const,
    };
  }

  return {
    label: "Pendiente",
    bg: "#FFF8E1",
    color: "#8A5A00",
    border: "#E8D69A",
    icon: "time" as const,
  };
}

export default function MiCasilleroView() {
  const router = useRouter();
  const repository = useMemo(() => new SupabaseCasilleroRepository(), []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [miCasillero, setMiCasillero] = useState<MiCasillero | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);

  async function loadMiCasillero() {
    try {
      setLoading(true);
      const data = await getMiCasillero(repository);
      setMiCasillero(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo consultar tu casillero.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMiCasillero();
  }, []);

  async function confirmDarDeBaja() {
    Alert.alert(
      "Dar de baja casillero",
      "¿Seguro que quieres dar de baja tu casillero? Esta acción cancelará tu solicitud o liberará tu casillero actual.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, dar de baja",
          style: "destructive",
          onPress: async () => {
            try {
              setRemoving(true);
              await darDeBajaMiCasillero(repository);
              setMiCasillero(null);

              Alert.alert(
                "Listo",
                "Tu casillero fue dado de baja correctamente."
              );
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "No se pudo dar de baja el casillero.";
              Alert.alert("Error", message);
            } finally {
              setRemoving(false);
            }
          },
        },
      ]
    );
  }

  const statusConfig = miCasillero
    ? getStatusConfig(miCasillero.estado)
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="light" backgroundColor="#074F2A" />

      <View style={styles.headerWrap}>
        <View style={styles.goldBar}>
          <Pressable
            onPress={() => setMenuOpen(true)}
            style={styles.iconButton}
          >
            <Ionicons name="menu" size={30} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.headerTitle}>Mi Casillero</Text>

          <View style={styles.iconButton} />
        </View>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Mi casillero</Text>
        <Text style={styles.subtitle}>
          Consulta el estado actual de tu solicitud o tu casillero asignado
        </Text>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#0E5A2B" />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        ) : !miCasillero ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="file-tray-outline" size={42} color="#6B7280" />
            </View>

            <Text style={styles.emptyTitle}>No tienes un casillero activo</Text>
            <Text style={styles.emptyText}>
              Todavía no tienes una solicitud pendiente ni un casillero asignado.
            </Text>

            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push("/casilleros")}
            >
              <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Solicitar casillero</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>#{miCasillero.noCasillero}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: statusConfig?.bg,
                    borderColor: statusConfig?.border,
                  },
                ]}
              >
                <Ionicons
                  name={statusConfig?.icon ?? "time"}
                  size={16}
                  color={statusConfig?.color ?? "#111"}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: statusConfig?.color ?? "#111" },
                  ]}
                >
                  {statusConfig?.label}
                </Text>
              </View>
            </View>

            <View style={styles.lockerCard}>
              <View style={styles.lockerBox}>
                <View style={styles.lockerTopBar} />

                <View style={styles.lockerInner}>
                  <Text style={styles.lockerNumber}>
                    {String(miCasillero.noCasillero).padStart(2, "0")}
                  </Text>

                  <View style={styles.handleArea}>
                    <View style={styles.handleHorizontal} />
                    <View style={styles.handleDot} />
                  </View>

                  <View
                    style={[
                      styles.statusPillLarge,
                      {
                        backgroundColor: statusConfig?.bg,
                        borderColor: statusConfig?.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusConfig?.color ?? "#111" },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusPillLargeText,
                        { color: statusConfig?.color ?? "#111" },
                      ]}
                    >
                      {statusConfig?.label}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Área</Text>
                <Text style={styles.infoValue}>{miCasillero.area}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Planta</Text>
                <Text style={styles.infoValue}>{miCasillero.planta}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha</Text>
                <Text style={styles.infoValue}>
                  {formatDate(miCasillero.fechaInicio)} -{" "}
                  {formatDate(miCasillero.fechaFin)}
                </Text>
              </View>

              <View style={styles.infoRowLast}>
                <Text style={styles.infoLabel}>Estado</Text>
                <Text style={styles.infoValue}>{miCasillero.estado}</Text>
              </View>
            </View>

            <Pressable
              style={[styles.dangerButton, removing && styles.disabledButton]}
              onPress={confirmDarDeBaja}
              disabled={removing}
            >
              {removing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.dangerButtonText}>Dar de baja</Text>
                </>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.overlay}
            onPress={() => setMenuOpen(false)}
          />

          <SafeAreaView
            style={styles.drawerSafeArea}
            edges={["top", "bottom", "left"]}
          >
            <View style={styles.drawer}>
              <View style={styles.drawerHeader}>
                <View style={styles.drawerTopRow}>
                  <Text style={styles.drawerTitle}>Menú</Text>

                  <Pressable
                    onPress={() => setMenuOpen(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={28} color="#111827" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.userSection}>
                <Ionicons name="person-circle" size={54} color="#074F2A" />
                <Text style={styles.userText}>Usuario</Text>
              </View>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/inicio");
                }}
              >
                <Ionicons name="home-outline" size={22} color="#111827" />
                <Text style={styles.menuText}>Inicio</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/contactos");
                }}
              >
                <Ionicons name="call-outline" size={22} color="#111827" />
                <Text style={styles.menuText}>Contactos</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/casilleros");
                }}
              >
                <Ionicons name="cube-outline" size={22} color="#111827" />
                <Text style={styles.menuText}>Solicitación de Casillero</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/casilleros/mi-casillero");
                }}
              >
                <Ionicons
                  name="file-tray-full-outline"
                  size={22}
                  color="#111827"
                />
                <Text style={styles.menuText}>Ver mi Casillero</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/reportes");
                }}
              >
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#111827"
                />
                <Text style={styles.menuText}>Reportes</Text>
              </Pressable>

              <View style={styles.drawerSpacer} />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#074F2A",
  },

  headerWrap: {
    backgroundColor: "#074F2A",
    paddingBottom: 10,
  },

  goldBar: {
    marginHorizontal: 14,
    backgroundColor: "#8B7400",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 40,
    height: 40,
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
    backgroundColor: "#F4F4F6",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },

  centerState: {
    paddingTop: 80,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  emptyIconWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  numberBadge: {
    minWidth: 160,
    height: 62,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    marginBottom: 14,
  },

  numberText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111827",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  statusBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
  },

  lockerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 26,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  lockerBox: {
    width: 230,
    height: 280,
    backgroundColor: "#F3F6F9",
    borderWidth: 2,
    borderColor: "#D9DDE3",
    borderRadius: 18,
    overflow: "hidden",
  },

  lockerTopBar: {
    height: 18,
    backgroundColor: "#D9DDE4",
    borderBottomWidth: 1,
    borderBottomColor: "#C9CED6",
  },

  lockerInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 26,
    paddingBottom: 22,
    paddingHorizontal: 16,
  },

  lockerNumber: {
    fontSize: 44,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: 1,
  },

  handleArea: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },

  handleHorizontal: {
    width: 44,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#AAB2BD",
    marginBottom: 8,
  },

  handleDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#7B8794",
  },

  statusPillLarge: {
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  statusPillLargeText: {
    fontSize: 15,
    fontWeight: "800",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  infoRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  infoRowLast: {
    paddingVertical: 16,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  infoValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  primaryButton: {
    height: 54,
    minWidth: 220,
    borderRadius: 18,
    backgroundColor: "#0E5A2B",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 22,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
  },

  dangerButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#C62828",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 22,
    marginBottom: 20,
  },

  dangerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
  },

  disabledButton: {
    opacity: 0.7,
  },

  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  drawerSafeArea: {
    width: "80%",
    maxWidth: 330,
    height: "100%",
  },

  drawer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 4, height: 0 },
    elevation: 12,
  },

  drawerHeader: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  drawerTopRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  drawerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  userSection: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
    backgroundColor: "#FFFFFF",
  },

  menuText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },

  drawerSpacer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});