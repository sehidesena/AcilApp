import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anasayfa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Harita',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="health-info"
        options={{
          title: 'Bilgilerim',
          //tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />,
        tabBarIcon: ({ color, size }) => <MaterialIcons name="info" size={size} color={color} />,
        
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Kişilerim',
          //tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="contacts" size={size} color={color} /> // Acil Kişi Listesi için çalışan ikon
          ),
        }}
      />
    </Tabs>
  );
}
