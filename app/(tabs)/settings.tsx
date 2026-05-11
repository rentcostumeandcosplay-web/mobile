import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  // Danh sách 4 màn hình mở rộng
  const menuItems = [
    { name: 'ĐIỀU KHIỂN NGUỒN', desc: 'Tắt máy, Khởi động lại, Ngủ', icon: '⚡', route: '/power', color: '#e74c3c' },
    { name: 'ĐIỀU KHIỂN GIẢI TRÍ', desc: 'YouTube, Spotify, Âm lượng', icon: '🎵', route: '/media', color: '#8e44ad' },
    { name: 'BÀN PHÍM SỐ', desc: 'Nhập liệu Excel siêu tốc', icon: '🔠', route: '/numpad', color: '#27ae60' },
    { name: 'TAY CẦM GAME', desc: 'Chơi game nhẹ nhàng', icon: '🎮', route: '/gamepad', color: '#d35400' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CÔNG CỤ MỞ RỘNG</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.card, { borderLeftColor: item.color }]} 
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrow}>❯</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>💡 Cài đặt độ nhạy chuột và mức độ thu phóng màn hình đã được tích hợp trực tiếp vào màn hình Chuột và Màn hình để bạn tiện điều chỉnh.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, paddingTop: 50 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  card: { flexDirection: 'row', backgroundColor: '#111', padding: 15, borderRadius: 12, marginBottom: 15, alignItems: 'center', borderLeftWidth: 5, borderWidth: 1, borderColor: '#222' },
  iconContainer: { width: 50, height: 50, backgroundColor: '#222', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  icon: { fontSize: 24 },
  textContainer: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { color: '#888', fontSize: 12 },
  arrow: { color: '#555', fontSize: 20, fontWeight: 'bold' },
  infoBox: { marginTop: 30, backgroundColor: 'rgba(41, 128, 185, 0.1)', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(41, 128, 185, 0.3)' },
  infoText: { color: '#7abced', fontSize: 13, lineHeight: 20 }
});