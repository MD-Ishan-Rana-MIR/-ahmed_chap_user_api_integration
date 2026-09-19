import { Heart, MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

export interface RestaurantItem {
  id: number | string;
  business_name?: string;
  name?: string;
  city?: string;
  country?: string;
  address?: string;
  reviews_avg_rating?: number | null;
  cover_image_url?: string | null;
  image?: string;
  is_favorite?: boolean;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500";

export const AllPopularRestaurantCard = ({
  item,
}: {
  item: RestaurantItem;
}) => {
  const [isFav, setIsFav] = useState(item?.is_favorite || false);

  // Fallback handlers
  const title = item?.business_name || item?.name || "Restaurant";
  const locationText =
    item?.city && item?.country
      ? `${item.city}, ${item.country}`
      : item?.address || "Location unavailable";
  const rating = item?.reviews_avg_rating
    ? item.reviews_avg_rating.toFixed(1)
    : "4.8";
  const imageUrl = item?.cover_image_url || item?.image || DEFAULT_IMAGE;

  return (
    <View
      style={tw`bg-white rounded-2xl border border-gray-100 p-3 shadow-sm mb-4`}
    >
      {/* Image & Heart Button Container */}
      <View style={tw`relative w-full h-44 rounded-xl overflow-hidden mb-3`}>
        <Image
          source={{ uri: imageUrl }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />

        {/* Floating Heart Icon */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsFav(!isFav)}
          style={tw`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 items-center justify-center shadow-md`}
        >
          <Heart
            size={16}
            color={isFav ? "#EF4444" : "#F95700"}
            fill={isFav ? "#EF4444" : "none"}
          />
        </TouchableOpacity>
      </View>

      {/* Details Footer */}
      <View style={tw`px-1`}>
        {/* Title and Rating Row */}
        <View style={tw`flex-row justify-between items-center mb-1`}>
          <Text
            numberOfLines={1}
            style={tw`text-base font-bold text-gray-900 flex-1 mr-2`}
          >
            {title}
          </Text>

          <View style={tw`flex-row items-center gap-x-1`}>
            <Star size={14} color="#EAB308" fill="#EAB308" />
            <Text style={tw`text-sm font-semibold text-gray-700`}>
              {rating}
            </Text>
          </View>
        </View>

        {/* Location Row */}
        <View style={tw`flex-row items-center gap-x-1`}>
          <MapPin size={14} color="#9CA3AF" />
          <Text numberOfLines={1} style={tw`text-xs text-gray-400 flex-1`}>
            {locationText}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AllPopularRestaurantCard;
