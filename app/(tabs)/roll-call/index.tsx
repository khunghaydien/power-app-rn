import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import {
    ActivityIndicator,
    Appbar,
    IconButton,
    RadioButton,
    Surface,
    Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppButton } from "@/components/ui/AppButton";
import { Palette } from "@/utils/palette";

function todayLabel() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

export default function RollCallScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const [capturedUri, setCapturedUri] = useState<string | null>(null);
    const [facing, setFacing] = useState<"front" | "back">("front");

    const [checkType, setCheckType] = useState<"in" | "out">("in");
    const [trainingType, setTrainingType] = useState("Tập luyện");
    const [location, setLocation] = useState("SunHome Bà Nà");

    const formattedToday = useMemo(() => todayLabel(), []);
    const locations = [
        { label: "SunHome Bà Nà", value: "SunHome Bà Nà" },
        { label: "Tại cơ quan", value: "Tại cơ quan" },
        { label: "Tại nhà", value: "Tại nhà" },
        { label: "Khác", value: "Khác" },
    ];

    const onCapture = async () => {
        if (!cameraRef.current) return;
        const photo = await cameraRef.current.takePictureAsync({
            quality: 0.7,
            skipProcessing: true,
        });
        if (photo?.uri) {
            setCapturedUri(photo.uri);
        }
    };

    if (!permission) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView className="flex-1 bg-neutral-100 px-5">
                <View className="flex-1 items-center justify-center">
                    <Text variant="titleMedium" className="text-center text-neutral-900">
                        Cần quyền camera để chụp ảnh điểm danh
                    </Text>
                    <AppButton
                        icon="camera-outline"
                        mode="contained"
                        containerClassName="mt-4"
                        onPress={requestPermission}>
                        Cấp quyền camera
                    </AppButton>
                    <AppButton
                        icon="close-outline"
                        mode="outlined"
                        containerClassName="mt-2"
                        onPress={() => router.back()}>
                        Quay lại
                    </AppButton>
                </View>
            </SafeAreaView>
        );
    }

    if (!capturedUri) {
        return (
            <SafeAreaView className="flex-1 bg-neutral-100" edges={["bottom"]}>
                <Appbar.Header mode="small" className="bg-neutral-100" elevated={false}>
                    <Appbar.BackAction onPress={() => router.back()} color={Palette.textMuted} />
                </Appbar.Header>

                <Surface className="mx-2 flex-1 overflow-hidden" elevation={0}>
                    <CameraView
                        ref={(ref) => {
                            cameraRef.current = ref;
                        }}
                        style={{ flex: 1 }}
                        facing={facing}
                        enableTorch={false}
                    />
                </Surface>

                <Surface
                    className="mx-2 mb-2 h-[120px] flex-row items-center justify-center bg-neutral-100"
                    elevation={0}
                >
                    <IconButton
                        onPress={onCapture}
                        icon="camera-outline"
                        size={46}
                        mode="outlined"
                        iconColor={Palette.textMuted}
                        containerColor={Palette.surface}
                        style={{ width: 84, height: 84, borderColor: Palette.borderStrong }}
                        accessibilityLabel="Chụp ảnh"
                    />
                    <IconButton
                        onPress={() => setFacing((f) => (f === "front" ? "back" : "front"))}
                        icon="camera-flip-outline"
                        size={34}
                        iconColor={Palette.borderStrong}
                        style={{ position: "absolute", right: 24 }}
                        accessibilityLabel="Đổi camera"
                    />
                </Surface>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-neutral-100" edges={["bottom"]}>
            <Appbar.Header mode="small" className="bg-neutral-100" elevated={false}>
                <Appbar.BackAction onPress={() => setCapturedUri(null)} color={Palette.textMuted} />
                <Appbar.Content title="" />
                <IconButton icon="account-circle-outline" size={40} iconColor={Palette.disabled} />
            </Appbar.Header>

            <ScrollView
                className="flex-1"
                contentContainerClassName="px-7 pb-4 pt-2"
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={{ uri: capturedUri }}
                    resizeMode="cover"
                    className="mb-5 h-[190px] w-[240px] self-center"
                />

                <Text variant="titleMedium" className="mb-3 text-neutral-900">
                    Ngày: <Text className="font-bold">{formattedToday}</Text>
                </Text>

                <View className="mb-3">
                    <Pressable
                        onPress={() => setCheckType("in")}
                        className="mb-0.5 flex-row items-center"
                    >
                        <RadioButton.Android
                            value="in"
                            status={checkType === "in" ? "checked" : "unchecked"}
                            onPress={() => setCheckType("in")}
                        />
                        <Text variant="titleMedium">Giờ vào</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setCheckType("out")}
                        className="flex-row items-center"
                    >
                        <RadioButton.Android
                            value="out"
                            status={checkType === "out" ? "checked" : "unchecked"}
                            onPress={() => setCheckType("out")}
                        />
                        <Text variant="titleMedium">Giờ ra</Text>
                    </Pressable>
                </View>

                <Text variant="titleMedium" className="mb-1.5 font-bold text-neutral-900">
                    Loại Tập luyện:
                </Text>
                <View className="mb-3">
                    <Pressable
                        onPress={() => setTrainingType("Tập luyện")}
                        className="mb-0.5 flex-row items-center"
                    >
                        <RadioButton.Android
                            value="Tập luyện"
                            status={trainingType === "Tập luyện" ? "checked" : "unchecked"}
                            onPress={() => setTrainingType("Tập luyện")}
                        />
                        <Text variant="titleMedium">Tập luyện</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setTrainingType("Cardio")}
                        className="mb-0.5 flex-row items-center"
                    >
                        <RadioButton.Android
                            value="Cardio"
                            status={trainingType === "Cardio" ? "checked" : "unchecked"}
                            onPress={() => setTrainingType("Cardio")}
                        />
                        <Text variant="titleMedium">Cardio</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setTrainingType("Chạy ngoài trời")}
                        className="flex-row items-center"
                    >
                        <RadioButton.Android
                            value="Chạy ngoài trời"
                            status={trainingType === "Chạy ngoài trời" ? "checked" : "unchecked"}
                            onPress={() => setTrainingType("Chạy ngoài trời")}
                        />
                        <Text variant="titleMedium">Chạy ngoài trời</Text>
                    </Pressable>
                </View>

                <Text variant="titleMedium" className="mb-1.5 font-bold text-neutral-900">
                    Địa điểm tập:
                </Text>
                <AppSelect
                    value={location}
                    onChange={setLocation}
                    options={locations}
                    placeholder="Chọn địa điểm"
                />
            </ScrollView>

            <Surface className="bg-neutral-100 px-7" elevation={0}>
                <AppButton
                    icon="check-outline"
                    mode="contained"
                    containerClassName="rounded-2xl"
                    onPress={() => router.push("/(tabs)/history-roll-call")}>
                    Điểm danh
                </AppButton>
            </Surface>
        </SafeAreaView>
    );
}
