import { WebSocketProvider } from '@/context/WebSocketContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <WebSocketProvider>
      <Stack>
        {/* 5 Tab chính thì ẩn thanh tiêu đề trên cùng */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* 4 Màn hình phụ thì hiện thanh tiêu đề để có nút Back */}
        <Stack.Screen name="power" options={{ title: 'Điều khiển Nguồn', headerStyle: { backgroundColor: '#111' }, headerTintColor: '#fff' }} />
        <Stack.Screen name="media" options={{ title: 'Giải trí', headerStyle: { backgroundColor: '#111' }, headerTintColor: '#fff' }} />
        <Stack.Screen name="numpad" options={{ title: 'Bàn phím số', headerStyle: { backgroundColor: '#111' }, headerTintColor: '#fff' }} />
        <Stack.Screen name="gamepad" options={{ title: 'Tay cầm Game', headerStyle: { backgroundColor: '#111' }, headerTintColor: '#fff' }} />
      </Stack>
    </WebSocketProvider>
  );
}