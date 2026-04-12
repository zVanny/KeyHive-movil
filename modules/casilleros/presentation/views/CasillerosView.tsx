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
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCasilleros } from "../../application/use-cases/getCasilleros";
import type {
  Casillero,
  EstadoCasillero,
} from "../../domain/entities/Casillero";
import { SupabaseCasilleroRepository } from "../../infrastructure/repositories/SupabaseCasilleroRepository";

function normalizeEstado(estado?: string): EstadoCasillero {
  if (!estado) return "OCUPADO";

  const clean = estado.trim().toUpperCase();

  if (clean === "DISPONIBLE") return "DISPONIBLE";
  if (clean === "REPARACION" || clean === "MANTENIMIENTO") {
    return "REPARACION";
  }

  return "OCUPADO";
}

function getLockerStatus(item: Casillero) {
  const estado = normalizeEstado(item.estado);

  if (estado === "DISPONIBLE") {
    return {
      label: "Disponible",
      color: "#1E8E3E",
      bg: "#EAF7EE",
      border: "#B9E2C4",
    };
  }

  if (estado === "REPARACION") {
    return {
      label: "Mantenimiento",
      color: "#B78103",
      bg: "#FFF8E1",
      border: "#F0D78A",
    };
  }

  return {
    label: "Ocupado",
    color: "#C62828",
    bg: "#FDECEC",
    border: "#F2B7B7",
  };
}

