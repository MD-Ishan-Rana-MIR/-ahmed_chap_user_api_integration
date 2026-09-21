import { ArrowLeft } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import tw from "../../../lib/tailwind"; // Adjust import to your tailwind path

// ============================================ Skeleton Loader Component ============================================
const SkeletonItem = ({ style }: { style: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[{ opacity, backgroundColor: "#E5E7EB" }, style]} />
  );
};

const RestaurantDetailSkeleton = () => {
  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Header Image Skeleton */}
        <View style={tw`relative w-full h-60 bg-gray-100`}>
          <SkeletonItem style={tw`w-full h-full`} />
          <View
            style={tw`absolute top-12 left-4 w-9 h-9 bg-white/80 rounded-full items-center justify-center`}
          >
            <ArrowLeft size={18} color="#9CA3AF" />
          </View>
        </View>

        {/* Profile Info Section Skeleton */}
        <View style={tw`px-4 pt-3 pb-4 border-b border-gray-100 relative`}>
          <View style={tw`flex-row items-end mb-3`}>
            {/* Avatar Skeleton */}
            <View
              style={tw`-mt-12 border-4 border-white rounded-full bg-white overflow-hidden shadow-sm`}
            >
              <SkeletonItem style={tw`w-20 h-20 rounded-full`} />
            </View>
          </View>

          {/* Title & Stats Skeleton */}
          <SkeletonItem style={tw`w-48 h-6 rounded-md mb-2`} />
          <View style={tw`flex-row items-center gap-x-4 mb-3`}>
            <SkeletonItem style={tw`w-16 h-4 rounded-md`} />
            <SkeletonItem style={tw`w-20 h-4 rounded-md`} />
          </View>

          {/* Description Skeleton */}
          <SkeletonItem style={tw`w-full h-3 rounded-md mb-1.5`} />
          <SkeletonItem style={tw`w-3/4 h-3 rounded-md`} />
        </View>

        {/* Highly Recommended Section Skeleton */}
        <View style={tw`pt-4 pb-2 border-b border-gray-100`}>
          <SkeletonItem style={tw`mx-4 w-40 h-5 rounded-md mb-3`} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`px-4 gap-x-3`}
          >
            {[1, 2, 3].map((key) => (
              <View
                key={key}
                style={tw`w-40 bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2.5 mb-2`}
              >
                <SkeletonItem style={tw`w-full h-28 rounded-xl mb-2`} />
                <SkeletonItem style={tw`w-24 h-3.5 rounded-md mb-2`} />
                <SkeletonItem style={tw`w-16 h-3 rounded-md mb-3`} />
                <View style={tw`flex-row justify-between items-center`}>
                  <SkeletonItem style={tw`w-10 h-4 rounded-md`} />
                  <SkeletonItem style={tw`w-6 h-6 rounded-full`} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Menu Title Skeleton */}
        <View style={tw`px-4 pt-5 pb-3`}>
          <SkeletonItem style={tw`w-36 h-5 rounded-md`} />
        </View>

        {/* Food Items Grid Skeleton (2 Columns) */}
        <View style={tw`px-4 pb-8 flex-row flex-wrap justify-between`}>
          {[1, 2, 3, 4].map((key) => (
            <View key={key} style={tw`w-[48.5%] mb-4`}>
              <View
                style={tw`bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2.5`}
              >
                <SkeletonItem style={tw`w-full h-32 rounded-xl mb-2.5`} />
                <SkeletonItem style={tw`w-28 h-3.5 rounded-md mb-2`} />
                <SkeletonItem style={tw`w-20 h-3 rounded-md mb-3`} />
                <View style={tw`flex-row justify-between items-center`}>
                  <SkeletonItem style={tw`w-12 h-4 rounded-md`} />
                  <SkeletonItem style={tw`w-7 h-7 rounded-full`} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default RestaurantDetailSkeleton;
