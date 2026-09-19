import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    Control,
    Controller,
    FieldErrors,
    RegisterOptions,
} from "react-hook-form";
import { Platform, Pressable, Text, View } from "react-native";
import tw from "twrnc";

interface FormDatePickerProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  containerStyle?: string;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  control,
  errors,
  label,
  placeholder = "DD/MM/YY",
  rules,
  containerStyle = "",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const errorMessage = errors[name]?.message as string | undefined;

  // Format Date object to DD/MM/YY string
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={tw`${containerStyle}`}>
      {label && (
        <Text style={tw`text-sm text-gray-700 font-medium mb-1.5`}>
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => {
          const selectedDate = value ? new Date(value) : new Date();

          const handleDateChange = (
            _event: DateTimePickerEvent,
            date?: Date,
          ) => {
            if (Platform.OS === "android") {
              setShowPicker(false);
            }
            if (date) {
              onChange(date.toISOString());
            }
          };

          const displayValue = value ? formatDate(new Date(value)) : "";

          return (
            <>
              {/* Pill-shaped Input Container */}
              <Pressable
                onPress={() => setShowPicker(true)}
                style={tw`flex-row items-center justify-between border ${
                  errorMessage ? "border-red-500" : "border-[#EDF1F3]"
                } rounded-full px-5 py-2.5 bg-white shadow-sm`}
              >
                <Text
                  style={tw`text-base ${
                    displayValue ? "text-gray-800" : "text-[#ACACAC]"
                  }`}
                >
                  {displayValue || placeholder}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#ACACAC" />
              </Pressable>

              {/* Native Date Picker Modal */}
              {showPicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()} // Restricts future dates for birth dates
                />
              )}
            </>
          );
        }}
      />

      {errorMessage && (
        <Text style={tw`text-xs text-red-500 mt-1 ml-2`}>{errorMessage}</Text>
      )}
    </View>
  );
};
