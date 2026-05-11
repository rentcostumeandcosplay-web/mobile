import { useWebSocket } from '@/context/WebSocketContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NumpadScreen() {
  const { send } = useWebSocket();
  const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'Enter', '+'];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {keys.map((k) => (
          <TouchableOpacity key={k} style={[styles.keyBtn, k === 'Enter' && styles.enterBtn]} 
            onPress={() => send({ action: 'keypress', key: k })}>
            <Text style={styles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15, justifyContent: 'flex-end', paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  keyBtn: { width: '23%', aspectRatio: 1, backgroundColor: '#222', marginBottom: '2.5%', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  enterBtn: { backgroundColor: '#27ae60' },
  keyText: { color: '#fff', fontSize: 32, fontWeight: 'bold' }
});