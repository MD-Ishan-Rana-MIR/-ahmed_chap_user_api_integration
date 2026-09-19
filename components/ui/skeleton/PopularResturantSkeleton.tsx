import { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import tw from "twrnc";

export default function PopularResturantSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
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
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={tw`flex-1 bg-white px-4 pt-4`}
    >
      {/* Popular Restaurants Header Skeleton */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Animated.View
          style={[tw`w-36 h-5 bg-gray-200 rounded`, { opacity }]}
        />
        <Animated.View
          style={[tw`w-14 h-4 bg-gray-200 rounded`, { opacity }]}
        />
      </View>

      {/* Horizontal Popular Restaurants List Skeleton */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`gap-3 mb-6`}
      >
        {[1, 2].map((key) => (
          <View
            key={key}
            style={tw`w-64 bg-gray-50 border border-gray-100 rounded-2xl p-2`}
          >
            {/* Image Placeholder */}
            <Animated.View
              style={[tw`w-full h-36 bg-gray-200 rounded-xl mb-2`, { opacity }]}
            />
            {/* Title Placeholder */}
            <Animated.View
              style={[tw`w-3/4 h-4 bg-gray-200 rounded mb-2`, { opacity }]}
            />
            {/* Location & Rating Placeholder */}
            <View style={tw`flex-row justify-between items-center`}>
              <Animated.View
                style={[tw`w-1/2 h-3 bg-gray-200 rounded`, { opacity }]}
              />
              <Animated.View
                style={[tw`w-10 h-3 bg-gray-200 rounded`, { opacity }]}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Restaurants Near You Header Skeleton */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Animated.View
          style={[tw`w-40 h-5 bg-gray-200 rounded`, { opacity }]}
        />
        <Animated.View
          style={[tw`w-14 h-4 bg-gray-200 rounded`, { opacity }]}
        />
      </View>

      {/* Vertical Nearby Restaurants List Skeleton */}
      <View style={tw`gap-y-3 pb-6`}>
        {[1, 2, 3, 4].map((key) => (
          <View
            key={key}
            style={tw`flex-row items-center bg-gray-50 border border-gray-100 p-2.5 rounded-2xl`}
          >
            {/* Thumbnail Placeholder */}
            <Animated.View
              style={[tw`w-20 h-20 bg-gray-200 rounded-xl mr-3`, { opacity }]}
            />
            {/* Content Details */}
            <View style={tw`flex-1 justify-center gap-y-2`}>
              <Animated.View
                style={[tw`w-3/4 h-4 bg-gray-200 rounded`, { opacity }]}
              />
              <Animated.View
                style={[tw`w-1/2 h-3 bg-gray-200 rounded`, { opacity }]}
              />
              <View style={tw`flex-row items-center gap-x-3`}>
                <Animated.View
                  style={[tw`w-10 h-3 bg-gray-200 rounded`, { opacity }]}
                />
                <Animated.View
                  style={[tw`w-12 h-3 bg-gray-200 rounded`, { opacity }]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
