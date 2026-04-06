import { Card } from "react-native-paper";
import type { ComponentProps } from "react";
import { View } from "react-native";

type PaperCardProps = ComponentProps<typeof Card>;

export type AppCardProps = PaperCardProps & {
  containerClassName?: string;
};

export function AppCard({
  containerClassName,
  children,
  ...props
}: AppCardProps) {
  return (
    <View className={containerClassName}>
      <Card {...(props as PaperCardProps)}>{children}</Card>
    </View>
  );
}
