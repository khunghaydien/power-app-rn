import { TextInput } from "react-native-paper";
import type { ComponentProps } from "react";
import { View } from "react-native";

export type AppInputProps = ComponentProps<typeof TextInput> & {
  containerClassName?: string;
};

export function AppInput({
  mode = "outlined",
  containerClassName,
  ...props
}: AppInputProps) {
  return (
    <View className={containerClassName}>
      <TextInput mode={mode} {...props} />
    </View>
  );
}
