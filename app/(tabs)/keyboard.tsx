import { useWebSocket } from '@/context/WebSocketContext';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function KeyboardScreen() {
  const { send, connected } = useWebSocket();
  const inputRef = useRef<TextInput>(null);
  const [altHolding, setAltHolding] = useState(false);

  // Mẹo để gọi bàn phím ảo của điện thoại mà không bị kẹt
  const openKeyboard = () => {
    inputRef.current?.blur();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (!connected) {
    return (
      <View style={styles.center}>
        <Text style={styles.warningText}>Vui lòng kết nối PC ở trang chủ trước.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BÀN PHÍM & PHÍM TẮT</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Phím tắt cơ bản */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.mainBtn, {backgroundColor: '#2980b9'}]} onPress={() => send({action:'shortcut', mod:'Control', key:'c'})}>
            <Text style={styles.btnText}>📄 COPY (Ctrl+C)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mainBtn, {backgroundColor: '#8e44ad'}]} onPress={() => send({action:'shortcut', mod:'Control', key:'v'})}>
            <Text style={styles.btnText}>📋 PASTE (Ctrl+V)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.mainBtn, altHolding ? {backgroundColor:'#f39c12'} : {backgroundColor: '#34495e'}]}
            onPress={() => { send({action:'alt_tab_step'}); setAltHolding(true); }}>
            <Text style={styles.btnText}>⇥ ALT+TAB</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mainBtn, {backgroundColor: '#27ae60'}]} onPress={openKeyboard}>
            <Text style={styles.btnText}>⌨️ GÕ CHỮ</Text>
          </TouchableOpacity>
        </View>

        {altHolding && (
           <TouchableOpacity style={styles.relBtn} onPress={() => { send({action:'release_alt'}); setAltHolding(false); }}>
             <Text style={styles.btnText}>NHẢ ALT (CHỌN TAB NÀY)</Text>
           </TouchableOpacity>
        )}

        {/* Cụm phím chức năng */}
        <View style={styles.grid}>
          <TouchableOpacity style={[styles.miniBtn, {width: '48%', backgroundColor: '#c0392b'}]} onPress={() => send({action:'keypress', key:'Escape'})}>
            <Text style={styles.miniBtnText}>ESC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.miniBtn, {width: '48%', backgroundColor: '#34495e'}]} onPress={() => send({action:'keypress', key:'Enter'})}>
            <Text style={styles.miniBtnText}>ENTER</Text>
          </TouchableOpacity>
          
          {['Up','Down','Left','Right','Backspace','Space','Meta','PrtSc'].map(k => (
            <TouchableOpacity key={k} style={styles.miniBtn} onPress={() => send({action:'keypress', key:k})}>
              <Text style={styles.miniBtnText}>{k==='Meta'?'WIN':k==='Space'?'SPACE':k.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Input ẩn để hứng sự kiện gõ từ bàn phím điện thoại */}
      <TextInput
        ref={inputRef}
        style={{height:0, width:0, opacity:0, position:'absolute'}}
        autoCorrect={false}
        value=""
        onChangeText={(t) => { if(t) send({action:'keypress', key: t.slice(-1)}) }}
        onKeyPress={({nativeEvent}) => { if(nativeEvent.key === 'Backspace') send({action:'keypress', key:'Backspace'}); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15, paddingTop: 40 },
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  warningText: { color: '#e74c3c', fontSize: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  scroll: { flex: 1 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  mainBtn: { flex: 1, height: 60, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  relBtn: { backgroundColor: '#e67e22', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: '4%', justifyContent: 'flex-start' },
  miniBtn: { width: '30%', backgroundColor: '#222', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  miniBtnText: { color: '#aaa', fontSize: 12, fontWeight: 'bold' }
});