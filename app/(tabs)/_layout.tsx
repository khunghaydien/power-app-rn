import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Palette } from "@/utils/palette";

type MciName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

function TabBarIcon({
  name,
  color,
  size,
}: {
  name: MciName;
  color: string;
  size: number;
}) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  const guard = useAuthGuard({ requireAuth: true });

  if (!guard.isReady) {
    return null;
  }

  if (guard.redirectTo) {
    return <Redirect href={guard.redirectTo} />;
  }

  return (
    <View className="flex-1 bg-neutral-100">
      <View className="min-h-0 flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Palette.text,
            tabBarInactiveTintColor: Palette.textMuted,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Trang chủ",
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="home-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="schedule"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="roll-call"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="history-roll-call"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="status"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="explain"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
