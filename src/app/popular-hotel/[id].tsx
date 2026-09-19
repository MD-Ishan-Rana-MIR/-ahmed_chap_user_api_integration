import { useGetPopularHotelsQuery } from "@/redux/hotelApi";
import { router } from "expo-router";
import { Heart, MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../components/ui/BackButton";
import PopularHotelSkeletonList from "../../../components/ui/skeleton/PopularHotelSkeleton";
import tw from "../../../lib/tailwind";

export interface HotelItem {
  id: string | number;
  name?: string;
  title?: string;
  address?: string;
  city?: string;
  country?: string;
  location?: string;
  avg_rating?: number;
  rating?: number;
  thumbnail?: string;
  image?: string;
  images?: Array<string | { image_url?: string }>;
}

export default function PopularHotel() {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetPopularHotelsQuery({
    page,
    perPage: 5,
  });

  const propertiesList: HotelItem[] = response?.data?.properties?.data || [];
  const lastPage = response?.data?.properties?.last_page || 1;

  const toggleFavorite = (id: string | number) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLoadMore = () => {
    if (!isFetching && page < lastPage) {
      setPage((prev) => prev + 1);
    }
  };

  // 1. Image extraction logic fix
  const getHotelImage = (item: HotelItem): string => {
    if (typeof item.image === "string" && item.image) return item.image;
    if (typeof item.thumbnail === "string" && item.thumbnail)
      return item.thumbnail;

    if (Array.isArray(item.images) && item.images.length > 0) {
      const firstImg = item.images[0];
      if (typeof firstImg === "string") return firstImg;
      if (firstImg?.image_url) return firstImg.image_url;
    }

    return "https://via.placeholder.com/500";
  };

  // 2. Location string extraction
  const getHotelLocation = (item: HotelItem) => {
    if (item.location) return item.location;
    if (item.address) return item.address;
    if (item.city || item.country) {
      return `${item.city || ""}, ${item.country || ""}`.trim();
    }
    return "Location unavailable";
  };

  if (isLoading && page === 1) {
    return <PopularHotelSkeletonList />;
  }

  return (
    <View style={tw`w-full flex-1 bg-white`}>
      <BackButton title="Popular Hotel" />

      <FlatList
        data={propertiesList}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 mt-5 gap-y-4 pb-6`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !isLoading ? (
            <View
              style={tw`bg-[#FCFCFC] border border-dashed border-gray-200 rounded-2xl p-6 items-center justify-center mt-10`}
            >
              <Text style={tw`text-base font-bold text-gray-700 mb-1`}>
                No Hotels Found
              </Text>
              <Text style={tw`text-xs text-gray-400 text-center`}>
                We couldn't find any popular hotels right now.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetching && page > 1 ? (
            <View style={tw`py-4 items-center justify-center`}>
              <ActivityIndicator size="small" color="#F95700" />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const itemId = String(item.id);
          const isFav = !!favorites[itemId];
          const hotelName = item.name || item.title || "Untitled Hotel";
          const hotelRating = Number(item.rating || item.avg_rating || 0);

          return (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/hotel-details/[id]",
                  params: { id: itemId },
                });
              }}
              activeOpacity={0.9}
              style={tw`w-full bg-[#FCFCFC] border border-gray-100 rounded-2xl p-2.5 shadow-xs`}
            >
              <View
                style={tw`relative w-full h-44 rounded-xl overflow-hidden mb-3`}
              >
                <Image
                  source={{ uri: getHotelImage(item) }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleFavorite(itemId)}
                  style={tw`absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full items-center justify-center shadow-xs z-10`}
                >
                  <Heart
                    size={16}
                    color="#F95700"
                    fill={isFav ? "#F95700" : "transparent"}
                  />
                </TouchableOpacity>
              </View>

              <View style={tw`px-1 pb-1`}>
                <View style={tw`flex-row justify-between items-center mb-1`}>
                  <Text
                    numberOfLines={1}
                    style={tw`text-base font-bold text-gray-900 flex-1 mr-2`}
                  >
                    {hotelName}
                  </Text>
                  <View style={tw`flex-row items-center gap-x-1`}>
                    <Star size={14} color="#EAB308" fill="#EAB308" />
                    <Text style={tw`text-xs font-semibold text-gray-700`}>
                      {hotelRating.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <View style={tw`flex-row items-center gap-x-1`}>
                  <MapPin size={13} color="#9CA3AF" />
                  <Text
                    numberOfLines={1}
                    style={tw`text-xs text-gray-400 flex-1`}
                  >
                    {getHotelLocation(item)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
