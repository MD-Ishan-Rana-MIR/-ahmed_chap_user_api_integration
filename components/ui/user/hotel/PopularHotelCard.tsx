import { useUserProfileQuery } from "@/redux/authApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "react-native-format-currency";
import tw from "../../../../lib/tailwind";

export const PopularHotelCard = memo(
  ({ item, isFavorite, onToggleFavorite }) => {
    const { data: profileData } = useUserProfileQuery({});

    return (
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/hotel-details/[id]",
            params: { id: 1 },
          });
        }}
        activeOpacity={0.9}
        style={tw`w-60 bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2 overflow-hidden`}
      >
        <View style={tw`relative w-full h-36 rounded-xl overflow-hidden mb-2`}>
          <Image
            source={{ uri: item?.images[0]?.image_url }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => onToggleFavorite(item.id)}
            activeOpacity={0.8}
            style={tw`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 items-center justify-center shadow-xs`}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={isFavorite ? "#FF5A1F" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={tw`text-sm font-Manrope-SemiBold.ttf text-[#101010] mb-1`}
          numberOfLines={1}
        >
          {item?.name}
        </Text>

        <View style={tw`flex-row items-center gap-0.5 mb-2`}>
          <Ionicons name="location-outline" size={13} color="#9CA3AF" />
          <Text
            style={tw`text-xs font-Manrope-Regular.ttf text-[#606060] flex-1`}
            numberOfLines={1}
          >
            {item?.address || "No Location"}
          </Text>
        </View>

        <View style={tw`flex-row justify-between items-center mt-auto`}>
          <Text style={tw`text-sm font-Manrope-SemiBold.ttf text-[#F86B17]`}>
            {
              formatCurrency({
                amount: Number(item?.price_per_night ?? 0),
                code: profileData?.data?.rider_profile?.currency ?? "USD",
              })[0]
            }
            <Text
              style={tw`text-[10px] font-Manrope-SemiBold.ttf text-[#878787]`}
            >
              /night
            </Text>
          </Text>

          <View style={tw`flex-row items-center gap-1`}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={tw`text-xs font-Manrope-Medium.ttf text-[#101010]`}>
              {Number(item?.reviews_avg_rating || 0).toFixed(1)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);
