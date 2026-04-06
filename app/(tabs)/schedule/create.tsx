import { useLocalSearchParams } from "expo-router";
import { ScheduleRegistrationForm } from "@/components/schedule/ScheduleRegistrationForm";

export default function ScheduleCreateScreen() {
  const { date: dateParam } = useLocalSearchParams<{ date?: string }>();

  return <ScheduleRegistrationForm mode="create" seedDate={dateParam} />;
}
