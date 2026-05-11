import { useWebSocket } from '@/context/WebSocketContext';
import { useFocusEffect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GamepadScreen() {
  const { send } = useWebSocket();

  // --- SỬ DỤNG useFocusEffect ĐỂ TỰ ĐỘNG XOAY MÀN HÌNH ---
  useFocusEffect(
    useCallback(() => {
      // Ép xoay ngang khi vào màn hình này
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

      // Ép xoay dọc khi rời khỏi màn hình này
      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, [])
  );
  // --------------------------------------------------------

  const handleKey = (key: string, isDown: boolean) => {
    send({ action: isDown ? 'keydown' : 'keyup', key });
  };

  const DPad = ({ label, k }: { label: string, k: string }) => (
    <TouchableOpacity style={styles.dpadBtn} activeOpacity={0.5}
      onPressIn={() => handleKey(k, true)} onPressOut={() => handleKey(k, false)}>
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.padWrapper}>
        <View style={styles.wasdGroup}>
          <View style={styles.row}><DPad label="W" k="w" /></View>
          <View style={styles.row}>
            <DPad label="A" k="a" />
            <DPad label="S" k="s" />
            <DPad label="D" k="d" />
          </View>
        </View>

        <View style={styles.actionGroup}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e74c3c' }]} activeOpacity={0.5}
            onPressIn={() => handleKey('Shift', true)} onPressOut={() => handleKey('Shift', false)}>
            <Text style={styles.btnText}>CHẠY (Shift)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2ecc71', width: 90, height: 90, borderRadius: 45 }]} activeOpacity={0.5}
            onPressIn={() => handleKey('Space', true)} onPressOut={() => handleKey('Space', false)}>
            <Text style={styles.btnText}>NHẢY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  padWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  wasdGroup: { alignItems: 'center' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  dpadBtn: { width: 65, height: 65, backgroundColor: '#444', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#555' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  actionGroup: { flexDirection: 'row', alignItems: 'flex-end', gap: 20 },
  actionBtn: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }
});