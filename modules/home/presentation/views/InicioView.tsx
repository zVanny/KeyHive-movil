import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
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

  return (
    <View style={styles.screen}>
      
      <View style={styles.topGreen} />

      <View style={styles.topBar}>
        <Pressable onPress={() => setMenuOpen(true)}>
          <Ionicons name="menu" size={34} color="white" />
        </Pressable>

        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Bienvenidos Venados</Text>

        <Image
          source={require("../../../../assets/images/venadosutim.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.separator} />

        <Text style={styles.section}>Pagina Oficial UTIM:</Text>

        <View style={styles.separator} />

        <Text style={styles.section}>Donde nos encontramos:</Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationText}>
            Académico 1{"\n"}Planta Alta
          </Text>

          <Image
            source={require("../../../../assets/images/Acade1.jpg")}
            style={styles.building}
            resizeMode="cover"
          />
        </View>
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
              <Text style={styles.menuText}>Solicitar Casillero</Text>
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
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#EDEDED"
  },

  topGreen: {
    height: 100,
    backgroundColor: "#01563A"
  },

  topBar: {
    height: 70,
    backgroundColor: "#B09A1D",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24
  },

  content: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 26,
    paddingTop: 24
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16
  },

  logo: {
    width: 200,
    height: 180,
    alignSelf: "center",
    marginBottom: 12
  },

  separator: {
    height: 1,
    backgroundColor: "#777",
    marginVertical: 18
  },

  section: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800"
  },

  locationRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  locationText: {
    fontSize: 22,
    fontWeight: "800",
    width: "40%",
    lineHeight: 28
  },

  building: {
    width: 220,
    height: 140,
    borderRadius: 6
  },

  bottomGold: {
    height: 50,
    backgroundColor: "#B09A1D"
  },

  bottomGreen: {
    height: 45,
    backgroundColor: "#2F7B1F"
  },

  drawerWrapper: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row"
  },

  drawer: {
    width: "60%",
    backgroundColor: "#F2F2F2",
    borderRightWidth: 1,
    borderRightColor: "#BBB"
  },

  drawerHeader: {
    marginTop: 100,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#BBB"
  },

  userSection: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#BBB"
  },

  userText: {
    marginTop: 6,
    fontSize: 16
  },

  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderBottomWidth: 1,
    borderBottomColor: "#BBB"
  },

  menuText: {
    fontSize: 17
  },

  logoutBtn: {
    alignSelf: "center",
    marginBottom: 30,
    backgroundColor: "#6A6A6A",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28
  },

  logoutText: {
    color: "white",
    fontWeight: "800"
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)"
  }

});