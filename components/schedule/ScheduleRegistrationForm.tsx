import "@/utils/calendarLocaleVi";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import type { DateData } from "react-native-calendars";
import {
  Button,
  Text,
  TextInput,
} from "react-native-paper";

import { SafeAreaView } from "react-native-safe-area-context";
import { TabsStackHeader } from "@/components/layout/TabsStackHeader";
import { AppSelect } from "@/components/ui/AppSelect";
import { ScheduleDay } from "@/components/schedule/ScheduleDay";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  buildEmptyCreateValues,
  formatDMY,
  getDemoScheduleForEdit,
  SCHEDULE_LOCATION_OPTIONS,
  SCHEDULE_METHOD_OPTIONS,
  toYMD,
} from "./scheduleFormUtils";
import { AppButton } from "../ui/AppButton";
import { Palette } from "@/utils/palette";
import {
  SCHEDULE_CALENDAR_STYLE,
  SCHEDULE_CALENDAR_THEME,
} from "@/utils/scheduleCalendarTheme";

function padTimePart(n: number): string {
  return String(n).padStart(2, "0");
}

/** Chuỗi `HH:mm` -> Date cùng ngày (dùng cho time picker) */
function parseTimeStringToDate(s: string): Date {
  const d = new Date();
  d.setSeconds(0, 0);
  const m = s?.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (m) {
    const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
    const min = Math.min(59, Math.max(0, parseInt(m[2], 10)));
    d.setHours(h, min, 0, 0);
    return d;
  }
  d.setHours(8, 0, 0, 0);
  return d;
}

function formatDateToHm(d: Date): string {
  return `${padTimePart(d.getHours())}:${padTimePart(d.getMinutes())}`;
}

export type ScheduleRegistrationFormProps = {
  mode: "create" | "edit";
  seedDate?: string;
};

