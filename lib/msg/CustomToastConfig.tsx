import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";
import tw from "twrnc";

export const toastConfig: ToastConfig = {
  // Custom Success Toast
  success: ({ text1, text2 }) => (
    <View
      style={tw`w-[90%] bg-white border-l-4 border-[#10B981] rounded-2xl p-4 flex-row items-center gap-3 shadow-lg my-2`}
    >
      <View
        style={tw`w-10 h-10 rounded-full bg-emerald-50 items-center justify-center`}
      >
        <Ionicons name="checkmark-circle-sharp" size={24} color="#10B981" />
      </View>

      <View style={tw`flex-1`}>
        {text1 ? (
          <Text style={tw`text-sm font-bold text-gray-900`}>{text1}</Text>
        ) : null}
        {text2 ? (
          <Text style={tw`text-xs text-gray-500 font-medium mt-0.5`}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),

  // Custom Error Toast
  error: ({ text1, text2 }) => (
    <View
      style={tw`w-[90%] bg-white border-l-4 border-[#EF4444] rounded-2xl p-4 flex-row items-center gap-3 shadow-lg my-2`}
    >
      <View
        style={tw`w-10 h-10 rounded-full bg-red-50 items-center justify-center`}
      >
        <Ionicons name="alert-circle-sharp" size={24} color="#EF4444" />
      </View>

      <View style={tw`flex-1`}>
        {text1 ? (
          <Text style={tw`text-sm font-bold text-gray-900`}>{text1}</Text>
        ) : null}
        {text2 ? (
          <Text style={tw`text-xs text-gray-500 font-medium mt-0.5`}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),
};
