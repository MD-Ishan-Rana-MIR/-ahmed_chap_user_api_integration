// components/ui/HotelCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { locationIcon } from "../../lib/icon";
import tw from "../../lib/tailwind";

export interface Hotel {
  id: string;
  title: string;
  location: string;
  rating: number;
  price: number;
  originalPrice: number;
  image: ImageSourcePropType;
}

interface HotelCardProps {
  item: Hotel;
}

export const HotelCard = ({ item }: HotelCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        router.push({
          pathname: "/(user-tab)/hotel-details",
          params: { id: 1 },
        });
      }}
      style={tw`bg-white rounded-2xl p-3 mb-3.5 mx-5 border border-gray-100 flex-row items-center shadow-sm`}
    >
      {/* Hotel Image */}
      <Image
        source={item.image}
        style={tw`w-19 h-19 rounded-[8px] bg-gray-100`}
        resizeMode="cover"
      />

      {/* Content Section */}
      <View style={tw`flex-1 ml-3 justify-between py-0.5`}>
        {/* Header Title & Price */}
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-1`}>
            <Text
              style={tw`text-sm font-Manrope-Bold.ttf text-[#101010]  mb-0.5`}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <View style={tw`flex-row items-center  `}>
              <SvgXml xml={locationIcon} width={15} height={15} />

              <Text
                style={tw`text-xs font-Manrope-Regular.ttf text-[#606060]`}
                numberOfLines={1}
              >
                {item.location}
              </Text>
            </View>
            <View style={tw`ml-1 flex flex-row justify-between items-center `}>
              <View>
                <Text
                  style={tw`text-sm font-Manrope-Regular.ttf text-[#F15A24] mt-1.5 `}
                >
                  ${item.price}/
                  <Text
                    style={tw`text-xs text-[#878787]  font-Manrope-SemiBold.ttf `}
                  >
                    day
                  </Text>
                </Text>
              </View>
              <View style={tw`flex-row items-center `}>
                <Text
                  style={tw`text-xs font-Manrope-Medium.ttf text-[#101010] mr-1`}
                >
                  {item.rating.toFixed(1)}
                </Text>
                <Ionicons name={"star"} size={14} color="#FCB205" />
              </View>
            </View>
          </View>

          {/* Pricing */}
        </View>

        {/* Rating Stars */}
      </View>
    </TouchableOpacity>
  );
};