export function ScheduleRegistrationForm({
  mode,
  seedDate,
}: ScheduleRegistrationFormProps) {
  const user = useAuthStore((s) => s.user);
  const minDateStr = useMemo(() => toYMD(new Date()), []);

  const initial = useMemo(() => {
    if (mode === "edit") {
      const d = seedDate && seedDate >= minDateStr ? seedDate : minDateStr;
      return getDemoScheduleForEdit(d, minDateStr);
    }
    return buildEmptyCreateValues(seedDate, minDateStr);
  }, [mode, seedDate, minDateStr]);

  const [fromDate, setFromDate] = useState(initial.fromDate);
  const [toDate, setToDate] = useState(initial.toDate);
  const [fromTime, setFromTime] = useState(initial.fromTime);
  const [toTime, setToTime] = useState(initial.toTime);
  const [location, setLocation] = useState(initial.location);
  const [method, setMethod] = useState(initial.method);
  const [notes, setNotes] = useState(initial.notes);

  const [dateTarget, setDateTarget] = useState<"from" | "to" | null>(null);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeTarget, setTimeTarget] = useState<"from" | "to" | null>(null);
  const [tempTime, setTempTime] = useState(() => new Date());

  const headerTitle =
    mode === "create" ? "Đăng ký lịch tập" : "Sửa lịch tập";
  const submitLabel = mode === "create" ? "Đăng ký" : "Lưu";

  const modalDayRenderer = useCallback(
    (props: object) => <ScheduleDay {...props} dayMeta={{}} />,
    [],
  );

  const onCalendarDayPress = (day: DateData) => {
    if (day.dateString < minDateStr) return;
    if (dateTarget === "from") {
      setFromDate(day.dateString);
    } else if (dateTarget === "to") {
      setToDate(day.dateString);
    }
    setDateTarget(null);
  };

  const openTimePicker = (target: "from" | "to") => {
    const raw = target === "from" ? fromTime : toTime;
    setTimeTarget(target);
    setTempTime(parseTimeStringToDate(raw));
    setShowTimePicker(true);
  };

  const applyPickedTime = () => {
    if (!timeTarget) return;
    const formatted = formatDateToHm(tempTime);
    if (timeTarget === "from") setFromTime(formatted);
    else setToTime(formatted);
    setShowTimePicker(false);
    setTimeTarget(null);
  };

  const dismissTimePicker = () => {
    setShowTimePicker(false);
    setTimeTarget(null);
  };

  const body = (
    <>
      <TabsStackHeader title={headerTitle} />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="px-4 pb-8 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
          <View className="gap-4">
            <View>
              <Text variant="labelLarge" className="mb-1 text-neutral-900">
                Mã NV
              </Text>
              <TextInput
                mode="outlined"
                value={user?.employeeCode ?? ""}
                placeholder="—"
                editable={false}
                dense
                style={{ backgroundColor: Palette.surface }}
              />
            </View>

            <View>
              <Text variant="labelLarge" className="mb-1 text-neutral-900">
                Họ tên
              </Text>
              <TextInput
                mode="outlined"
                value={user?.name ?? ""}
                placeholder="—"
                editable={false}
                dense
                style={{ backgroundColor: Palette.surface }}
              />
            </View>

            <View>
              <Text variant="labelLarge" className="mb-1 text-neutral-900">
                Từ ngày
              </Text>
              <Pressable
                onPress={() => setDateTarget("from")}
                className="active:opacity-80"
              >
                <TextInput
                  mode="outlined"
                  value={formatDMY(fromDate)}
                  editable={false}
                  dense
                  pointerEvents="none"
                  right={<TextInput.Icon icon="calendar" pointerEvents="none" />}
                  style={{ backgroundColor: Palette.surface }}
                />
              </Pressable>
            </View>

            <View>
              <Text variant="labelLarge" className="mb-1 text-neutral-900">
                Đến ngày
              </Text>
              <Pressable
                onPress={() => setDateTarget("to")}
                className="active:opacity-80"
              >
                <TextInput
                  mode="outlined"
                  value={toDate ? formatDMY(toDate) : ""}
                  placeholder="Select a date..."
                  editable={false}
                  dense
                  pointerEvents="none"
                  right={<TextInput.Icon icon="calendar" pointerEvents="none" />}
                  style={{ backgroundColor: Palette.surface }}
                />
              </Pressable>
            </View>

            <View className="flex-row items-end gap-2">
              <View className="min-w-0 flex-1">
                <Text variant="labelLarge" className="mb-1 text-neutral-900">
                  Từ (Giờ: Phút)
                </Text>
                {Platform.OS === "web" ? (
                  <TextInput
                    mode="outlined"
                    value={fromTime}
                    onChangeText={setFromTime}
                    placeholder="hh:mm"
                    dense
                    style={{ backgroundColor: Palette.surface }}
                  />
                ) : (
                  <Pressable
                    onPress={() => openTimePicker("from")}
                    className="active:opacity-80"
                  >
                    <TextInput
                      mode="outlined"
                      value={fromTime}
                      placeholder="hh:mm"
                      editable={false}
                      dense
                      pointerEvents="none"
                      right={
                        <TextInput.Icon icon="clock-outline" pointerEvents="none" />
                      }
                      style={{ backgroundColor: Palette.surface }}
                    />
                  </Pressable>
                )}
              </View>
              <Text className="pb-3 text-neutral-400">-</Text>
              <View className="min-w-0 flex-1">
                <Text variant="labelLarge" className="mb-1 text-neutral-900">
                  Đến (Giờ: Phút)
                </Text>
                {Platform.OS === "web" ? (
                  <TextInput
                    mode="outlined"
                    value={toTime}
                    onChangeText={setToTime}
                    placeholder="hh:mm"
                    dense
                    style={{ backgroundColor: Palette.surface }}
                  />
                ) : (
                  <Pressable
                    onPress={() => openTimePicker("to")}
                    className="active:opacity-80"
                  >
                    <TextInput
                      mode="outlined"
                      value={toTime}
                      placeholder="hh:mm"
                      editable={false}
                      dense
                      pointerEvents="none"
                      right={
                        <TextInput.Icon icon="clock-outline" pointerEvents="none" />
                      }
                      style={{ backgroundColor: Palette.surface }}
                    />
                  </Pressable>
                )}
              </View>
            </View>

            <View>
              <Text variant="labelLarge" className="mb-1 text-neutral-900">
                Địa điểm tập
              </Text>
              <AppSelect
                value={location}
                onChange={setLocation}
                placeholder="Find items"
                options={SCHEDULE_LOCATION_OPTIONS.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </View>

            <View>
              <Text variant="labelLarge" className="mb-1 text-neutral-900">
                Phương thức tập
              </Text>
              <AppSelect
                value={method}
                onChange={setMethod}
                placeholder="Find items"
                options={SCHEDULE_METHOD_OPTIONS.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </View>

            <View>
              <Text variant="labelLarge" className="mb-1 text-neutral-900">
                Ghi chú
              </Text>
              <TextInput
                mode="outlined"
                value={notes}
                onChangeText={setNotes}
                placeholder="Nhập ghi chú (nếu có)"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: Palette.surface,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />
            </View>

            <Text
              variant="bodySmall"
              className="italic text-neutral-500"
              style={{ lineHeight: 20 }}
            >
              *Lưu ý: Anh/Chị được phép luyện tập trong giờ làm việc tối đa 01
              buổi/tuần và đảm bảo theo đúng khoảng thời gian cho phép.*
            </Text>

            <View className="mt-2 flex-row justify-end gap-2">
              <AppButton
                icon="close-outline"
                mode="outlined"
                onPress={() => router.back()}>
                Hủy
              </AppButton>
              <AppButton
                icon="content-save-outline"
                mode="contained"
                onPress={() => {
                  router.back();
                }}>
                {submitLabel}
              </AppButton>
            </View>
          </View>
      </ScrollView>

      <Modal
        visible={dateTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDateTarget(null)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/45 px-4"
          onPress={() => setDateTarget(null)}
        >
          <Pressable
            className="w-full max-w-[360px] overflow-hidden rounded-3xl bg-white shadow-xl"
            style={{
              shadowColor: Palette.shadow,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 12,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Calendar
              minDate={minDateStr}
              current={
                dateTarget === "to"
                  ? toDate || fromDate
                  : fromDate
              }
              firstDay={0}
              enableSwipeMonths
              monthFormat="MMMM yyyy"
              onDayPress={onCalendarDayPress}
              dayComponent={modalDayRenderer}
              markedDates={(() => {
                const key =
                  dateTarget === "from"
                    ? fromDate
                    : toDate || fromDate;
                return key
                  ? {
                      [key]: {
                        selected: true,
                        selectedColor: Palette.selectedBg,
                        selectedTextColor: Palette.selectedText,
                      },
                    }
                  : {};
              })()}
              theme={SCHEDULE_CALENDAR_THEME}
              style={SCHEDULE_CALENDAR_STYLE}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {Platform.OS === "android" && showTimePicker && timeTarget ? (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour
          display="default"
          onChange={(event, date) => {
            if (event.type === "dismissed") {
              dismissTimePicker();
              return;
            }
            if (event.type === "set" && date && timeTarget) {
              const formatted = formatDateToHm(date);
              if (timeTarget === "from") setFromTime(formatted);
              else setToTime(formatted);
            }
            dismissTimePicker();
          }}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          visible={showTimePicker && timeTarget !== null}
          transparent
          animationType="slide"
          onRequestClose={dismissTimePicker}
        >
          <Pressable
            className="flex-1 justify-end bg-black/40"
            onPress={dismissTimePicker}
          >
            <Pressable
              className="rounded-t-3xl bg-white px-4 pb-8 pt-4"
              onPress={(e) => e.stopPropagation()}
            >
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                is24Hour
                onChange={(_, date) => {
                  if (date) setTempTime(date);
                }}
              />
              <View className="mt-4 flex-row justify-end gap-2">
                <Button mode="text" onPress={dismissTimePicker}>
                  Hủy
                </Button>
                <Button mode="contained" onPress={applyPickedTime}>
                  Xong
                </Button>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {body}
    </SafeAreaView>
  );
}
