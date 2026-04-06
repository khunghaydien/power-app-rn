import { useLocalSearchParams } from "expo-router";
import { ScheduleRegistrationForm } from "@/components/schedule/ScheduleRegistrationForm";

export default function ScheduleEditScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();

  return <ScheduleRegistrationForm mode="edit" seedDate={date} />;
}
