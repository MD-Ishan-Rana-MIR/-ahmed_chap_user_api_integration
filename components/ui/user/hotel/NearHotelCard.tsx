import { useUserProfileQuery } from "@/redux/authApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "react-native-format-currency";
import tw from "../../../../lib/tailwind";

export const NearHotelCard = memo(({ item }) => {
  const { data: profileData } = useUserProfileQuery({});

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        router.push({
          pathname: "/hotel-details/[id]",
          params: { id: 1 },
        });
      }}
      style={tw`bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2.5 flex-row items-center`}
    >
      <Image
        source={{ uri: item?.images[0]?.image_url }}
        style={tw`w-20 h-20 rounded-xl mr-3`}
        resizeMode="cover"
      />

      <View style={tw`flex-1 h-20 justify-between py-0.5`}>
        <View>
          <Text
            style={tw`text-sm font-Manrope-SemiBold.ttf text-[#101010] mb-1`}
            numberOfLines={1}
          >
            {item?.name}
          </Text>
          <View style={tw`flex-row items-center gap-0.5 mb-2 mt-1.5`}>
            <Ionicons name="location-outline" size={13} color="#9CA3AF" />
            <Text
              style={tw`text-xs font-Manrope-Regular.ttf text-[#606060]`}
              numberOfLines={1}
            >
              {`${item?.address || ""}${item?.address && item?.city ? ", " : ""}${item?.city || ""}` ||
                "No Address"}
            </Text>
          </View>
          <View style={tw` flex-row items-center justify-between `}>
            <Text
              style={tw`text-sm font-Manrope-SemiBold.ttf text-[#F86B17] ml-1`}
            >
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
              <Ionicons name="star" size={12} color="#FCB205" />
              <Text style={tw`text-xs font-Manrope-Medium.ttf text-[#101010]`}>
                {Number(item?.reviews_avg_rating || 0).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row justify-between items-center`}></View>
      </View>
    </TouchableOpacity>
  );
});
