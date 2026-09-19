import { View } from "react-native";
import tw from "../../../lib/tailwind";

export default function AddressSkeleton() {
  return (
    <View
      style={tw`bg-[#FCFCFC] rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden`}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
        <View
          key={index}
          style={[
            tw`flex-row items-center justify-between py-4 px-4 bg-white`,
            index !== 2 && tw`border-b border-gray-100`,
          ]}
        >
          {/* Left Side: Icon & Line Skeletons */}
          <View style={tw`flex-row items-center gap-x-3.5 flex-1 mr-2`}>
            {/* Circle Icon Skeleton */}
            <View
              style={tw`w-11 h-11 rounded-full bg-gray-200 animate-pulse`}
            />

            {/* Text Lines Skeletons */}
            <View style={tw`flex-1 gap-y-2`}>
              <View
                style={tw`h-3.5 bg-gray-200 rounded-md w-1/3 animate-pulse`}
              />
              <View
                style={tw`h-3 bg-gray-100 rounded-md w-3/4 animate-pulse`}
              />
            </View>
          </View>

          {/* Right Side: Action Icons Skeleton */}
          <View style={tw`flex-row items-center gap-x-3`}>
            <View style={tw`w-5 h-5 rounded-md bg-gray-200 animate-pulse`} />
            <View style={tw`w-5 h-5 rounded-md bg-gray-200 animate-pulse`} />
          </View>
        </View>
      ))}
    </View>
  );
}
