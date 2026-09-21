import { useUserProfileQuery } from "@/redux/authApi";
import { useToggleFavoriteHotelMutation } from "@/redux/hotelApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Heart } from "lucide-react-native";
import { memo } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "react-native-format-currency";
import { errorMsg } from "../../../../lib/msg/errorMsg";
import { successMsg } from "../../../../lib/msg/successMsg";
import tw from "../../../../lib/tailwind";

type NearHotelCardProps = {
  item: {
    id?: string | number;
    name?: string;
    images?: { image_url?: string }[];
    is_favorite?: boolean;
    address?: string;
    city?: string;
    price_per_night?: number | string;
    reviews_avg_rating?: number | string;
  };
  refetch: () => void | Promise<void>;
};

export const NearHotelCard = memo(({ item, refetch }: NearHotelCardProps) => {
  const { data: profileData } = useUserProfileQuery({});
  const hotelImage = item?.images?.[0]?.image_url ?? "";

  const [toggleFavoriteHotel] = useToggleFavoriteHotelMutation();

  const handleToggleFavourite = (id?: string | number) => {
    if (id === undefined || id === null) return;

    Alert.alert(
      "Update Favorite",
      "Are you sure you want to change this item's favorite status?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            try {
              const res = await toggleFavoriteHotel(String(id)).unwrap();
              if (res) {
                refetch();
                return successMsg(res?.message);
              }
            } catch (error: any) {
              const errorMessage =
                error?.data?.message ||
                error?.message ||
                "An unexpected error occurred.";
              return errorMsg(errorMessage);
            }
          },
        },
      ],
    );
  };

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
        source={{ uri: hotelImage }}
        style={tw`w-20 h-20 rounded-xl mr-3`}
        resizeMode="cover"
      />

      <View style={tw`flex-1 h-20 justify-between py-0.5`}>
        <View>
          <View style={tw`flex-row items-center justify-between `}>
            <Text
              style={tw`text-sm font-Manrope-SemiBold.ttf text-[#101010] mb-1`}
              numberOfLines={1}
            >
              {(item?.name?.slice(0, 25) || "Hotel") + "..."}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleToggleFavourite(item?.id)}
              style={tw` w-8 h-8 bg-white rounded-full  shadow-xs z-10`}
            >
              <Heart
                size={16}
                color="#F95700"
                fill={item?.is_favorite ? "#F95700" : "transparent"}
              />
            </TouchableOpacity>
          </View>
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
