import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type LockerStatus = "DISPONIBLE" | "OCUPADO" | "REPARACION";

type LockerItem = {
  id: number;
  status: LockerStatus;
};

const lockersMock: LockerItem[] = [
  { id: 1, status: "DISPONIBLE" },
  { id: 2, status: "DISPONIBLE" },
  { id: 3, status: "DISPONIBLE" },
  { id: 4, status: "DISPONIBLE" },
  { id: 5, status: "DISPONIBLE" },
  { id: 6, status: "DISPONIBLE" },
  { id: 7, status: "DISPONIBLE" },
  { id: 8, status: "DISPONIBLE" },
  { id: 9, status: "DISPONIBLE" },
  { id: 10, status: "OCUPADO" },
  { id: 11, status: "OCUPADO" },
  { id: 12, status: "REPARACION" },
  { id: 13, status: "DISPONIBLE" },
  { id: 14, status: "OCUPADO" },
  { id: 15, status: "OCUPADO" },
  { id: 16, status: "OCUPADO" },
  { id: 17, status: "REPARACION" },
  { id: 18, status: "OCUPADO" },
  { id: 19, status: "DISPONIBLE" },
  { id: 20, status: "REPARACION" },
  { id: 21, status: "OCUPADO" },
  { id: 22, status: "OCUPADO" },
  { id: 23, status: "REPARACION" },
  { id: 24, status: "DISPONIBLE" },
  { id: 25, status: "OCUPADO" },
  { id: 26, status: "DISPONIBLE" },
  { id: 27, status: "DISPONIBLE" },
  { id: 28, status: "OCUPADO" },
  { id: 29, status: "DISPONIBLE" },
  { id: 30, status: "DISPONIBLE" },
  { id: 31, status: "REPARACION" },
  { id: 32, status: "DISPONIBLE" },
  { id: 33, status: "DISPONIBLE" },
  { id: 34, status: "OCUPADO" },
  { id: 35, status: "DISPONIBLE" },
  { id: 36, status: "DISPONIBLE" },
  { id: 37, status: "DISPONIBLE" },
  { id: 38, status: "DISPONIBLE" },
  { id: 39, status: "DISPONIBLE" },
  { id: 40, status: "REPARACION" },
  { id: 41, status: "DISPONIBLE" },
  { id: 42, status: "DISPONIBLE" },
];

function getDotColor(status: LockerStatus) {
  if (status === "DISPONIBLE") return "#2F912E";
  if (status === "OCUPADO") return "#F14222";
  return "#E5C91A";
}

export default function CasillerosView() {
  const router = useRouter();
  const [selectedLocker, setSelectedLocker] = useState<number | null>(null);

  const lockers = useMemo(() => lockersMock, []);

  const handleSelect = () => {
    if (!selectedLocker) return;

    router.push({
      pathname: "./mi-casillero",
      params: { locker: String(selectedLocker) },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0E5A2B" />

      <View style={styles.topGreen} />

      <View style={styles.topGold}>
        <Pressable style={styles.backButton} onPress={() => router.push("./inicio")}>
          <Ionicons name="chevron-back" size={28} color="white" />
          <Text style={styles.backText}>Inicio</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Solicitación de Casillero</Text>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado del Casillero</Text>

          <View style={styles.legendCard}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#2F912E" }]} />
              <Text style={styles.legendText}>Disponible</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#E5C91A" }]} />
              <Text style={styles.legendText}>Mantenimiento</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#F14222" }]} />
              <Text style={styles.legendText}>Ocupado</Text>
            </View>
          </View>

          <View style={styles.gridWrapper}>
            {lockers.map((locker) => {
              const isSelected = selectedLocker === locker.id;
              const isDisabled = locker.status !== "DISPONIBLE";

              return (
                <Pressable
                  key={locker.id}
                  style={[styles.cell, isSelected && styles.cellSelected]}
                  disabled={isDisabled}
                  onPress={() => setSelectedLocker(locker.id)}
                >
                  <Text style={styles.cellNumber}>{locker.id}</Text>
                  <View
                    style={[
                      styles.cellDot,
                      { backgroundColor: getDotColor(locker.status) },
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.selectedInfo}>
            <Text style={styles.selectedText}>
              {selectedLocker
                ? `Casillero seleccionado: ${selectedLocker}`
                : "Selecciona un casillero disponible"}
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
            <Text style={styles.selectButtonText}>Seleccionar</Text>
          </Pressable>
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
  section: {
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
    marginBottom: 18,
  },
  legendCard: {
    backgroundColor: "#DCD7D7",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  legendText: {
    fontSize: 14,
    color: "#222",
  },
  gridWrapper: {
    borderWidth: 1,
    borderColor: "#1A1A1A",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#DDD1B0",
  },
  cell: {
    width: "16.6666%",
    aspectRatio: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1A1A1A",
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDD1B0",
  },
  cellSelected: {
    backgroundColor: "#C8E6C9",
  },
  cellNumber: {
    position: "absolute",
    top: 8,
    left: 8,
    fontSize: 11,
    color: "#111",
  },
  cellDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  selectedInfo: {
    marginTop: 18,
    alignItems: "center",
  },
  selectedText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  selectButton: {
    marginTop: 24,
    alignSelf: "center",
    minWidth: 190,
    height: 58,
    borderRadius: 22,
    backgroundColor: "#D9D3D3",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  selectButtonDisabled: {
    opacity: 0.6,
  },
  selectButtonText: {
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