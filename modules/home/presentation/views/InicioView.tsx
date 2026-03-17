import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SupabaseAuthRepository } from "../../../auth/infrastructure/repositories/SupabaseAuthRepository";
import { logoutUser } from "../../../auth/application/use-cases/logoutUser";

export default function InicioView() {
  const router = useRouter();
  const authRepository = new SupabaseAuthRepository();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser(authRepository);
    router.replace("/(auth)/login");
  };

  const abrirLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar style="light" backgroundColor="#01563A" />

      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topGreen} />

          <View style={styles.topBar}>
            <Pressable onPress={() => setMenuOpen(true)}>
              <Ionicons name="menu" size={34} color="white" />
            </Pressable>

            <Ionicons
              name="notifications-outline"
              size={28}
              color="white"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Bienvenidos Venados</Text>

            <Image
              source={require("../../../../assets/images/venadosutim.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.separator} />

            <Text style={styles.section}>Página Oficial UTIM</Text>

            <Pressable
              style={styles.linkCard}
              onPress={() => abrirLink("https://sav.utim.edu.mx/")}
            >
              <View style={styles.linkLeft}>
                <View style={styles.linkIconCircle}>
                  <Ionicons name="globe-outline" size={22} color="#01563A" />
                </View>

                <View>
                  <Text style={styles.linkTitle}>Ir al portal oficial</Text>
                  <Text style={styles.linkSubtitle}>sav.utim.edu.mx</Text>
                </View>
              </View>

              <Ionicons name="open-outline" size={22} color="#01563A" />
            </Pressable>

            <View style={styles.separator} />

            <Text style={styles.section}>Dónde nos encontramos</Text>

            <View style={styles.locationCard}>
              <View style={styles.locationTextBox}>
                <Text style={styles.locationLabel}>Ubicación</Text>
                <Text style={styles.locationText}>
                  Académico 1{"\n"}Planta Alta
                </Text>
              </View>

              <Image
                source={require("../../../../assets/images/Acade1.jpg")}
                style={styles.building}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.bottomGold} />
          <View style={styles.bottomGreen} />
        </ScrollView>

        {menuOpen && (
          <View style={styles.drawerWrapper}>
            <View style={styles.drawer}>
              <View style={styles.drawerHeader}>
                <Pressable onPress={() => setMenuOpen(false)}>
                  <Ionicons name="close" size={32} color="#111" />
                </Pressable>
              </View>

              <View style={styles.userSection}>
                <Ionicons name="person-circle" size={52} color="#111" />
                <Text style={styles.userText}>Usuario</Text>
              </View>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("./inicio");
                }}
              >
                <Text style={styles.menuText}>Inicio</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("./contactos");
                }}
              >
                <Text style={styles.menuText}>Contactos</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("./casilleros");
                }}
              >
                <Text style={styles.menuText}>Solicitación de Casillero</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("./reportes");
                }}
              >
                <Text style={styles.menuText}>Reportes</Text>
              </Pressable>

              <View style={{ flex: 1 }} />

              <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.overlay}
              onPress={() => setMenuOpen(false)}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#01563A",
  },

  screen: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },

  scroll: {
    flexGrow: 1,
  },

  topGreen: {
    height: 90,
    backgroundColor: "#01563A",
  },

  topBar: {
    height: 64,
    backgroundColor: "#B09A1D",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  content: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 18,
    color: "#111",
  },

  logo: {
    width: 190,
    height: 170,
    alignSelf: "center",
    marginBottom: 14,
  },

  separator: {
    height: 1,
    backgroundColor: "#8A8A8A",
    marginVertical: 18,
  },

  section: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 14,
  },

  linkCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  linkIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EAF3EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  linkTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111",
  },

  linkSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  locationCard: {
    marginTop: 4,
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  locationTextBox: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B09A1D",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  locationText: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 30,
    color: "#111",
  },

  building: {
    width: 170,
    height: 120,
    borderRadius: 12,
  },

  bottomGold: {
    height: 46,
    backgroundColor: "#B09A1D",
  },

  bottomGreen: {
    height: 40,
    backgroundColor: "#2F7B1F",
  },

  drawerWrapper: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },

  drawer: {
    width: "70%",
    backgroundColor: "#F2F2F2",
    borderRightWidth: 1,
    borderRightColor: "#BBB",
  },

  drawerHeader: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#BBB",
    backgroundColor: "#F2F2F2",
  },

  userSection: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#BBB",
  },

  userText: {
    marginTop: 6,
    fontSize: 16,
    color: "#111",
  },

  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderBottomWidth: 1,
    borderBottomColor: "#BBB",
  },

  menuText: {
    fontSize: 17,
    color: "#111",
  },

  logoutBtn: {
    alignSelf: "center",
    marginBottom: 30,
    backgroundColor: "#6A6A6A",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },

  logoutText: {
    color: "white",
    fontWeight: "800",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
});