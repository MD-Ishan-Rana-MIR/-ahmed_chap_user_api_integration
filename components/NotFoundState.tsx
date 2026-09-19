import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

interface NotFoundProps {
  title?: string;
  message?: string;
}

export const NotFoundState: React.FC<NotFoundProps> = ({
  title = "No Deliveries Found",
  message = "Accept a delivery to get started",
}) => {
  return (
    <View style={tw`flex-1 justify-center`}>
      <View style={tw`flex-1 items-center justify-center p-6 my-10 bg-white`}>
        <View
          style={tw`w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4`}
        >
          <Feather name="inbox" size={36} color="#9CA3AF" />
        </View>
        <Text style={tw`text-lg font-bold text-gray-800 text-center mb-1`}>
          {title}
        </Text>
        <Text style={tw`text-sm text-gray-500 text-center leading-5`}>
          {message}
        </Text>
      </View>
    </View>
  );
};
