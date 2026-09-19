import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Control,
    Controller,
    FieldErrors,
    RegisterOptions,
} from "react-hook-form";
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";
import tw from "twrnc";

interface FormPasswordInputProps extends Omit<
  TextInputProps,
  "onChangeText" | "value" | "secureTextEntry"
> {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  rules?: RegisterOptions;
  containerStyle?: string;
}

export const FormPasswordInput: React.FC<FormPasswordInputProps> = ({
  name,
  control,
  errors,
  label = "Password",
  rules,
  containerStyle = "",
  placeholder = "*******",
  placeholderTextColor = "#9CA3AF",
  ...textInputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <View style={tw`${containerStyle}`}>
      {label && (
        <Text style={tw`text-[#757575] text-sm font-regular mb-1.5`}>
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={tw`flex-row items-center border ${
              errorMessage ? "border-red-500" : "border-gray-200"
            } rounded-full px-4 py-3 bg-white`}
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
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#757575"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      {errorMessage && (
        <Text style={tw`text-xs text-red-500 mt-1 ml-2`}>{errorMessage}</Text>
      )}
    </View>
  );
};
