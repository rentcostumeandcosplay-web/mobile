import { useWebSocket } from "@/context/WebSocketContext";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TrackpadScreen() {
  const { send, sensitivity, setSensitivity } = useWebSocket();
  const [isDragging, setIsDragging] = useState(false);

  const lastPos = useRef({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        // Giữ lâu 0.5s để bắt đầu chế độ kéo thả (Drag & Drop)
        longPressTimer.current = setTimeout(() => {
          isDraggingRef.current = true;
          setIsDragging(true);
          send({ action: "drag_start" });
        }, 500);
        lastPos.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
      },
      onPanResponderMove: (evt, gesture) => {
        const touches = evt.nativeEvent.touches;

        // Nếu ngón tay di chuyển nhanh thì hủy chế độ giữ lâu (long press)
        if (
          !isDraggingRef.current &&
          (Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10)
        ) {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
        }

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
        } else if (touches.length === 2 && !isDraggingRef.current) {
          // 2 Ngón: Cuộn chuột (Scroll)
          if (longPressTimer.current) clearTimeout(longPressTimer.current);
          send({ action: "scroll", dy: gesture.vy * 15 }); // Nhân 15 để cuộn mượt hơn
        }

        lastPos.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
      },
      onPanResponderRelease: (_, g) => {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }

        if (isDraggingRef.current) {
          send({ action: "drag_end" });
          isDraggingRef.current = false;
          setIsDragging(false);
        } else if (Math.abs(g.dx) < 5 && Math.abs(g.dy) < 5) {
          // Chạm nhẹ không di chuyển -> Click chuột trái
          send({ action: "click", button: "left" });
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BÀN DI CHUỘT</Text>
        <View style={styles.sensitivityControl}>
          <Text style={styles.senText}>Độ nhạy: {sensitivity.toFixed(1)}x</Text>
          <TouchableOpacity
            onPress={() => setSensitivity((s) => Math.max(0.5, s - 0.5))}
            style={styles.senBtn}
          >
            <Text style={styles.senBtnText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSensitivity((s) => s + 0.5)}
            style={styles.senBtn}
          >
            <Text style={styles.senBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[styles.trackpad, isDragging && styles.trackpadDragging]}
        {...pan.panHandlers}
      >
        <Text style={styles.placeholderText}>
          {isDragging
            ? "⚓ ĐANG KÉO THẢ..."
            : "Vuốt để di chuột\nChạm để Click trái\n2 ngón để Cuộn"}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.mouseBtn}
          onPress={() => send({ action: "click", button: "left" })}
        >
          <Text style={styles.mouseBtnText}>TRÁI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mouseBtn}
          onPress={() => send({ action: "click", button: "right" })}
        >
          <Text style={styles.mouseBtnText}>PHẢI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 30,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  sensitivityControl: { flexDirection: "row", alignItems: "center", gap: 10 },
  senText: { color: "#aaa", fontSize: 12 },
  senBtn: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
  },
  senBtnText: { color: "#fff", fontWeight: "bold" },
  trackpad: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  trackpadDragging: {
    borderColor: "#27ae60",
    borderWidth: 2,
    backgroundColor: "#0a1f10",
  },
  placeholderText: {
    color: "#444",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 16,
  },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 15, marginBottom: 10 },
  mouseBtn: {
    flex: 1,
    height: 60,
    backgroundColor: "#222",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  mouseBtnText: { color: "#aaa", fontWeight: "bold", fontSize: 16 },
});
