import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";

const SkeletonItem = ({ style }: { style: any }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 800, easing: Easing.ease }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[tw`bg-gray-200 rounded-lg`, style, animatedStyle]} />
  );
};

export default function CartSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header Skeleton */}
      <View
        style={[
          tw`flex-row justify-between items-center bg-bgOlive/40 px-5 pb-5 rounded-b-[12px]`,
          { paddingTop: Math.max(insets.top + 12, 40) },
        ]}
      >
        <SkeletonItem style={tw`w-24 h-6 bg-white/50`} />
        <SkeletonItem style={tw`w-16 h-5 bg-white/50`} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom + 90, 110),
        }}
      >
        {/* Merchant Store 1 */}
        <View style={tw`gap-6 px-5 mb-6`}>
          <View
            style={tw`border border-[#E5E5E5] rounded-2xl p-4 bg-white gap-3`}
          >
            {/* Store Header */}
            <View
              style={tw`flex-row items-center gap-2 border-b border-[#F3F3F3] pb-2.5`}
            >
              <SkeletonItem style={tw`w-5 h-5 rounded-full`} />
              <SkeletonItem style={tw`w-32 h-4`} />
              <View style={tw`flex-1`} />
              <SkeletonItem style={tw`w-12 h-3`} />
            </View>

            {/* Cart Items Skeleton */}
            {[1, 2].map((_, index) => (
              <View
                key={index}
                style={tw`flex-row items-center bg-[#F9FAFB] rounded-xl p-2.5`}
              >
                {/* Product Image */}
                <SkeletonItem style={tw`w-20 h-20 rounded-xl mr-3`} />

                {/* Product Details */}
                <View style={tw`flex-1 gap-2`}>
                  <View style={tw`flex-row justify-between items-start`}>
                    <SkeletonItem style={tw`w-3/4 h-3.5`} />
                    <SkeletonItem style={tw`w-4 h-4 rounded-full`} />
                  </View>

                  <SkeletonItem style={tw`w-20 h-2.5`} />

                  <View style={tw`flex-row justify-between items-center mt-1`}>
                    <SkeletonItem style={tw`w-16 h-4`} />
                    <SkeletonItem style={tw`w-20 h-7 rounded-full`} />
                  </View>
                </View>
              </View>
            ))}

            {/* Store Footer */}
            <View
              style={tw`pt-2 border-t border-[#F3F3F3] flex-row justify-between items-center`}
            >
              <SkeletonItem style={tw`w-24 h-3`} />
              <SkeletonItem style={tw`w-24 h-3`} />
            </View>
          </View>
        </View>

        {/* Shipping Address Skeleton */}
        <View style={tw`px-5 mb-6`}>
          <SkeletonItem style={tw`w-28 h-4 mb-2`} />
          <View
            style={tw`border border-[#E5E5E5] rounded-2xl p-3.5 flex-row items-center bg-[#F8F8F8]`}
          >
            <SkeletonItem style={tw`w-12 h-12 rounded-full mr-3`} />
            <View style={tw`flex-1 gap-1.5`}>
              <SkeletonItem style={tw`w-20 h-4`} />
              <SkeletonItem style={tw`w-48 h-3`} />
            </View>
          </View>
        </View>

        {/* Order Summary Skeleton */}
        <View style={tw`px-5 gap-2`}>
          <SkeletonItem style={tw`w-28 h-4 mb-1`} />
          <View
            style={tw`border border-[#E5E5E5] rounded-2xl p-4 bg-white gap-3`}
          >
            <View style={tw`flex-row justify-between`}>
              <SkeletonItem style={tw`w-16 h-3`} />
              <SkeletonItem style={tw`w-16 h-3`} />
            </View>
            <View style={tw`flex-row justify-between`}>
              <SkeletonItem style={tw`w-20 h-3`} />
              <SkeletonItem style={tw`w-16 h-3`} />
            </View>
            <View
              style={tw`border-t border-[#E5E5E5] pt-2 flex-row justify-between`}
            >
              <SkeletonItem style={tw`w-12 h-4`} />
              <SkeletonItem style={tw`w-20 h-4`} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Button Skeleton */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 border-t border-[#F3F3F3]`,
          { paddingBottom: Math.max(insets.bottom + 12, 20) },
        ]}
      >
        <SkeletonItem style={tw`w-full h-13 rounded-full`} />
      </View>
    </View>
  );
}
