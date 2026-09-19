import { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import tw from "twrnc";

// Shimmer Animation Component
const SkeletonItem = ({ style }: { style: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
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
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[{ opacity }, style]} />;
};

// Single Card Skeleton matching PopularHotelCard dimensions
export const PopularHotelCardSkeleton = () => {
  return (
    <View
      style={tw`w-64 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm`}
    >
      {/* Hero Image Skeleton */}
      <View style={tw`relative w-full h-40 bg-gray-200`}>
        <SkeletonItem style={tw`w-full h-full bg-gray-300`} />

        {/* Favorite Icon Skeleton */}
        <View style={tw`absolute top-3 right-3`}>
          <SkeletonItem style={tw`w-8 h-8 rounded-full bg-gray-200`} />
        </View>

        {/* Rating Badge Skeleton */}
        <View style={tw`absolute bottom-3 left-3`}>
          <SkeletonItem style={tw`w-14 h-6 rounded-full bg-gray-200`} />
        </View>
      </View>

      {/* Card Content Skeleton */}
      <View style={tw`p-3.5`}>
        {/* Title Line */}
        <SkeletonItem style={tw`w-3/4 h-5 rounded-md bg-gray-300 mb-2`} />

        {/* Subtitle / Description Lines */}
        <SkeletonItem style={tw`w-full h-3 rounded bg-gray-200 mb-1.5`} />
        <SkeletonItem style={tw`w-2/3 h-3 rounded bg-gray-200 mb-3`} />

        {/* Facility Badges Row */}
        <View style={tw`flex-row gap-1.5 mb-3`}>
          <SkeletonItem style={tw`w-12 h-5 rounded-md bg-gray-200`} />
          <SkeletonItem style={tw`w-10 h-5 rounded-md bg-gray-200`} />
          <SkeletonItem style={tw`w-14 h-5 rounded-md bg-gray-200`} />
        </View>

        {/* Footer Price Row */}
        <View
          style={tw`flex-row justify-between items-center pt-2 border-t border-gray-100`}
        >
          <SkeletonItem style={tw`w-16 h-3 rounded bg-gray-200`} />
          <SkeletonItem style={tw`w-20 h-5 rounded bg-gray-300`} />
        </View>
      </View>
    </View>
  );
};

// Skeleton ScrollView Wrapper
export const PopularHotelSkeletonList = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`gap-3.5 px-5 pb-2 mb-6`}
    >
      {[1, 2, 3, 4, 5, 6, 7].map((key) => (
        <PopularHotelCardSkeleton key={key} />
      ))}
    </ScrollView>
  );
};
