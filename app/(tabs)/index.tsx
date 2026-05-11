import { useWebSocket } from "@/context/WebSocketContext";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConnectionScreen() {
  // Lấy các state và hàm từ Context ra để dùng
  const { ip, setIp, connected, status, isScanning, connect, scanNetwork } =
    useWebSocket();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={{ fontSize: 60, marginBottom: 10 }}>
          {connected ? "📶" : "📡"}
        </Text>
        <Text style={styles.statusText}>{status}</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={ip}
            onChangeText={setIp}
            placeholder="Nhập IP (VD: 192.168.1.101)"
            placeholderTextColor="#666"
            keyboardType="numeric"
            editable={!connected}
          />
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[
              styles.btn,
              connected ? styles.btnConnected : styles.btnConnect,
            ]}
            onPress={connect}
          >
            <Text style={styles.btnText}>
              {connected ? "CẬP NHẬT IP" : "KẾT NỐI"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnScan]}
            onPress={scanNetwork}
            disabled={isScanning || connected}
          >
            {isScanning ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>DÒ TÌM PC</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#111",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  statusText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 5,
    marginBottom: 30,
    fontWeight: "bold",
  },
  inputGroup: { width: "100%", marginBottom: 20 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
    textAlign: "center",
  },
  btnRow: { flexDirection: "row", gap: 10, width: "100%" },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnConnect: { backgroundColor: "#2980b9" },
  btnConnected: { backgroundColor: "#e67e22" },
  btnScan: { backgroundColor: "#27ae60" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