export default function CasillerosView() {
  const router = useRouter();
  const repository = useMemo(() => new SupabaseCasilleroRepository(), []);
  const { width } = useWindowDimensions();

  const [menuOpen, setMenuOpen] = useState(false);
  const [casilleros, setCasilleros] = useState<Casillero[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLocker, setSelectedLocker] = useState<Casillero | null>(null);

  const columns = 3;
  const horizontalPadding = 32;
  const itemGap = 12;
  const availableWidth = width - horizontalPadding - itemGap * (columns - 1);
  const lockerWidth = availableWidth / columns;

  async function loadCasilleros() {
    try {
      setLoading(true);

      const data = await getCasilleros(repository);

      if (!Array.isArray(data)) {
        throw new Error("La respuesta de casilleros no es un arreglo.");
      }

      const formatted: Casillero[] = data
        .filter((item): item is Casillero => item != null && item.id != null)
        .map((item, index): Casillero => {
          const estadoNormalizado = normalizeEstado(item.estado);

          return {
            id: item.id,
            noCasillero:
              item.noCasillero != null ? item.noCasillero : index + 1,
            area: item.area ?? "",
            planta: item.planta ?? "",
            estado: estadoNormalizado,
            disponible:
              typeof item.disponible === "boolean"
                ? item.disponible
                : estadoNormalizado === "DISPONIBLE",
          };
        })
        .sort((a, b) => Number(a.noCasillero) - Number(b.noCasillero))
        .slice(0, 30);

      setCasilleros(formatted);
    } catch (error) {
      console.error("ERROR AL CARGAR CASILLEROS:", error);

      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los casilleros.";

      Alert.alert("Error", message);
      setCasilleros([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCasilleros();
  }, []);

  const handleSelect = () => {
    if (!selectedLocker) return;

    router.push({
      pathname: "/casilleros/solicitar",
      params: {
        casilleroId: String(selectedLocker.id),
        noCasillero: String(selectedLocker.noCasillero),
      },
    });
  };

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

          <Text style={styles.headerTitle}>Casilleros</Text>

          <View style={styles.iconButton} />
        </View>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Solicitación de Casillero</Text>

        <Text style={styles.subtitle}>
          Elige el casillero que prefieras según su disponibilidad
        </Text>

        <View style={styles.legendCard}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#1E8E3E" }]} />
            <Text style={styles.legendText}>Disponible</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#B78103" }]} />
            <Text style={styles.legendText}>Mantenimiento</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#C62828" }]} />
            <Text style={styles.legendText}>Ocupado</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0B5A35" />
            <Text style={styles.loadingText}>Cargando casilleros...</Text>
          </View>
        ) : casilleros.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="file-tray-outline" size={38} color="#6B7280" />
            <Text style={styles.emptyTitle}>No hay casilleros para mostrar</Text>
            <Text style={styles.emptyText}>
              La consulta está regresando un arreglo vacío o la tabla casilleros
              aún no tiene registros.
            </Text>

            <Pressable style={styles.retryButton} onPress={loadCasilleros}>
              <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {casilleros.map((locker, index) => {
              const isSelected = selectedLocker?.id === locker.id;
              const status = getLockerStatus(locker);
              const marginRight = (index + 1) % columns === 0 ? 0 : itemGap;

              return (
                <Pressable
                  key={String(locker.id)}
                  style={[
                    styles.lockerCard,
                    {
                      width: lockerWidth,
                      marginRight,
                      borderColor: isSelected ? "#0B5A35" : "#D9DDE3",
                    },
                    !locker.disponible && styles.lockerDisabled,
                    isSelected && styles.lockerSelected,
                  ]}
                  onPress={() => {
                    if (locker.disponible) {
                      setSelectedLocker(locker);
                    }
                  }}
                  disabled={!locker.disponible}
                >
                  <View style={styles.lockerTopBar} />

                  <View style={styles.lockerBody}>
                    <Text style={styles.lockerNumber}>
                      {String(locker.noCasillero).padStart(2, "0")}
                    </Text>

                    <View style={styles.handleArea}>
                      <View style={styles.handle} />
                      <View style={styles.handleDot} />
                    </View>

                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: status.bg,
                          borderColor: status.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: status.color },
                        ]}
                      />
                      <Text
                        style={[styles.statusText, { color: status.color }]}
                        numberOfLines={1}
                      >
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#0B5A35"
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.selectedContainer}>
          <Text style={styles.selectedLabel}>Selección actual</Text>
          <Text style={styles.selectedText}>
            {selectedLocker
              ? `Casillero ${selectedLocker.noCasillero}`
              : "Aún no has seleccionado un casillero"}
          </Text>
        </View>

        <Pressable
          style={[
            styles.selectButton,
            !selectedLocker && styles.selectButtonDisabled,
          ]}
          onPress={handleSelect}
          disabled={!selectedLocker}
        >
          <Text style={styles.selectButtonText}>
            Continuar con este casillero
          </Text>
        </Pressable>
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

          <SafeAreaView style={styles.drawerSafeArea} edges={["top", "bottom", "left"]}>
            <View style={styles.drawer}>
              <View style={styles.drawerHeader}>
                <View style={styles.drawerTopRow}>
                  <Text style={styles.drawerTitle}>Menú</Text>

                  <Pressable onPress={() => setMenuOpen(false)}>
                    <Ionicons name="close" size={30} color="#111827" />
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
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 38,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 12,
    lineHeight: 21,
  },

  legendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "700",
  },

  loadingBox: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#4B5563",
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  retryButton: {
    marginTop: 16,
    backgroundColor: "#0B5A35",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  lockerCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  lockerDisabled: {
    opacity: 0.88,
  },

  lockerSelected: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.12,
  },

  lockerTopBar: {
    height: 14,
    backgroundColor: "#D9DDE4",
    borderBottomWidth: 1,
    borderBottomColor: "#C9CED6",
  },

  lockerBody: {
    minHeight: 122,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: "#F3F6F9",
  },

  lockerNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: 0.5,
  },

  handleArea: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },

  handle: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#AAB2BD",
    marginBottom: 4,
  },

  handleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7B8794",
  },

  statusPill: {
    minHeight: 28,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    flexShrink: 1,
  },

  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
  },

  selectedContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  selectedLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "600",
  },

  selectedText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  selectButton: {
    backgroundColor: "#0B5A35",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  selectButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },

  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});