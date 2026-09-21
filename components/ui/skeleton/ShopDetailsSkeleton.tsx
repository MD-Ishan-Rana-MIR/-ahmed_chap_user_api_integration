import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";

export const ShopDetailsSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* 1. Banner Image & Back Button Skeleton */}
      <View style={tw`relative h-56 w-full bg-gray-200 animate-pulse`}>
        {/* Back Button Skeleton */}
        <View
          style={[
            tw`absolute left-5 w-10 h-10 rounded-full bg-gray-300 z-10`,
            { top: Math.max(insets.top, 12) },
          ]}
        />
      </View>

      {/* 2. Store Logo & Details Skeleton */}
      <View style={tw`px-5 pb-4`}>
        {/* Overlapping Store Logo */}
        <View
          style={tw`-mt-8 w-25 h-25 rounded-full border-4 border-white bg-gray-300 shadow-md animate-pulse`}
        />

        {/* Store Title & Meta Details Skeleton */}
        <View style={tw`ml-28 -mt-14`}>
          {/* Store Title */}
          <View
            style={tw`h-5 w-36 bg-gray-200 rounded-md mb-2 animate-pulse`}
          />

          {/* Location & Rating Row */}
          <View style={tw`flex-row items-center gap-x-4 mb-3`}>
            <View style={tw`h-3.5 w-16 bg-gray-200 rounded-md animate-pulse`} />
            <View style={tw`h-3.5 w-16 bg-gray-200 rounded-md animate-pulse`} />
          </View>
        </View>

        {/* Description Skeleton */}
        <View style={tw`mt-4 mb-4 gap-y-1.5`}>
          <View style={tw`h-3.5 w-full bg-gray-200 rounded-md animate-pulse`} />
          <View style={tw`h-3.5 w-4/5 bg-gray-200 rounded-md animate-pulse`} />
        </View>

        {/* Tabs Skeleton */}
        <View
          style={tw`flex-row border-b border-gray-200 justify-between pb-3`}
        >
          {[1, 2, 3, 4].map((item) => (
            <View
              key={item}
              style={tw`h-4 w-16 bg-gray-200 rounded-md animate-pulse`}
            />
          ))}
        </View>

        {/* Section Title Skeleton */}
        <View
          style={tw`h-5 w-28 bg-gray-200 rounded-md mt-5 mb-2.5 animate-pulse`}
        />
      </View>

      {/* 3. Product Grid Cards Skeleton (2x3 Grid) */}
      <View style={tw`px-5 gap-y-4`}>
        {[1, 2, 3].map((row) => (
          <View key={row} style={tw`flex-row justify-between`}>
            {[1, 2].map((card) => (
              <View
                key={card}
                style={tw`w-[48%] bg-[#F8F9FA] rounded-2xl p-3 relative`}
              >
                {/* Heart Icon Placeholder */}
                <View
                  style={tw`absolute top-3 right-3 w-5 h-5 bg-gray-200 rounded-full animate-pulse z-10`}
                />

                {/* Product Image Placeholder */}
                <View style={tw`items-center justify-center my-2 h-28`}>
                  <View
                    style={tw`w-24 h-24 bg-gray-200 rounded-xl animate-pulse`}
                  />
                </View>

                {/* Product Meta Row (Title & Rating) */}
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <View
                    style={tw`h-3.5 w-20 bg-gray-200 rounded-md animate-pulse`}
                  />
                  <View
                    style={tw`h-3.5 w-10 bg-gray-200 rounded-md animate-pulse`}
                  />
                </View>

                {/* Price & Cart Button Row */}
                <View style={tw`flex-row justify-between items-center mt-1`}>
                  <View
                    style={tw`h-4 w-14 bg-gray-200 rounded-md animate-pulse`}
                  />
                  <View
                    style={tw`w-7 h-7 rounded-full bg-gray-200 animate-pulse`}
                  />
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};
