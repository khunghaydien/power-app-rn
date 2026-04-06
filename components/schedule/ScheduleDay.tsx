import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { DateData } from "react-native-calendars";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Palette } from "@/utils/palette";

export type DayMarkMeta = {
  star?: boolean;
  warning?: boolean;
  check?: boolean;
};

type Props = {
  date?: DateData;
  state?: string;
  marking?: {
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
    disabled?: boolean;
  };
  onPress?: (d?: DateData) => void;
  children?: ReactNode;
  dayMeta?: Record<string, DayMarkMeta>;
};

export function ScheduleDay({
  date,
  state,
  marking,
  onPress,
  children,
  dayMeta = {},
}: Props) {
  const dateString = date?.dateString ?? "";
  const meta = dayMeta[dateString];
  const isDisabled =
    state === "disabled" || marking?.disabled === true;
  const isSelected = marking?.selected === true || state === "selected";
  const selColor = marking?.selectedColor ?? Palette.selectedBg;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => !isDisabled && date && onPress?.(date)}
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 2,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Palette.border,
          backgroundColor: isSelected ? selColor : Palette.white,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.35 : 1,
        }}
      >
        {meta?.warning ? (
          <MaterialCommunityIcons
            name="alert"
            size={11}
            color={Palette.textMuted}
            style={{ position: "absolute", left: 2, top: 2 }}
          />
        ) : null}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: isSelected
              ? marking?.selectedTextColor ?? Palette.selectedText
              : isDisabled
                ? Palette.disabled
                : Palette.text,
          }}
        >
          {children}
        </Text>
        {meta?.star ? (
          <MaterialCommunityIcons
            name="star"
            size={11}
            color={isSelected ? Palette.borderStrong : Palette.accentGray}
            style={{ position: "absolute", right: 2, bottom: 2 }}
          />
        ) : null}
        {meta?.check && !meta?.star ? (
          <MaterialCommunityIcons
            name="check"
            size={11}
            color={isSelected ? Palette.borderStrong : Palette.accentGray}
            style={{ position: "absolute", right: 2, bottom: 2 }}
          />
        ) : null}
      </View>
    </Pressable>
  );
}
