import { Palette } from "@/utils/palette";

/** Theme dùng chung cho mọi `Calendar` (lịch tập + modal chọn ngày). */
export const SCHEDULE_CALENDAR_THEME = {
  backgroundColor: Palette.white,
  calendarBackground: Palette.white,
  textSectionTitleColor: Palette.textMuted,
  textDayHeaderFontSize: 12,
  textDayFontSize: 15,
  textDayFontWeight: "400" as const,
  dayTextColor: Palette.text,
  textDisabledColor: Palette.borderStrong,
  todayTextColor: Palette.accentGray,
  monthTextColor: Palette.text,
  textMonthFontSize: 17,
  textMonthFontWeight: "600" as const,
  arrowColor: Palette.text,
  selectedDayBackgroundColor: Palette.selectedBg,
  selectedDayTextColor: Palette.selectedText,
  selectedDayFontSize: 15,
  selectedDayFontWeight: "600" as const,
  /** Căn hàng tuần theo nội dung, tránh ô ngày custom bị kéo dọc và chồng lên nhau trong modal. */
  "stylesheet.calendar.main": {
    week: {
      marginVertical: 7,
      flexDirection: "row" as const,
      justifyContent: "space-around" as const,
      alignItems: "center" as const,
    },
  },
};

export const SCHEDULE_CALENDAR_STYLE = {
  paddingBottom: 8,
} as const;
