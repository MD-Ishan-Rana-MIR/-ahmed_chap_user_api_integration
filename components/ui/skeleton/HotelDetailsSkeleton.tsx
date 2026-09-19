import { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";

export default function HotelDetailsSkeleton() {
  const insets = useSafeAreaInsets();
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-28`}
      >
        {/* Top Hero Image Skeleton */}
        <View style={tw`relative w-full h-80 bg-gray-200`}>
          <Animated.View
            style={[tw`w-full h-full bg-gray-300`, { opacity: animatedValue }]}
          />

          {/* Floating Top Buttons Skeleton */}
          <View
            style={[
              tw`absolute left-5 right-5 flex-row justify-between items-center`,
              { top: Math.max(insets.top + 8, 20) },
            ]}
          >
            <View style={tw`w-10 h-10 rounded-full bg-white/80`} />
            <View style={tw`w-10 h-10 rounded-full bg-white/80`} />
          </View>

          {/* Thumbnail Gallery Skeleton */}
          <View
            style={tw`absolute bottom-4 left-5 right-5 bg-black/10 p-1.5 rounded-2xl flex-row justify-between items-center`}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <Animated.View
                key={item}
                style={[
                  tw`w-14 h-12 rounded-xl bg-gray-300`,
                  { opacity: animatedValue },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content Body Skeleton */}
        <View style={tw`px-5 pt-5`}>
          {/* Title & Rating Row */}
          <View style={tw`flex-row justify-between items-center mb-2`}>
            <Animated.View
              style={[
                tw`h-7 bg-gray-200 rounded-md w-3/5`,
                { opacity: animatedValue },
              ]}
            />
            <Animated.View
              style={[
                tw`h-5 bg-gray-200 rounded-md w-1/5`,
                { opacity: animatedValue },
              ]}
            />
          </View>

          {/* Location Row */}
          <Animated.View
            style={[
              tw`h-4 bg-gray-200 rounded-md w-2/5 mb-6`,
              { opacity: animatedValue },
            ]}
          />

          {/* Facilities Header & Grid */}
          <Animated.View
            style={[
              tw`h-5 bg-gray-200 rounded-md w-1/3 mb-4`,
              { opacity: animatedValue },
            ]}
          />
          <View style={tw`flex-row justify-around items-center mb-6`}>
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={item} style={tw`items-center`}>
                <Animated.View
                  style={[
                    tw`w-14 h-14 rounded-full bg-gray-200 mb-2`,
                    { opacity: animatedValue },
                  ]}
                />
                <Animated.View
                  style={[
                    tw`h-3 bg-gray-200 rounded-md w-8`,
                    { opacity: animatedValue },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Description Section */}
          <Animated.View
            style={[
              tw`h-5 bg-gray-200 rounded-md w-1/3 mb-3`,
              { opacity: animatedValue },
            ]}
          />
          <Animated.View
            style={[
              tw`h-3.5 bg-gray-200 rounded-md w-full mb-2`,
              { opacity: animatedValue },
            ]}
          />
          <Animated.View
            style={[
              tw`h-3.5 bg-gray-200 rounded-md w-full mb-2`,
              { opacity: animatedValue },
            ]}
          />
          <Animated.View
            style={[
              tw`h-3.5 bg-gray-200 rounded-md w-3/4 mb-6`,
              { opacity: animatedValue },
            ]}
          />

          {/* Feedbacks Section */}
          <Animated.View
            style={[
              tw`h-5 bg-gray-200 rounded-md w-1/3 mb-3`,
              { opacity: animatedValue },
            ]}
          />
          <View style={tw`bg-[#F9FAFB] rounded-2xl p-4 gap-4`}>
            {[1, 2].map((item) => (
              <View key={item} style={tw`gap-2`}>
                <View style={tw`flex-row justify-between`}>
                  <Animated.View
                    style={[
                      tw`h-4 bg-gray-200 rounded-md w-1/3`,
                      { opacity: animatedValue },
                    ]}
                  />
                  <Animated.View
                    style={[
                      tw`h-4 bg-gray-200 rounded-md w-1/4`,
                      { opacity: animatedValue },
                    ]}
                  />
                </View>
                <Animated.View
                  style={[
                    tw`h-3 bg-gray-200 rounded-md w-1/5`,
                    { opacity: animatedValue },
                  ]}
                />
                <Animated.View
                  style={[
                    tw`h-3 bg-gray-200 rounded-md w-full`,
                    { opacity: animatedValue },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar Skeleton */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white px-5 py-3 flex-row justify-between items-center border-t border-gray-100`,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={tw`gap-1`}>
          <Animated.View
            style={[
              tw`h-3 bg-gray-200 rounded-md w-10`,
              { opacity: animatedValue },
            ]}
          />
          <Animated.View
            style={[
              tw`h-6 bg-gray-200 rounded-md w-24`,
              { opacity: animatedValue },
            ]}
          />
        </View>
        <Animated.View
          style={[
            tw`h-12 bg-gray-200 rounded-full w-36`,
            { opacity: animatedValue },
          ]}
        />
      </View>
    </View>
  );
}
