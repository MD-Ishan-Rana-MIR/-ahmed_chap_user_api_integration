import { Heart, MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

export interface PopularRestaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  isFavorite?: boolean;
}

interface PopularRestaurantCardProps {
  item: PopularRestaurant;
  onPress?: (item: PopularRestaurant) => void;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
}

export default function PopularRestaurantCard({
  item,
  onPress,
  onFavoriteToggle,
}: PopularRestaurantCardProps) {
  const [isFav, setIsFav] = useState(item.isFavorite || false);

  const handleFavorite = () => {
    const newState = !isFav;
    setIsFav(newState);
    onFavoriteToggle?.(item.id, newState);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
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
          onPress={handleFavorite}
          style={tw`absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full items-center justify-center shadow-xs z-10`}
        >
          <Heart
            size={14}
            color={isFav ? "#F95700" : "#F95700"}
            fill={isFav ? "#F95700" : "transparent"}
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
