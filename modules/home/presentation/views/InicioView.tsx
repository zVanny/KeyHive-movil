import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SupabaseAuthRepository } from "../../../auth/infrastructure/repositories/SupabaseAuthRepository";
import { logoutUser } from "../../../auth/application/use-cases/logoutUser";

const { width } = Dimensions.get("window");
const isSmallPhone = width < 380;

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
        <View style={styles.headerWrap}>
          <View style={styles.topBar}>
            <Pressable
              onPress={() => setMenuOpen(true)}
              style={styles.iconButton}
            >
              <Ionicons name="menu" size={30} color="white" />
            </Pressable>

            <Text style={styles.headerTitle}>Inicio</Text>

            <Pressable style={styles.iconButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="white"
              />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Bienvenidos Venados</Text>

            <Image
              source={require("../../../../assets/images/venadosutim.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.sectionCard}>
              <Text style={styles.section}>Página Oficial UTIM</Text>

              <Pressable
                style={styles.linkCard}
                onPress={() => abrirLink("https://sav.utim.edu.mx/")}
              >
                <View style={styles.linkLeft}>
                  <View style={styles.linkIconCircle}>
                    <Ionicons name="globe-outline" size={22} color="#01563A" />
                  </View>

                  <View style={styles.linkTextBox}>
                    <Text style={styles.linkTitle}>Ir al portal oficial</Text>
                    <Text style={styles.linkSubtitle}>sav.utim.edu.mx</Text>
                  </View>
                </View>

                <Ionicons name="open-outline" size={22} color="#01563A" />
              </Pressable>
            </View>

            <View style={styles.sectionCard}>
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
                <Ionicons name="person-circle" size={54} color="#01563A" />
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

              <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </Pressable>
            </View>
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
    backgroundColor: "#F4F6F8",
  },

  headerWrap: {
    backgroundColor: "#01563A",
    paddingBottom: 10,
  },

  topBar: {
    minHeight: 62,
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: "#B09A1D",
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

  scroll: {
    paddingBottom: 28,
  },

  content: {
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
    marginBottom: 18,
    color: "#0F172A",
  },

  logo: {
    width: isSmallPhone ? 170 : 210,
    height: isSmallPhone ? 150 : 180,
    alignSelf: "center",
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

  section: {
    textAlign: "center",
    fontSize: isSmallPhone ? 18 : 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },

  linkCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  linkTextBox: {
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
    fontSize: isSmallPhone ? 15 : 17,
    fontWeight: "800",
    color: "#111827",
  },

  linkSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  locationCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    padding: 14,
  },

  locationTextBox: {
    marginBottom: 14,
  },

  locationLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#B09A1D",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  locationText: {
    fontSize: isSmallPhone ? 20 : 22,
    fontWeight: "800",
    lineHeight: isSmallPhone ? 28 : 30,
    color: "#111827",
  },

  building: {
    width: "100%",
    height: isSmallPhone ? 160 : 190,
    borderRadius: 14,
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

  logoutBtn: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: "#01563A",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
});