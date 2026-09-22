import { View } from "react-native";
import tw from "twrnc";

export function BusSkeleton() {
  return (
    <View
      style={tw`mb-3 p-4 bg-white rounded-xl border border-gray-100 shadow-xs animate-pulse`}
    >
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <View style={tw`w-32 h-4 bg-gray-200 rounded`} />
        <View style={tw`w-16 h-4 bg-gray-200 rounded`} />
      </View>
      <View style={tw`flex-row justify-between items-center my-2`}>
        <View style={tw`w-20 h-5 bg-gray-200 rounded`} />
        <View style={tw`w-16 h-3 bg-gray-200 rounded`} />
        <View style={tw`w-20 h-5 bg-gray-200 rounded`} />
      </View>
      <View
        style={tw`flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100`}
      >
        <View style={tw`w-24 h-4 bg-gray-200 rounded`} />
        <View style={tw`w-28 h-8 bg-gray-300 rounded-lg`} />
      </View>
    </View>
  );
}
