import { useWebSocket } from '@/context/WebSocketContext';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PowerScreen() {
  const { send } = useWebSocket();

  const handlePower = (action: string, title: string) => {
    Alert.alert("Cảnh báo", `Bạn có chắc chắn muốn ${title} PC không?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Đồng ý", onPress: () => send({ action: 'power', command: action }), style: 'destructive' }
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.btn, { backgroundColor: '#e74c3c' }]} onPress={() => handlePower('shutdown', 'TẮT MÁY')}>
        <Text style={styles.btnText}>🛑 TẮT MÁY (SHUTDOWN)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: '#f39c12' }]} onPress={() => handlePower('restart', 'KHỞI ĐỘNG LẠI')}>
        <Text style={styles.btnText}>🔄 KHỞI ĐỘNG LẠI (RESTART)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: '#34495e' }]} onPress={() => handlePower('sleep', 'đưa máy vào CHẾ ĐỘ NGỦ')}>
        <Text style={styles.btnText}>🌙 CHẾ ĐỘ NGỦ (SLEEP)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: '#7f8c8d' }]} onPress={() => send({ action: 'shortcut', mod: 'Meta', key: 'l' })}>
        <Text style={styles.btnText}>🔒 KHÓA MÀN HÌNH (LOCK)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center', gap: 20 },
  btn: { padding: 25, borderRadius: 15, alignItems: 'center', borderWidth: 2, borderColor: '#222' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});