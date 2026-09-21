import { useToggleFavrouiteResMutation } from "@/redux/restaurantsApi";
import { router } from "expo-router";
import { Heart, MapPin, Star } from "lucide-react-native";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";

export interface NearbyRestaurant {
  id: string;
  business_name: string;
  address: string;
  distance_km: string;
  reviews_count: string;
  cover_image_url: string;
  is_favorite?: boolean;
}

interface NearbyRestaurantCardProps {
  item: NearbyRestaurant;
  onPress?: (item: NearbyRestaurant) => void;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
}

export default function NearbyRestaurantCard({
  item,
}: NearbyRestaurantCardProps) {
  const reviewRating = Number(item?.reviews_count ?? 0);
  const distance = Number(item?.distance_km ?? 0);

  // ===================================== Restaurant add Favourite Api =======================================

  const [toggleFavrouiteRes] = useToggleFavrouiteResMutation();

  const handleToggleFavourite = (id: string) => {
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
              const res = await toggleFavrouiteRes(id).unwrap();
              if (res) {
                return successMsg(res?.message);
              }
            } catch (error: any) {
              console.log("errr is", error);
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
      onPress={() => router.push("/restaurants_details/[id]")}
      style={tw`bg-[#FCFCFC] border border-[#F3F3F3] rounded-2xl p-2 flex-row items-center justify-between mb-3 shadow-xs`}
    >
      {/* Left Image & Info */}
      <View style={tw`flex-row items-center gap-x-2.5 flex-1`}>
        <Image
          source={{
            uri:
              item?.cover_image_url ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
          }}
          style={tw`w-28 h-20 rounded-xl`}
          resizeMode="cover"
        />

        <View style={tw`flex-1 justify-center`}>
          <Text style={tw`text-sm font-bold text-gray-900 mb-1.5`}>
            {item?.business_name}
          </Text>

          <View style={tw`flex-row items-center gap-x-1 mb-1.5`}>
            <MapPin size={12} color="#9CA3AF" />
            <Text
              numberOfLines={1}
              style={tw`text-[11px] text-gray-400 flex-1`}
            >
              {item?.address}
            </Text>
          </View>

          <View style={tw`flex-row items-center gap-x-1`}>
            <Star size={12} color="#EAB308" fill="#EAB308" />

            <Text style={tw`text-[11px] font-medium text-gray-500`}>
              {Number.isFinite(reviewRating) ? reviewRating.toFixed(1) : "0.0"}
            </Text>

            <Text style={tw`text-[11px] text-gray-400 mx-0.5`}>•</Text>

            <Text style={tw`text-[11px] text-gray-400`}>
              {Number.isFinite(distance) ? distance.toFixed(1) : "0.0"} km
            </Text>
          </View>
        </View>
      </View>

      {/* Right Favorite Icon */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          handleToggleFavourite(item?.id);
        }}
        style={tw`p-2 self-start`}
      >
        <Heart
          size={18}
          color="#F95700"
          fill={item?.is_favorite ? "#F95700" : "transparent"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
