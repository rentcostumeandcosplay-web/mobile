import { useWebSocket } from '@/context/WebSocketContext';
import { useFocusEffect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function StreamScreen() {
  const { ip, connected, zoom, setZoom, send, sensitivity } = useWebSocket();
  const [isLoading, setIsLoading] = useState(true);
  
  // State dùng để hiển thị lên UI
  const [mode, setModeState] = useState<'mouse' | 'pan'>('mouse');
  // Két sắt (Ref) dùng để đưa vào PanResponder mà không bị lưu cache cũ
  const modeRef = useRef<'mouse' | 'pan'>('mouse');
  
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);

  // Hàm chuyển đổi chế độ (Cập nhật cả UI lẫn két sắt)
  const toggleMode = () => {
    const newMode = mode === 'mouse' ? 'pan' : 'mouse';
    setModeState(newMode);
    modeRef.current = newMode;
  };

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, [])
  );

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      // ĐỌC TỪ modeRef.current THAY VÌ mode
      if (modeRef.current === 'mouse') {
        longPressTimer.current = setTimeout(() => {
          isDraggingRef.current = true;
          setIsDragging(true);
          send({ action: 'drag_start' });
        }, 500);
      }
      lastPos.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
    },
    onPanResponderMove: (evt, gesture) => {
      const touches = evt.nativeEvent.touches;

      // ĐỌC TỪ modeRef.current
      if (modeRef.current === 'pan') {
        if (touches.length === 1) {
          // 1. Lấy vận tốc vuốt của ngón tay (Velocity)
          const velocity = Math.abs(gesture.vx) + Math.abs(gesture.vy);
          
          // 2. Tính hệ số gia tốc (Vuốt càng nhanh, số càng lớn)
          // Bạn có thể chỉnh số 0.8 to lên nếu muốn chuột bay nhanh hơn nữa
          const acceleration = 1 + (velocity * 0.8); 

          // 3. Nhân quãng đường với Độ nhạy và Gia tốc
          const dx = (evt.nativeEvent.pageX - lastPos.current.x) * sensitivity * acceleration;
          const dy = (evt.nativeEvent.pageY - lastPos.current.y) * sensitivity * acceleration;
          
          send({ action: 'move', dx, dy });
        }
      } 
      else {
        if (!isDraggingRef.current && (Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10)) {
          if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
        }

        if (touches.length === 1) {
          const dx = (evt.nativeEvent.pageX - lastPos.current.x) * sensitivity;
          const dy = (evt.nativeEvent.pageY - lastPos.current.y) * sensitivity;
          send({ action: 'move', dx, dy });
        } else if (touches.length === 2 && !isDraggingRef.current) {
          if (longPressTimer.current) clearTimeout(longPressTimer.current);
          send({ action: 'scroll', dy: gesture.vy * 15 });
        }
      }
      
      lastPos.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
    },
    onPanResponderRelease: (_, g) => {
      // ĐỌC TỪ modeRef.current
      if (modeRef.current === 'pan') return; 

      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
      if (isDraggingRef.current) {
        send({ action: 'drag_end' });
        isDraggingRef.current = false;
        setIsDragging(false);
      } else if (Math.abs(g.dx) < 5 && Math.abs(g.dy) < 5) {
        send({ action: 'click', button: 'left' });
      }
    }
  })).current;

  const handleResetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  if (!connected || !ip) {
    return (
      <View style={styles.center}>
        <Text style={styles.warningText}>Vui lòng kết nối PC ở trang chủ trước khi xem stream.</Text>
      </View>
    );
  }

  const videoUrl = `http://${ip.trim()}:5000/video_feed`;

  return (
    <View style={styles.container}>
      
      <View style={styles.modeControl}>
        <TouchableOpacity 
          style={[styles.modeBtn, mode === 'pan' && styles.modeBtnActive]} 
          onPress={toggleMode} 
        >
          <Text style={styles.modeBtnText}>
            {mode === 'mouse' ? '🖱️ ĐANG DI CHUỘT' : '✋ ĐANG KÉO MÀN HÌNH'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overlayControls}>
        {isDragging && mode === 'mouse' && <Text style={styles.dragText}>⚓ Đang kéo thả</Text>}
        
        <TouchableOpacity onPress={handleResetView} style={styles.resetBtn}>
          <Text style={styles.zoomBtnText}>RESET</Text>
        </TouchableOpacity>

        <Text style={styles.zoomText}>Zoom: {zoom.toFixed(1)}x</Text>
        <TouchableOpacity onPress={() => setZoom(z => Math.max(1, z - 0.2))} style={styles.zoomBtn}><Text style={styles.zoomBtnText}>-</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setZoom(z => Math.min(4, z + 0.2))} style={styles.zoomBtn}><Text style={styles.zoomBtnText}>+</Text></TouchableOpacity>
      </View>

      <View style={[styles.streamWrapper, { transform: [{ translateX: panX }, { translateY: panY }, { scale: zoom }] }]}>
        <WebView
          source={{ html: `<html><body style="margin:0;background:black;overflow:hidden;display:flex;justify-content:center;align-items:center;height:100vh;"><img src="${videoUrl}" style="width:100%;height:100%;object-fit:contain;"/></body></html>` }}
          style={styles.webview}
          scrollEnabled={false}
          onLoad={() => setIsLoading(false)}
        />
      </View>
      
      <View style={[styles.touchOverlay, isDragging && mode === 'mouse' && styles.touchOverlayDragging]} {...pan.panHandlers} />

      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2980b9" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Đang tải màn hình PC...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  warningText: { color: '#e74c3c', textAlign: 'center', fontSize: 16 },
  streamWrapper: { flex: 1, width: '100%', height: '100%' },
  webview: { flex: 1, backgroundColor: 'transparent' },
  touchOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 5 },
  touchOverlayDragging: { borderWidth: 3, borderColor: '#27ae60' },
  loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', zIndex: 20 },
  modeControl: { position: 'absolute', top: 20, left: 20, zIndex: 10 },
  modeBtn: { backgroundColor: 'rgba(52, 73, 94, 0.8)', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#555' },
  modeBtnActive: { backgroundColor: 'rgba(39, 174, 96, 0.9)', borderColor: '#2ecc71' },
  modeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  overlayControls: { position: 'absolute', top: 20, right: 20, zIndex: 10, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 10 },
  resetBtn: { backgroundColor: '#c0392b', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 5 },
  dragText: { color: '#27ae60', fontWeight: 'bold', marginRight: 10 },
  zoomText: { color: '#fff', fontSize: 12 },
  zoomBtn: { backgroundColor: '#444', width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center' },
  zoomBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});