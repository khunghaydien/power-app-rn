import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, router, type Href } from "expo-router";
import { ScrollView, View } from "react-native";
import { Card, Text } from "react-native-paper";
import type { ComponentProps } from "react";
import { AppCard } from "@/components/ui/AppCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { TabsStackHeader } from "@/components/layout/TabsStackHeader";
import { AppButton } from "@/components/ui/AppButton";
import { Palette } from "@/utils/palette";

type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const FEATURES: {
    id: string;
    icon: MciName;
    title: string;
    description: string;
    actionLabel: string;
}[] = [
        {
            id: "roll-call",
            icon: "calendar-check",
            title: "Điểm danh",
            description: "Chụp ảnh và điểm danh tập luyện",
            actionLabel: "Xem chi tiết"
        },
        {
            id: "history-roll-call",
            icon: "clipboard-check-outline",
            title: "Lịch sử điểm danh",
            description: "Lịch sử các lần điểm danh",
            actionLabel: "Xem chi tiết",
        },
        {
            id: "schedule",
            icon: "calendar-month",
            title: "Lịch tập",
            description: "Lịch tập luyện của cán bộ",
            actionLabel: "Xem chi tiết",
        },
        {
            id: "explain",
            icon: "message-text-outline",
            title: "Giải trình lịch tập",
            description: "Giải trình lịch tập luyện",
            actionLabel: "Xem chi tiết",
        },
        {
            id: "profile",
            icon: "card-account-details-outline",
            title: "Thông tin cán bộ",
            description: "Thông tin cá nhân cán bộ",
            actionLabel: "Xem chi tiết",
        },
        {
            id: "status",
            icon: "heart-pulse",
            title: "Tình trạng cán bộ",
            description: "Xem và cập nhật tình trạng cán bộ",
            actionLabel: "Xem chi tiết",
        },
    ];

function hrefForFeatureId(id: string): Href {
    if (id === "roll-call") {
        return "/(tabs)/roll-call";
    }
    if (id === "schedule") {
        return "/(tabs)/schedule";
    }
    return `/(tabs)/${id}` as Href;
}

export default function HomeScreen() {
    const user = useAuthStore((s) => s.user);
    if (!user) {
        return <Redirect href="/sign-in" />;
    }
    return (
        <View className="flex-1">
            <TabsStackHeader title="" showBack={false} />
            <View className="border-t border-neutral-100 bg-neutral-100 px-4 py-3">
                <Text variant="titleMedium" className="text-neutral-900">
                    Xin chào {user.name}
                </Text>
            </View>
            <ScrollView
                className="flex-1 bg-neutral-100"
                contentContainerClassName="pb-8 pt-3"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="gap-3 px-4">
                    {FEATURES.map((item) => (
                        <AppCard key={item.id} mode="elevated" containerClassName="w-full">
                            <Card.Content className="py-3.5">
                                <View className="flex-row items-center gap-3">
                                    <View className="h-[64px] w-[64px] shrink-0 items-center justify-center rounded-2xl bg-neutral-200">
                                        <MaterialCommunityIcons
                                            name={item.icon}
                                            size={32}
                                            color={Palette.text}
                                        />
                                    </View>

                                    <View className="min-w-0 flex-1">
                                        <Text
                                            variant="titleMedium"
                                            className="font-semibold text-neutral-900"
                                            style={{ flexShrink: 1 }}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text
                                            variant="bodySmall"
                                            className="mt-1 text-neutral-600"
                                            style={{ lineHeight: 18 }}
                                            numberOfLines={4}
                                        >
                                            {item.description}
                                        </Text>
                                        <AppButton
                                            mode="outlined"
                                            icon="eye-outline"
                                            compact
                                            onPress={() => router.push(hrefForFeatureId(item.id))}
                                            style={{
                                                marginTop: 10,
                                                alignSelf: "flex-start",
                                                borderColor: Palette.borderStrong,
                                            }}
                                            labelStyle={{ fontSize: 11, marginVertical: 2 }}
                                        >
                                            {item.actionLabel}
                                        </AppButton>
                                    </View>
                                </View>
                            </Card.Content>
                        </AppCard>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
