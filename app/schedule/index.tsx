import "@/utils/calendarLocaleVi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import type { DateData } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabsStackHeader } from "@/components/layout/TabsStackHeader";
import {
  ScheduleDay,
  type DayMarkMeta,
} from "@/components/schedule/ScheduleDay";
import { AppButton } from "@/components/ui/AppButton";
import { Palette } from "@/utils/palette";
import {
  SCHEDULE_CALENDAR_STYLE,
  SCHEDULE_CALENDAR_THEME,
} from "@/utils/scheduleCalendarTheme";

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Ngày đã có lịch → mở edit (demo: có thể thay bằng API) */
function useScheduleDatesWithData(visibleMonthPrefix: string) {
  return useMemo(() => {
    return new Set<string>([
      `${visibleMonthPrefix}-09`,
      `${visibleMonthPrefix}-15`,
    ]);
  }, [visibleMonthPrefix]);
}

function buildDayMeta(prefix: string): Record<string, DayMarkMeta> {
  return {
    [`${prefix}-09`]: { star: true, warning: true },
    [`${prefix}-01`]: { warning: true },
    [`${prefix}-15`]: { check: true },
  };
}

export default function ScheduleScreen() {
  const today = useMemo(() => new Date(), []);
  const minDateStr = useMemo(() => toYMD(today), [today]);
  const todayStr = minDateStr;

  const [selected, setSelected] = useState(todayStr);
  const [visibleMonthPrefix, setVisibleMonthPrefix] = useState(
    todayStr.slice(0, 7),
  );
  const [calendarKey, setCalendarKey] = useState(0);

  const datesWithData = useScheduleDatesWithData(visibleMonthPrefix);
  const dayMeta = useMemo(
    () => buildDayMeta(visibleMonthPrefix),
    [visibleMonthPrefix],
  );

  const markedDates: MarkedDates = useMemo(() => {
    const m: MarkedDates = {
      [selected]: {
        selected: true,
        selectedColor: Palette.selectedBg,
        selectedTextColor: Palette.selectedText,
      },
    };
    return m;
  }, [selected]);

  const DayRenderer = useCallback(
    (props: object) => (
      <ScheduleDay {...props} dayMeta={dayMeta} />
    ),
    [dayMeta],
  );

  const onDayPress = useCallback(
    (day: DateData) => {
      if (day.dateString < minDateStr) return;
      setSelected(day.dateString);
      const hasData = datesWithData.has(day.dateString);
      if (hasData) {
        router.push({
          pathname: "/schedule/edit",
          params: { date: day.dateString },
        });
      } else {
        router.push({
          pathname: "/schedule/create",
          params: { date: day.dateString },
        });
      }
    },
    [datesWithData, minDateStr],
  );

  const goToday = useCallback(() => {
    setSelected(todayStr);
    setVisibleMonthPrefix(todayStr.slice(0, 7));
    setCalendarKey((k) => k + 1);
  }, [todayStr]);

  const monthLabel = useMemo(() => {
    const [y, m] = visibleMonthPrefix.split("-");
    return `${m}/${y}`;
  }, [visibleMonthPrefix]);

  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={["bottom"]}>
      <TabsStackHeader title="Lịch tập" />
      <ScrollView
        className="flex-1 bg-neutral-100"
        contentContainerClassName="pb-8 pt-2"
        keyboardShouldPersistTaps="handled"
      >
        <View className="overflow-hidden rounded-t-2xl bg-white px-4 pt-3">
          <Text variant="titleSmall" className="mb-2 font-bold text-neutral-900">
            Ghi chú:
          </Text>
          <View className="mb-1 flex-row items-start gap-2">
            <MaterialCommunityIcons name="star" size={16} color={Palette.accentGray} />
            <Text variant="bodySmall" className="flex-1 text-neutral-700">
              Lịch đăng ký
            </Text>
          </View>
          <View className="mb-1 flex-row items-start gap-2">
            <MaterialCommunityIcons name="alert" size={16} color={Palette.textMuted} />
            <Text variant="bodySmall" className="flex-1 text-neutral-700">
              Giải trình (điểm danh chưa đúng, đủ theo quy định)
            </Text>
          </View>
          <View className="mb-4 flex-row items-start gap-2">
            <MaterialCommunityIcons name="check" size={16} color={Palette.accentGray} />
            <Text variant="bodySmall" className="flex-1 text-neutral-700">
              Điểm danh thành công
            </Text>
          </View>

          <Text variant="bodySmall" className="mb-1 text-neutral-700">
            Số buổi tập thành công trong tháng: {monthLabel}.
          </Text>
          <Text variant="bodySmall" className="mb-4 text-neutral-700">
            Đã tập: 0 /10 buổi. Trong đó: Tập cùng PT: 1, Chạy: 0, Cardio: 0.
          </Text>

          <View className="mb-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <View className="flex-row items-center justify-end border-b border-neutral-100 px-2 py-2">
              <AppButton
                onPress={goToday}
                icon="calendar-today-outline"
                compact
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
                  borderColor: Palette.borderStrong,
                }}
                labelStyle={{ fontSize: 11, marginVertical: 2 }}
              >
                Ngày hiện tại
              </AppButton>
            </View>

            <Calendar
              key={calendarKey}
              current={visibleMonthPrefix + "-01"}
              minDate={minDateStr}
              firstDay={0}
              markedDates={markedDates}
              onDayPress={onDayPress}
              onMonthChange={(d) => {
                const prefix = d.dateString.slice(0, 7);
                setVisibleMonthPrefix(prefix);
              }}
              dayComponent={DayRenderer}
              enableSwipeMonths
              monthFormat="MMMM yyyy"
              theme={SCHEDULE_CALENDAR_THEME}
              style={SCHEDULE_CALENDAR_STYLE}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
