import React from "react";
import {
    Control,
    Controller,
    FieldErrors,
    RegisterOptions,
} from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";
import tw from "twrnc";

interface FormTextInputProps extends Omit<
  TextInputProps,
  "onChangeText" | "value"
> {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  rules?: RegisterOptions;
  containerStyle?: string;
  defaultValue?: string;
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
  name,
  control,
  errors,
  label,
  rules,
  containerStyle = "",
  defaultValue = "",
  placeholderTextColor = "#9CA3AF",
  ...textInputProps
}) => {
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <View style={tw`${containerStyle}`}>
      {label && <Text style={tw`text-sm text-[#757575]  mb-1.5`}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={tw`flex-row items-center border ${
              errorMessage ? "border-red-500" : "border-gray-200"
            } rounded-full px-4 py-3 bg-white`}
          >
            <TextInput
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor={placeholderTextColor}
              style={tw`flex-1 text-sm text-gray-800 p-0`}
              {...textInputProps}
            />
          </View>
        )}
      />

      {errorMessage && (
        <Text style={tw`text-xs text-red-500 mt-1 ml-2`}>{errorMessage}</Text>
      )}
    </View>
  );
};
