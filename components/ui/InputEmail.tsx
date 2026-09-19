import React from "react";
import {
    Control,
    Controller,
    FieldErrors,
    RegisterOptions,
} from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";
import tw from "twrnc";

interface FormInputProps extends Omit<
  TextInputProps,
  "onChangeText" | "value"
> {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  rules?: RegisterOptions;
  containerStyle?: string;
}

export const InputEmail: React.FC<FormInputProps> = ({
  name,
  control,
  errors,
  label,
  rules,
  containerStyle = "",
  placeholderTextColor = "#ACACAC",
  ...textInputProps
}) => {
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <View style={tw`${containerStyle}`}>
      {label && <Text style={tw`text-sm text-[#757575] mb-1.5`}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={tw`flex-row items-center border ${
              errorMessage ? "border-red-500" : "border-[#EDF1F3]"
            } rounded-[25.58px] px-3 py-0 shadow-[#E4E5E73D]`}
          >
            <TextInput
              style={tw`flex-1 text-base text-gray-900`}
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              {...textInputProps}
            />
          </View>
        )}
      />

      {errorMessage && (
        <Text style={tw`text-xs text-red-500 mt-1 ml-1`}>{errorMessage}</Text>
      )}
    </View>
  );
};
