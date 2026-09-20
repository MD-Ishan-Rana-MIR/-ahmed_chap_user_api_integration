import { View } from "react-native";
import tw from "twrnc";

export const OrderSkeleton = () => {
  return (
    <View style={tw`gap-y-3 px-4 pt-2`}>
      {[1, 2, 3].map((key) => (
        <View
          key={key}
          style={tw`bg-gray-100 rounded-xl p-4 border border-gray-200`}
        >
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <View style={tw`w-24 h-4 bg-gray-300 rounded`} />
            <View style={tw`w-16 h-5 bg-gray-300 rounded-full`} />
          </View>
          <View style={tw`flex-row items-center gap-x-3 mb-3`}>
            <View style={tw`w-14 h-14 bg-gray-300 rounded-lg`} />
            <View style={tw`flex-1 gap-y-2`}>
              <View style={tw`w-3/4 h-4 bg-gray-300 rounded`} />
              <View style={tw`w-1/2 h-3 bg-gray-300 rounded`} />
            </View>
          </View>
          <View
            style={tw`flex-row justify-between items-center pt-2 border-t border-gray-200`}
          >
            <View style={tw`w-20 h-4 bg-gray-300 rounded`} />
            <View style={tw`w-24 h-8 bg-gray-300 rounded-lg`} />
          </View>
        </View>
      ))}
    </View>
  );
};
