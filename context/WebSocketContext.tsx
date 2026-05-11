import * as Network from "expo-network";
import React, { createContext, useContext, useRef, useState } from "react";
import { Alert } from "react-native";

// Khai báo các biến và hàm mà toàn bộ app có thể dùng chung
type WebSocketContextType = {
  ip: string;
  setIp: (ip: string) => void;
  connected: boolean;
  status: string;
  isScanning: boolean;
  connect: () => void;
  send: (msg: any) => void;
  scanNetwork: () => void;
  sensitivity: number;
  setSensitivity: React.Dispatch<React.SetStateAction<number>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ip, setIp] = useState("");
  const [status, setStatus] = useState("Chưa kết nối");
  const [connected, setConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Cài đặt chung cho Trackpad / Chuột
  const [sensitivity, setSensitivity] = useState(2.0);
  const [zoom, setZoom] = useState(1.0);

  const wsRef = useRef<WebSocket | null>(null);

  // Hàm gửi lệnh (Dùng ở mọi màn hình)
  const send = (msg: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  // Hàm dò IP tự động
  const scanNetwork = async () => {
    setIsScanning(true);
    setStatus("🔍 Đang tìm PC...");
    try {
      const deviceIp = await Network.getIpAddressAsync();
      if (!deviceIp) throw new Error();
      const baseIp = deviceIp.split(".").slice(0, 3).join(".") + ".";
      let found = false;
      for (let i = 1; i < 255; i++) {
        const testIp = `${baseIp}${i}`;
        const ws = new WebSocket(`ws://${testIp}:8765`);
        ws.onopen = () => {
          setIp(testIp);
          setStatus(`✅ Tìm thấy: ${testIp}`);
          found = true;
          ws.close();
          setIsScanning(false);
        };
        setTimeout(() => ws.close(), 1200);
        if (found) break;
      }
      setTimeout(() => {
        if (!found) {
          setIsScanning(false);
          setStatus("❌ Không tìm thấy PC");
        }
      }, 5000);
    } catch (e) {
      setIsScanning(false);
      setStatus("🔴 Lỗi Wi-Fi");
    }
  };

  // Hàm kết nối
  const connect = () => {
    if (!ip.trim())
      return Alert.alert("Lỗi", "Vui lòng nhập IP hoặc nhấn DÒ PC");
    setStatus("🔄 Đang kết nối...");
    const ws = new WebSocket(`ws://${ip.trim()}:8765`);
    ws.onopen = () => {
      setConnected(true);
      setStatus("🟢 Đã kết nối với PC");
    };
    ws.onclose = () => {
      setConnected(false);
      setStatus("⚪ Đã ngắt kết nối");
    };
    ws.onerror = () => {
      setConnected(false);
      setStatus("🔴 Lỗi kết nối");
      Alert.alert("Lỗi", "Không thể kết nối đến PC");
    };
    wsRef.current = ws;
  };

  return (
    <WebSocketContext.Provider
      value={{
        ip,
        setIp,
        connected,
        status,
        isScanning,
        connect,
        send,
        scanNetwork,
        sensitivity,
        setSensitivity,
        zoom,
        setZoom,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket phải nằm trong WebSocketProvider");
  return context;
};
