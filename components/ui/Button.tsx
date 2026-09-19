import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { plusIcon } from "../../lib/icon";
import tw from "../../lib/tailwind";

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
  showIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  text,
  disabled = false,
  isLoading = false,
  showIcon = false,
}) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isButtonDisabled}
      style={tw`bg-[#5B7410] py-3.5  rounded-full items-center justify-center mb-6 ${
        isButtonDisabled ? "opacity-50" : "opacity-100"
      }`}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={tw`flex-row items-center gap-x-2`}>
          {showIcon && <SvgXml xml={plusIcon} width={12} />}
          <Text style={tw`text-white font-semibold text-sm`}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
