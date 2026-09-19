import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "twrnc";

export interface GenderOption {
  label: string;
  value: string;
}

const DEFAULT_GENDER_OPTIONS: GenderOption[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

interface FormGenderDropdownProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  options?: GenderOption[];
  rules?: RegisterOptions;
  containerStyle?: string;
}

export const FormGenderSelect: React.FC<FormGenderDropdownProps> = ({
  name,
  control,
  errors,
  label,
  placeholder = "Select Gender",
  options = DEFAULT_GENDER_OPTIONS,
  rules,
  containerStyle = "",
}) => {
  const errorMessage = errors[name]?.message as string | undefined;
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

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
          const selectedOption = options.find((opt) => opt.value === value);

          return (
            <>
              {/* Dropdown Field */}
              <Pressable
                onPress={() => setShowGenderDropdown(true)}
                style={tw`flex-row items-center justify-between border ${
                  errorMessage ? "border-red-500" : "border-[#EDF1F3]"
                } rounded-full px-5 py-2.5 bg-white `}
              >
                <Text
                  style={tw`text-base ${
                    selectedOption ? "text-gray-800" : "text-[#ACACAC]"
                  }`}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#ACACAC" />
              </Pressable>

              {/* Selection Bottom Modal */}
              <Modal
                visible={showGenderDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowGenderDropdown(false)}
              >
                <TouchableWithoutFeedback
                  onPress={() => setShowGenderDropdown(false)}
                >
                  <View
                    style={tw`flex-1 bg-black/40 justify-center items-center px-6`}
                  >
                    <TouchableWithoutFeedback>
                      <View style={tw`bg-white rounded-2xl w-full p-4 `}>
                        <Text
                          style={tw`text-base font-semibold text-gray-900 mb-3 px-2`}
                        >
                          {label || "Select Gender"}
                        </Text>
                        {options.map((item, index) => {
                          const isSelected = item.value === value;
                          return (
                            <TouchableOpacity
                              key={item.value}
                              activeOpacity={0.7}
                              onPress={() => {
                                onChange(item.value);
                                setShowGenderDropdown(false);
                              }}
                              style={[
                                tw`flex-row items-center justify-between py-3 px-3 rounded-xl`,
                                isSelected && tw`bg-gray-50`,
                                index !== options.length - 1 &&
                                  tw`border-b border-gray-100`,
                              ]}
                            >
                              <Text
                                style={tw`text-sm ${
                                  isSelected
                                    ? "font-semibold text-[#F25C05]"
                                    : "text-gray-700"
                                }`}
                              >
                                {item.label}
                              </Text>
                              {isSelected && (
                                <Ionicons
                                  name="checkmark"
                                  size={18}
                                  color="#F25C05"
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
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
