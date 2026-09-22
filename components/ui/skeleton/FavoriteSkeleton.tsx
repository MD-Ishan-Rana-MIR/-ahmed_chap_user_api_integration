import { View } from "react-native";
import tw from "../../../lib/tailwind";

export function FavoriteSkeleton() {
  return (
    <View style={tw`flex-row flex-wrap justify-between pt-4`}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item) => (
        <View
          key={item}
          style={tw`w-[48.5%] mb-4 bg-gray-200 rounded-2xl p-2.5 h-48 animate-pulse`}
        >
          <View style={tw`w-full h-28 bg-gray-300 rounded-xl mb-2`} />
          <View style={tw`w-3/4 h-3 bg-gray-300 rounded mb-2`} />
          <View style={tw`w-1/2 h-3 bg-gray-300 rounded`} />
        </View>
      ))}
    </View>
  );
}
