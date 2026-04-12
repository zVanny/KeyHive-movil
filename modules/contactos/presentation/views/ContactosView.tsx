import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SupabaseAuthRepository } from "../../../auth/infrastructure/repositories/SupabaseAuthRepository";
import { logoutUser } from "../../../auth/application/use-cases/logoutUser";

const { width } = Dimensions.get("window");
const isSmallPhone = width < 380;

type ContactItemProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

function ContactItem({ label, icon, onPress }: ContactItemProps) {
  return (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
      <Text style={styles.contactText}>{label}</Text>
      <View style={styles.iconWrapper}>{icon}</View>
    </TouchableOpacity>
  );
}

export default function ContactosView() {
  const router = useRouter();
  const authRepository = new SupabaseAuthRepository();
  const [menuOpen, setMenuOpen] = useState(false);

  const abrirLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleLogout = async () => {
    await logoutUser(authRepository);
    router.replace("/(auth)/login");
  };

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

            <Text style={styles.headerTitle}>Contactos</Text>

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
          <View style={styles.mainCard}>
            <Text style={styles.title}>Contactos</Text>

            <View style={styles.card}>
              <ContactItem
                label="Facebook"
                icon={<FontAwesome name="facebook" size={24} color="#0E5A2B" />}
                onPress={() =>
                  abrirLink(
                    "https://www.facebook.com/share/1DamGfeiJy/?mibextid=wwXIfr"
                  )
                }
              />

              <ContactItem
                label="Instagram"
                icon={
                  <Ionicons name="logo-instagram" size={24} color="#0E5A2B" />
                }
                onPress={() =>
                  abrirLink(
                    "https://www.instagram.com/soyutim?igsh=a3doeWh2aWcwYjBi"
                  )
                }
              />

              <ContactItem
                label="TikTok"
                icon={<FontAwesome5 name="tiktok" size={22} color="#0E5A2B" />}
                onPress={() =>
                  abrirLink(
                    "https://www.tiktok.com/@soyutim?_r=1&_t=ZS-94f38IObshx"
                  )
                }
              />

              <ContactItem
                label="WhatsApp"
                icon={<FontAwesome name="whatsapp" size={24} color="#0E5A2B" />}
                onPress={() =>
                  abrirLink("https://api.whatsapp.com/send?phone=5212431143063")
                }
              />
            </View>

            <TouchableOpacity
              style={styles.emailBox}
              onPress={() =>
                abrirLink("https://www.utim.edu.mx/servicios_escolares.php")
              }
            >
              <Text style={styles.emailLabel}>SERVICIOS ESCOLARES</Text>
              <Text style={styles.emailText}>
                serviciosescolares@utim.edu.mx
              </Text>
            </TouchableOpacity>
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

  scroll: {
    paddingBottom: 28,
  },

  mainCard: {
    backgroundColor: "#F4F6F8",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 10,
  },

  title: {
    fontSize: isSmallPhone ? 30 : 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 22,
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  contactItem: {
    minHeight: 68,
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  contactText: {
    fontSize: isSmallPhone ? 18 : 20,
    fontWeight: "700",
    color: "#111827",
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EAF3EC",
    alignItems: "center",
    justifyContent: "center",
  },

  emailBox: {
    borderWidth: 1,
    borderColor: "#D8D8D8",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  emailLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#9C8600",
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  emailText: {
    fontSize: isSmallPhone ? 16 : 18,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
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
    backgroundColor: "#0E5A2B",
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