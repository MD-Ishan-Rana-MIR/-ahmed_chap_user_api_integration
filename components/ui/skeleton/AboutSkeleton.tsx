import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import tw from "../../../lib/tailwind";

export const AboutSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Continuous pulse animation cycle
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Content Container */}
      <View style={tw`px-5 pt-5 gap-y-5`}>
        {/* Main Title Skeleton */}
        <Animated.View
          style={[tw`h-6 w-1/2 bg-gray-200 rounded-md`, { opacity }]}
        />

        {/* Paragraph 1 Skeleton (4 lines) */}
        <View style={tw`gap-y-2.5`}>
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-3/4 bg-gray-200 rounded-sm`, { opacity }]}
          />
        </View>

        {/* Paragraph 2 Skeleton (3 lines) */}
        <View style={tw`gap-y-2.5 pt-2`}>
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-2/3 bg-gray-200 rounded-sm`, { opacity }]}
          />
        </View>

        {/* Paragraph 3 Skeleton (3 lines) */}
        <View style={tw`gap-y-2.5 pt-2`}>
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-2/3 bg-gray-200 rounded-sm`, { opacity }]}
          />
        </View>

        <View style={tw`gap-y-2.5 pt-2`}>
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-2/3 bg-gray-200 rounded-sm`, { opacity }]}
          />
        </View>

        {/* Paragraph 1 Skeleton (4 lines) */}
        <View style={tw`gap-y-2.5`}>
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-3/4 bg-gray-200 rounded-sm`, { opacity }]}
          />
        </View>

        {/* Paragraph 2 Skeleton (3 lines) */}
        <View style={tw`gap-y-2.5 pt-2`}>
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-2/3 bg-gray-200 rounded-sm`, { opacity }]}
          />
        </View>

        {/* Paragraph 3 Skeleton (3 lines) */}
        <View style={tw`gap-y-2.5 pt-2`}>
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-2/3 bg-gray-200 rounded-sm`, { opacity }]}
          />
        </View>

        <View style={tw`gap-y-2.5 pt-2`}>
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-full bg-gray-200 rounded-sm`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3.5 w-2/3 bg-gray-200 rounded-sm`, { opacity }]}
          />
        </View>
      </View>
    </View>
  );
};
