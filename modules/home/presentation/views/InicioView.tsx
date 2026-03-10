import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SupabaseAuthRepository } from "../../../auth/infrastructure/repositories/SupabaseAuthRepository";
import { logoutUser } from "../../../auth/application/use-cases/logoutUser";

export default function InicioView() {
    const router = useRouter();
    const authRepository = new SupabaseAuthRepository();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenidos Venados</Text>

            <Pressable
                style={styles.btn}
                onPress={() => router.push("./casilleros")}
            >
                <Text style={styles.btnText}>Solicitud de casillero</Text>
            </Pressable>

            <Pressable
                style={styles.btn}
                onPress={() => router.push("./casilleros/mi-casillero")}
            >
                <Text style={styles.btnText}>Ver mi casillero</Text>
            </Pressable>

            <Pressable
                style={styles.btn}
                onPress={() => router.push("./reportes")}
            >
                <Text style={styles.btnText}>Reportes</Text>
            </Pressable>

            <Pressable
                style={styles.btn}
                onPress={() => router.push("./contactos")}
            >
                <Text style={styles.btnText}>Contactos</Text>
            </Pressable>
            <View style={{ height: 16 }} />

            <Pressable
                style={[styles.btn, { backgroundColor: "#222" }]}
                onPress={async () => {
                    await logoutUser(authRepository);
                    router.replace("/(auth)/login");
                }}
            >
                <Text style={styles.btnText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F4F4", padding: 16, gap: 10 },
    title: {
        fontSize: 20,
        fontWeight: "800",
        textAlign: "center",
        marginVertical: 12,
    },
    btn: {
        backgroundColor: "#0B3B2E",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    btnText: { color: "white", fontWeight: "800" },
});