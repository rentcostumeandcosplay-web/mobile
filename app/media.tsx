import { useWebSocket } from '@/context/WebSocketContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MediaScreen() {
  const { send } = useWebSocket();
  const press = (key: string) => send({ action: 'keypress', key });

  return (
    <View style={styles.container}>
      <View style={styles.circleControls}>
        <TouchableOpacity style={styles.mediaBtn} onPress={() => press('prevtrack')}><Text style={styles.icon}>⏮</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.mediaBtn, styles.playBtn]} onPress={() => press('playpause')}><Text style={styles.icon}>⏯</Text></TouchableOpacity>
        <TouchableOpacity style={styles.mediaBtn} onPress={() => press('nexttrack')}><Text style={styles.icon}>⏭</Text></TouchableOpacity>
      </View>

      <View style={styles.volControls}>
        <TouchableOpacity style={styles.volBtn} onPress={() => press('volumedown')}><Text style={styles.icon}>🔉 GIẢM ÂM</Text></TouchableOpacity>
        <TouchableOpacity style={styles.volBtn} onPress={() => press('volumeup')}><Text style={styles.icon}>🔊 TĂNG ÂM</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.volBtn, {marginTop: 15, backgroundColor: '#c0392b'}]} onPress={() => press('volumemute')}>
        <Text style={styles.icon}>🔇 TẮT / MỞ TIẾNG (MUTE)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 20 },
  circleControls: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 60 },
  mediaBtn: { backgroundColor: '#333', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#2980b9' },
  icon: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  volControls: { flexDirection: 'row', gap: 15 },
  volBtn: { flex: 1, backgroundColor: '#444', padding: 25, borderRadius: 15, alignItems: 'center' }
});