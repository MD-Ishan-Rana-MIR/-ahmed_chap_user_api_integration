import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
    Control,
    Controller,
    FieldErrors,
    FieldValues,
    Path,
    RegisterOptions,
} from "react-hook-form";
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";
import tw from "../lib/tailwind"; // Adjust path to your tailwind configuration

interface PasswordInputProps<T extends FieldValues> extends Omit<
  TextInputProps,
  "value" | "onChangeText" | "secureTextEntry"
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

export default function PasswordInput<T extends FieldValues>({
  name,
  control,
  errors,
  label,
  rules,
  containerStyle = "",
  placeholder = "*******",
  placeholderTextColor = "#9CA3AF",
  style,
  ...textInputProps
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
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
          <View
            style={[
              tw`flex-row items-center border ${
                errorMessage ? "border-red-500" : "border-gray-200"
              } rounded-full px-4 py-3 bg-white`,
              style,
            ]}
          >
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              secureTextEntry={!showPassword}
              style={tw`flex-1 text-sm text-gray-800 p-0`}
              {...textInputProps}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPassword((prev) => !prev)}
              style={tw`pl-2`}
            >
              {showPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
        )}
      />

      {errorMessage && (
        <Text style={tw`text-xs text-red-500 mt-1 ml-2`}>{errorMessage}</Text>
      )}
    </View>
  );
}
