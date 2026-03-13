import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
<<<<<<< HEAD
import { Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logoutUser } from "../../../auth/application/use-cases/logoutUser";
import { SupabaseAuthRepository } from "../../../auth/infrastructure/repositories/SupabaseAuthRepository";
=======
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SupabaseAuthRepository } from "../../../auth/infrastructure/repositories/SupabaseAuthRepository";
import { logoutUser } from "../../../auth/application/use-cases/logoutUser";
>>>>>>> c5f22d07a2d9a2248d3c9eb3e9caef59f628673d

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

      <View style={styles.topGreen} />

      <View style={styles.topGold}>
        <Pressable onPress={() => setMenuOpen(true)}>
          <Ionicons name="menu" size={34} color="white" />
        </Pressable>

        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>

      <View style={styles.main}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
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
              label="Tik tok"
              icon={<FontAwesome5 name="tiktok" size={22} color="#0E5A2B" />}
              onPress={() =>
                abrirLink(
                  "https://www.tiktok.com/@soyutim?_r=1&_t=ZS-94f38IObshx"
                )
              }
            />

            <ContactItem
              label="Whatsapp"
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
        </ScrollView>
      </View>

      <View style={styles.bottomGold} />
      <View style={styles.bottomGreen} />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0E5A2B",
  },

  topGreen: {
    height: 60,
    backgroundColor: "#0E5A2B",
  },

  topGold: {
    height: 64,
    backgroundColor: "#9C8600",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  main: {
    flex: 1,
    backgroundColor: "#ECECEC",
  },

  scroll: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    flexGrow: 1,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 30,
    color: "#111",
  },

  card: {
    backgroundColor: "#F7F7F7",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  contactItem: {
    minHeight: 70,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  contactText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
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
    backgroundColor: "#F8F8F8",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  emailLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9C8600",
    marginBottom: 4,
  },

  emailText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
  },

  bottomGold: {
    height: 50,
    backgroundColor: "#9C8600",
  },

  bottomGreen: {
    height: 35,
    backgroundColor: "#2D7A1F",
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
    paddingTop: 60,
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