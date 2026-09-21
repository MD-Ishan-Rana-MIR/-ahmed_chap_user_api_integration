import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "../../../../lib/tailwind";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

type BannerLink = Parameters<typeof router.push>[0];

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: any;
  link?: BannerLink;
}

const BANNERS: BannerItem[] = [
  {
    id: "1",
    title: "Everything you need,\nall in one place",
    subtitle: "Shop, eat, travel and more with chapplus",
    buttonText: "Explore Now",
    link: "/all-category",
    image: require("../../../../assets/product/product.png"),
  },
  {
    id: "2",
    title: "Fresh Groceries\nDelivered Fast",
    subtitle: "Get organic items delivered right to your doorstep",
    buttonText: "Shop Now",
    link: "/shops" as BannerLink,
    image: require("../../../../assets/product/product.png"),
  },
  {
    id: "3",
    title: "Exclusive Deals\nEvery Single Day",
    subtitle: "Save big on your favorite everyday essentials",
    buttonText: "Claim Deals",
    image: require("../../../../assets/product/product.png"),
  },
];

const PromoSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SLIDE_WIDTH);
    setActiveIndex(index);
  };

  const renderItem = ({ item }: { item: BannerItem }) => (
    <View style={[{ width: SLIDE_WIDTH }, tw`pr-2`]}>
      {/* Linear Gradient Container */}
      <LinearGradient
        colors={["#6C8914", "#485D0A"]} // Olive green gradient stops
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={tw`rounded-2xl pl-5 py-5 relative overflow-hidden flex-row items-center h-52`}
      >
        {/* Left Side Content */}
        <View style={tw`w-[62%] z-10 justify-between h-full py-1`}>
          <View>
            <Text
              style={tw`text-white font-bold text-[16px] leading-6 tracking-tight mb-2`}
            >
              {item.title}
            </Text>
            <Text style={tw`text-white/85 text-xs leading-4 mb-4`}>
              {item.subtitle}
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={tw`bg-white self-start flex-row items-center rounded-full pl-4 pr-1.5 py-1.5 gap-2`}
            onPress={() => {
              if (item.link) {
                router.push(item.link);
              }
            }}
          >
            <Text style={tw`text-[#F15A24] font-bold text-xs`}>
              {item.buttonText}
            </Text>
            <View
              style={tw`w-7 h-7 bg-[#F15A24] rounded-full items-center justify-center`}
            >
              <Ionicons name="arrow-forward" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Right Side Graphic */}
        <View
          style={tw`absolute -right-2 top-0 bottom-0 w-[45%] justify-center`}
        >
          <Image
            source={item.image}
            style={tw`w-full h-full`}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={tw`my-4`}>
      {/* Slider Scroll Area */}
      <FlatList
        data={BANNERS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLIDE_WIDTH}
        decelerationRate="fast"
        onScroll={handleScroll}
        contentContainerStyle={tw`px-4`}
        scrollEventThrottle={16}
      />

      {/* Pagination Dots */}
      <View style={tw`flex-row justify-center items-center mt-3 gap-1.5`}>
        {BANNERS.map((_, index) => {
          const isActive = activeIndex === index;
          return (
            <View
              key={index}
              style={tw`${
                isActive ? "w-7 bg-[#F15A24]" : "w-2 bg-[#FDC4B2]"
              } h-2 rounded-full`}
            />
          );
        })}
      </View>
    </View>
  );
};

export default PromoSlider;
