import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type SlideItem = {
  id: string;
  title: string;
  description: string;
  heroImage?: ImageSourcePropType;
  images?: {
    col1?: ImageSourcePropType[];
    col2?: ImageSourcePropType[];
    col3?: ImageSourcePropType[];
  };
};

const SLIDES: SlideItem[] = [
  {
    id: "1",
    title: "Everything You Need, All In One App",
    description:
      "Shop products, order food, book hotels and buses, and track deliveries all from one place.",
    images: {
      col1: [
        {
          uri: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
        },
        {
          uri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        },
        {
          uri: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        },
      ],
      col2: [
        {
          uri: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500",
        },
        {
          uri: "https://images.unsplash.com/photo-1608248597260-22684948f296?w=500",
        },
        {
          uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
        },
      ],
      col3: [
        {
          uri: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
        },
        {
          uri: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500",
        },
        {
          uri: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
        },
      ],
    },
  },
  {
    id: "2",
    title: "Discover More, Shop More, Experience More.",
    description:
      "Browse trusted merchants, discover products, and order what you need with ease.",
    heroImage: require("../../../assets/onboarding/onboarding-1.png"),
  },
  {
    id: "3",
    title: "Book Hotels & Bus Tickets, Made Easy",
    description:
      "Browse trusted merchants, discover products, and order what you need with ease.",
    heroImage: require("../../../assets/onboarding/onboarding-2.png"),
  },
  {
    id: "4",
    title: "Your Next Journey Starts With One Tap",
    description:
      "Find the right bus, choose your preferred seat, and book your ticket in just a few taps.",
    heroImage: require("../../../assets/onboarding/onboarding-3.png"),
  },
];

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      router.push("/(auth)/Login");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        {/* Horizontal Slider */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
              <View style={tw`flex-1 justify-between`}>
                {/* Visual Area: Hero Single Image or 3-Column Collage Grid */}
                <View style={tw`relative flex-1 overflow-hidden `}>
                  {item.heroImage ? (
                    /* Single Image Layout (Slides 2 & 3) */
                    <View style={tw`flex-1  overflow-hidden`}>
                      <Image
                        source={item.heroImage}
                        style={tw`w-full h-full`}
                        resizeMode="cover"
                      />
                    </View>
                  ) : (
                    /* Dynamic Multi-Column Collage (Slide 1) */
                    <View style={tw`flex-row gap-2.5 justify-center flex-1`}>
                      {/* Column 1 */}
                      <View style={tw`flex-1 gap-2.5`}>
                        {item.images?.col1?.map(
                          (imgSource: ImageSourcePropType, imgIdx: number) => (
                            <Image
                              key={imgIdx}
                              source={imgSource}
                              style={tw`w-full ${
                                imgIdx === 0 ? "h-28" : "h-44"
                              } rounded-2xl`}
                              resizeMode="cover"
                            />
                          ),
                        )}
                      </View>

                      {/* Column 2 */}
                      <View style={tw`flex-1 gap-2.5`}>
                        {item.images?.col2?.map(
                          (imgSource: ImageSourcePropType, imgIdx: number) => (
                            <Image
                              key={imgIdx}
                              source={imgSource}
                              style={tw`w-full ${
                                imgIdx === 0 ? "h-28" : "h-44"
                              } rounded-2xl`}
                              resizeMode="cover"
                            />
                          ),
                        )}
                      </View>

                      {/* Column 3 */}
                      <View style={tw`flex-1 gap-2.5`}>
                        {item.images?.col3?.map(
                          (imgSource: ImageSourcePropType, imgIdx: number) => (
                            <Image
                              key={imgIdx}
                              source={imgSource}
                              style={tw`w-full ${
                                imgIdx === 0 ? "h-28" : "h-44"
                              } rounded-2xl`}
                              resizeMode="cover"
                            />
                          ),
                        )}
                      </View>
                    </View>
                  )}

                  {/* Bottom Gradient Overlay */}
                </View>

                {/* Text Content */}
                <View style={tw`px-6 pt-2`}>
                  <Text
                    style={tw`text-[32px] font-bold text-gray-900 leading-[38px] mb-3`}
                  >
                    {item.title}
                  </Text>
                  <Text style={tw`text-base text-gray-500 leading-6`}>
                    {item.description}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />

        {/* Bottom Navigation & Controls */}
        <View style={tw`px-6 pb-8 pt-4  `}>
          {/* Dynamic Pagination Indicators */}
          <View style={tw`flex-row items-center gap-2 mb-6`}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={tw`${
                  activeIndex === index
                    ? "w-8 bg-[#F86B17]"
                    : "w-2.5 bg-[#C0BFBF]"
                } h-2.5 rounded-full`}
              />
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
            style={tw`bg-[#5A7314] py-4 rounded-full items-center justify-center`}
          >
            <Text style={tw`text-white font-semibold text-base`}>
              {activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
