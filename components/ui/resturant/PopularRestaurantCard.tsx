import { useToggleFavrouiteResMutation } from "@/redux/restaurantsApi";
import { router } from "expo-router";
import { Heart, MapPin, Star } from "lucide-react-native";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";

export interface PopularRestaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  is_favorite: boolean;
  business_name: string;
  address: string;
  cover_image_url: string;
  reviews_count: number;
}

interface PopularRestaurantCardProps {
  item: PopularRestaurant;
}

export default function PopularRestaurantCard({
  item,
}: PopularRestaurantCardProps) {
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
      onPress={() =>
        router.push({
          pathname: "/restaurants_details/[id]",
          params: { id: item?.id },
        })
      }
      style={tw`bg-[#FCFCFC] border border-gray-100 rounded-2xl p-2.5 w-60 mr-4 shadow-xs`}
    >
      {/* Image Container with Floating Heart Button */}
      <View style={tw`relative w-full h-36 rounded-xl overflow-hidden mb-3`}>
        <Image
          source={{
            uri:
              item?.cover_image_url ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
          }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handleToggleFavourite(item?.id);
          }}
          style={tw`absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full items-center justify-center shadow-xs z-10`}
        >
          <Heart
            size={14}
            color={item?.is_favorite ? "#F95700" : "#F95700"}
            fill={item?.is_favorite ? "#F95700" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={tw`px-1 pb-1`}>
        <View style={tw`flex-row justify-between items-center mb-1`}>
          <Text
            numberOfLines={1}
            style={tw`text-sm font-bold text-gray-900 flex-1 mr-2`}
          >
            {item?.business_name}
          </Text>
          <View style={tw`flex-row items-center gap-x-1`}>
            <Star size={13} color="#EAB308" fill="#EAB308" />
            <Text style={tw`text-xs font-semibold text-gray-700`}>
              {Number(item?.reviews_count?.toFixed(1))}
            </Text>
          </View>
        </View>

        <View style={tw`flex-row items-center gap-x-1`}>
          <MapPin size={12} color="#9CA3AF" />
          <Text numberOfLines={1} style={tw`text-[11px] text-gray-400 flex-1`}>
            {item?.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
