import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Dropdown, type DropdownInputProps } from "react-native-paper-dropdown";
import { Palette } from "@/utils/palette";

export type AppSelectOption = {
    label: string;
    value: string;
};

type AppSelectProps = {
    label?: string;
    value?: string;
    options: AppSelectOption[];
    placeholder?: string;
    onChange: (value: string) => void;
    containerClassName?: string;
    disabled?: boolean;
};

/**
 * Select dùng giao diện "flat" nhưng có viền giống select thường.
 */
export function AppSelect({
    label,
    value,
    options,
    placeholder = "Chọn",
    onChange,
    containerClassName,
    disabled = false,
}: AppSelectProps) {
    const CustomDropdownInput = ({
        placeholder: p,
        selectedLabel,
    }: DropdownInputProps) => {
        return (
            <View
              className="overflow-hidden rounded-md border border-neutral-400 px-2 py-2.5"
              style={{ backgroundColor: Palette.surface }}
            >
                <View className="min-w-0 flex-row items-center">
                    <View className="min-w-0 flex-1 pr-1">
                        <Text
                            variant="bodyMedium"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className={
                                selectedLabel
                                    ? "text-neutral-800"
                                    : "text-neutral-400"
                            }
                        >
                            {selectedLabel || p || placeholder}
                        </Text>
                    </View>
                    <View className="shrink-0 items-center justify-center">
                        <MaterialCommunityIcons
                            name="chevron-down"
                            size={20}
                            color={Palette.accentGray}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className={containerClassName}>
            {label ? (
                <Text variant="titleMedium" className="mb-1.5 font-bold text-neutral-900">
                    {label}
                </Text>
            ) : null}

            <Dropdown
                mode="flat"
                label=""
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                options={options}
                onSelect={(v?: string) => onChange(v ?? "")}
                CustomDropdownInput={CustomDropdownInput}
            />
        </View>
    );
}
