import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCasilleros } from "../../application/use-cases/getCasilleros";
import type { Casillero, EstadoCasillero } from "../../domain/entities/Casillero";
import { SupabaseCasilleroRepository } from "../../infrastructure/repositories/SupabaseCasilleroRepository";
            
function normalizeEstado(estado?: string): EstadoCasillero {
  if (!estado) return "OCUPADO";

  const clean = estado.trim().toUpperCase();

  if (clean === "DISPONIBLE") return "DISPONIBLE";
  if (clean === "REPARACION" || clean === "MANTENIMIENTO") return "REPARACION";

  return "OCUPADO";
}

function getLockerStatus(item: Casillero) {
  const estado = normalizeEstado(item.estado);

  if (estado === "DISPONIBLE") {
    return {
      label: "Disponible",
      color: "#1E8E3E",
      bg: "#E9F7EE",
      border: "#B7E2C3",
    };
  }

  if (estado === "REPARACION") {
    return {
      label: "Mantenimiento",
      color: "#B78103",
      bg: "#FFF8E1",
      border: "#F2D98A",
    };
  }

  return {
    label: "Ocupado",
    color: "#C62828",
    bg: "#FDECEC",
    border: "#F3B6B6",
  };
}

export default function CasillerosView() {
  const router = useRouter();
  const repository = useMemo(() => new SupabaseCasilleroRepository(), []);
  const { width } = useWindowDimensions();

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

      console.log("CASILLEROS RAW:", data);

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

      console.log("CASILLEROS FORMATEADOS:", formatted);
      console.log("TOTAL:", formatted.length);

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
      pathname: "/casilleros/mi-casillero",
      params: {
        casilleroId: String(selectedLocker.id),
        noCasillero: String(selectedLocker.noCasillero),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0B5A35" />

      <View style={styles.topGreen} />

      <View style={styles.topGold}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push("/inicio")}
        >
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          <Text style={styles.backText}>Inicio</Text>
        </Pressable>
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
              La consulta está regresando un arreglo vacío o la tabla casilleros aún no tiene registros.
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
                      borderColor: isSelected ? "#0B5A35" : "#D7D7D7",
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
          <Text style={styles.selectButtonText}>Continuar con este casillero</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomGold} />
      <View style={styles.bottomGreen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B5A35",
  },

  topGreen: {
    height: 42,
    backgroundColor: "#0B5A35",
  },

  topGold: {
    height: 50,
    backgroundColor: "#A48B00",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 2,
  },

  main: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 12,
  },

  legendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
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
    fontWeight: "600",
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
    shadowOpacity: 0.07,
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
    backgroundColor: "#EEF1F5",
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
    borderRadius: 16,
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
    marginBottom: 22,
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

  bottomGold: {
    height: 34,
    backgroundColor: "#A48B00",
  },

  bottomGreen: {
    height: 18,
    backgroundColor: "#2E7D1F",
  },
});