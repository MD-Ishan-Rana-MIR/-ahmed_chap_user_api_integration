import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import tw from "twrnc";

export const NotificationSkeletonCard: React.FC = () => {
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
    <View
      style={tw`px-4 py-3.5 border-b border-gray-100 flex-row items-start gap-3 bg-white`}
    >
      {/* Unread Indicator Dot Placeholder */}
      <View style={tw`pt-1.5`}>
        <Animated.View
          style={[tw`w-2.5 h-2.5 rounded-full bg-gray-300`, { opacity }]}
        />
      </View>

      {/* Card Details Placeholder */}
      <View style={tw`flex-1`}>
        {/* Title and Time Row */}
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <Animated.View
            style={[tw`h-4 w-40 bg-gray-300 rounded-md`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-3 w-16 bg-gray-200 rounded-md`, { opacity }]}
          />
        </View>

        {/* Message Line 1 */}
        <Animated.View
          style={[tw`h-3 w-full bg-gray-200 rounded-md mb-1.5`, { opacity }]}
        />

        {/* Message Line 2 */}
        <Animated.View
          style={[tw`h-3 w-3/4 bg-gray-200 rounded-md mb-2`, { opacity }]}
        />

        {/* Bottom Badge Tag Placeholder */}
        <View style={tw`flex-row items-center gap-2 mt-1`}>
          <Animated.View
            style={[tw`h-5 w-20 bg-gray-200 rounded-md`, { opacity }]}
          />
          <Animated.View
            style={[tw`h-4 w-16 bg-gray-200 rounded-md`, { opacity }]}
          />
        </View>
      </View>
    </View>
  );
};

// Component helper to render multiple skeleton list rows
export const NotificationSkeletonList: React.FC<{ count?: number }> = ({
  count = 6,
}) => {
  return (
    <View style={tw`flex-1 bg-white`}>
      {Array.from({ length: count }).map((_, index) => (
        <NotificationSkeletonCard key={index} />
      ))}
    </View>
  );
};
