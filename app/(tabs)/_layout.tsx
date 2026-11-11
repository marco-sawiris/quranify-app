import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { Home, Search, Users, ListMusic, BarChart2, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => Platform.OS === 'android' ? <BlurView tint="dark" intensity={42} experimentalBlurMethod="dimezisBlurView" style={{ flex: 1 }} /> : undefined,
        tabBarStyle: {
          backgroundColor: 'rgba(10, 15, 29, 0.48)',
          borderTopColor: 'rgba(160, 205, 255, 0.18)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'البحث',
          tabBarIcon: ({ color, size }) => <Search size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reciters"
        options={{
          title: 'القرّاء',
          tabBarIcon: ({ color, size }) => <Users size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="playlists"
        options={{
          title: 'القوائم',
          tabBarIcon: ({ color, size }) => <ListMusic size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'الإحصاءات',
          tabBarIcon: ({ color, size }) => <BarChart2 size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ color, size }) => <Settings size={size - 2} color={color} />,
        }}
      />
    </Tabs>
  );
}
