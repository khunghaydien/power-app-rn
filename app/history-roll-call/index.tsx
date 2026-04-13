import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { ActivityIndicator, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabsStackHeader } from "@/components/layout/TabsStackHeader";
import { AppSelect } from "@/components/ui/AppSelect";
import {
    getRollCallHistory,
    type RollCallHistoryItem,
} from "@/services/rollCallService";
import { AppButton } from "@/components/ui/AppButton";
import { Palette } from "@/utils/palette";

function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

function formatDate(raw: string): string {
    if (!raw) return "--/--/----";
    if (raw.includes("T")) {
        const d = new Date(raw);
        if (!Number.isNaN(d.getTime())) {
            return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
        }
    }
    const only = raw.slice(0, 10);
    const [y, m, d] = only.split("-");
    if (y && m && d) return `${d}/${m}/${y}`;
    return raw;
}

function formatTime(raw?: string): string {
    if (!raw) return "--:--:--";
    if (raw.includes("T")) {
        const d = new Date(raw);
        if (!Number.isNaN(d.getTime())) {
            return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
        }
    }
    if (raw.length >= 8 && raw.includes(":")) return raw.slice(0, 8);
    return raw;
}

function Row({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View className="mb-0.5 flex-row">
            <Text variant="titleMedium" className="w-28 text-neutral-700">
                {label}
            </Text>
            <Text variant="titleMedium" className="flex-1 font-bold text-neutral-900">
                {value}
            </Text>
        </View>
    );
}

function RollCallCard({ item }: { item: RollCallHistoryItem }) {
    return (
        <View className="bg-white px-3 py-3">
            <View className="flex-row gap-3">
                <View className="h-[140px] w-[135px] items-center justify-center overflow-hidden rounded-md bg-neutral-200">
                    {item.imageUrl ? (
                        <Image
                            source={{ uri: item.imageUrl }}
                            resizeMode="cover"
                            className="h-full w-full"
                        />
                    ) : (
                        <MaterialCommunityIcons name="image-outline" size={34} color={Palette.textMuted} />
                    )}
                </View>
                <View className="min-w-0 flex-1">
                    <Row label="Mã nhân viên:" value={item.employeeCode || "--"} />
                    <Row label="Ngày tập:" value={formatDate(item.workoutDate)} />
                    <Row label="Giờ vào:" value={formatTime(item.checkInTime)} />
                    <Row label="Giờ ra:" value={formatTime(item.checkOutTime)} />
                    <Row label="Tập cùng PT:" value={item.withPt ? "Có" : "không"} />
                    <Row label="PT xác nhận:" value={item.ptSigned ? "Đã kí" : "Chưa kí"} />
                    <Row label="Địa điểm tập:" value={item.location || "--"} />
                </View>
            </View>
        </View>
    );
}

export default function HistoryRollCallScreen() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const [month, setMonth] = useState(pad2(now.getMonth() + 1));
    const [year, setYear] = useState(String(currentYear));

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ["roll-call-history", month, year],
        queryFn: () => getRollCallHistory({ month, year }),
    });

    const monthOptions = useMemo(
        () =>
            Array.from({ length: 12 }, (_, i) => {
                const m = pad2(i + 1);
                return { label: m, value: m };
            }),
        [],
    );

    const yearOptions = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => {
            const y = String(currentYear - 2 + i);
            return { label: y, value: y };
        });
    }, [currentYear]);

    return (
        <SafeAreaView className="flex-1 bg-neutral-100" edges={["bottom"]}>
            <TabsStackHeader title="Lịch sử điểm danh" />

            <View className="border-b border-neutral-200 bg-neutral-100 px-4 py-3">
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <AppSelect value={month} onChange={setMonth} options={monthOptions} />
                    </View>
                    <View className="flex-1">
                        <AppSelect value={year} onChange={setYear} options={yearOptions} />
                    </View>
                </View>
            </View>

            {isPending ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                </View>
            ) : isError ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-center text-neutral-700">
                        Không tải được lịch sử điểm danh từ API.
                    </Text>
                    <AppButton icon="refresh"
                        mode="contained-tonal"
                        containerClassName="mt-3"
                        onPress={() => refetch()}>
                        Thử lại
                    </AppButton>
                </View>
            ) : (
                <ScrollView className="flex-1" contentContainerClassName="pb-6">
                    {(data ?? []).length === 0 ? (
                        <View className="px-6 py-10">
                            <Text className="text-center text-neutral-500">
                                Chưa có lịch sử điểm danh trong tháng đã chọn.
                            </Text>
                        </View>
                    ) : (
                        (data ?? []).map((item, idx) => (
                            <View key={item.id}>
                                <RollCallCard item={item} />
                                {idx < (data ?? []).length - 1 ? <Divider /> : null}
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
