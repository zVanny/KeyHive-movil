import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const abrirLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0E5A2B" />

    
      <View style={styles.topGreen} />
      <View style={styles.topGold} />

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
              icon={<Ionicons name="logo-instagram" size={24} color="#0E5A2B" />}
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
    height: 40,
    backgroundColor: "#9C8600",
  },

  main: {
    flex: 1,
    backgroundColor: "#ECECEC",
  },

  scroll: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
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
  },

  bottomGold: {
    height: 50,
    backgroundColor: "#9C8600",
  },

  bottomGreen: {
    height: 35,
    backgroundColor: "#2D7A1F",
  },
});