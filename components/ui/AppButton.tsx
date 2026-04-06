import { Button } from "react-native-paper";
import type { ComponentProps } from "react";
import { View } from "react-native";

export type AppButtonProps = ComponentProps<typeof Button> & {
  containerClassName?: string;
};

export function AppButton({
  mode = "contained",
  containerClassName,
  ...props
}: AppButtonProps) {
  return (
    <View className={containerClassName}>
      <Button mode={mode} {...props} />
    </View>
  );
}
