import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      {/* 1. Tab Kết nối */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Kết nối",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="wifi" color={color} />
          ),
        }}
      />

      {/* 2. Tab Màn hình (Stream WebView) */}
      <Tabs.Screen
        name="stream"
        options={{
          title: "Màn hình",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="tv.fill" color={color} />
          ),
        }}
      />

      {/* 3. Tab Bàn di chuột (Trackpad) */}
      <Tabs.Screen
        name="trackpad"
        options={{
          title: "Chuột",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="hand.draw.fill" color={color} />
          ),
        }}
      />

      {/* 4. Tab Bàn phím */}
      <Tabs.Screen
        name="keyboard"
        options={{
          title: "Bàn phím",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="keyboard.fill" color={color} />
          ),
        }}
      />

      {/* 5. Tab Cài đặt */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Cài đặt",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
