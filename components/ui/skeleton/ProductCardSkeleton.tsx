import { View } from "react-native";
import tw from "../../../lib/tailwind";

// 1. Skeleton Loading Component (Matches ProductCard Design)
export const ProductCardSkeleton = () => {
  return (
    <View
      style={tw`bg-[#F8F9FA] rounded-2xl p-3 w-[48%] mb-3.5 flex-col justify-between`}
    >
      {/* Image Wrapper Skeleton */}
      <View
        style={tw`w-full h-36 bg-white rounded-xl items-center justify-center p-2 mb-2.5`}
      >
        <View style={tw`w-full h-full bg-gray-200 rounded-lg opacity-60`} />
      </View>

      {/* Information Skeleton */}
      <View>
        {/* Title & Rating Skeleton */}
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <View style={tw`w-20 h-3 bg-gray-200 rounded opacity-60 mr-1`} />
          <View style={tw`w-10 h-3 bg-gray-200 rounded opacity-60`} />
        </View>

        {/* Price & Cart Skeleton */}
        <View style={tw`flex-row items-center justify-between mt-1`}>
          <View style={tw`w-14 h-4 bg-gray-200 rounded opacity-60`} />
          <View style={tw`w-7 h-7 bg-gray-200 rounded-full opacity-60`} />
        </View>
      </View>
    </View>
  );
};
