import {
    Control,
    Controller,
    FieldErrors,
    FieldValues,
    Path,
    RegisterOptions,
} from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";
import tw from "../lib/tailwind"; // Adjust path to your tailwind instance

interface CustomInputProps<T extends FieldValues> extends Omit<
  TextInputProps,
  "value" | "onChangeText"
> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  label?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  containerStyle?: string;
}

export default function CustomInput<T extends FieldValues>({
  name,
  control,
  errors,
  label,
  rules,
  containerStyle = "",
  placeholder,
  placeholderTextColor = "#9CA3AF",
  style,
  ...textInputProps
}: CustomInputProps<T>) {
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <View style={tw`mb-4.5 ${containerStyle}`}>
      {label && (
        <Text style={tw`text-[#757575] text-sm font-medium mb-1.5`}>
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={[
              tw`border ${
                errorMessage ? "border-red-500" : "border-gray-200"
              } rounded-full px-4 py-3 text-sm text-gray-800 bg-white`,
              style,
            ]}
            {...textInputProps}
          />
        )}
      />

      {errorMessage && (
        <Text style={tw`text-xs text-red-500 mt-1 ml-2`}>{errorMessage}</Text>
      )}
    </View>
  );
}
