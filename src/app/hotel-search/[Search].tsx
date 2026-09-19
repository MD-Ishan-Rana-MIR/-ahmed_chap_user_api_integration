import { useUserProfileQuery } from "@/redux/authApi";
import { useHotelSearchQuery } from "@/redux/hotelApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "react-native-format-currency";
import { SvgXml } from "react-native-svg";
import tw from "twrnc";
import { NotFoundState } from "../../../components/NotFoundState";
import BackButton from "../../../components/ui/BackButton";
import HotelGridSkeletonList from "../../../components/ui/skeleton/HotelSearchSkeleton";
import { roomQuantity } from "../../../lib/icon";

export interface HotelCardProps {
  id: string;
  title: string;
  location: string;
  price: string | number;
  rating: string | number;
  rooms: string;
  image: string;
}

export default function HotelGridScreen() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { location, date, guests } = useLocalSearchParams();

  const { data, isLoading } = useHotelSearchQuery({
    location: location,
    guest: guests,
  });

  const { data: userProfile } = useUserProfileQuery({});

  if (isLoading) {
    return <HotelGridSkeletonList />;
  }

  const hotelList = data?.data?.properties?.data || [];

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Hotel" showBackButton={true} />

      {/* Header Info Bar */}
      <View style={tw`flex-row justify-between items-center mb-4 px-5 mt-5`}>
        <View style={tw`flex-row items-center gap-1.5`}>
          <Ionicons name="location-outline" size={18} color="#111827" />
          <Text style={tw`text-base font-bold text-gray-900`}>
            {location || "All Locations"}
          </Text>
        </View>
        <Text style={tw`text-xs text-gray-400 font-medium`}>
          {hotelList.length} Hotels found
        </Text>
      </View>

      {/* Grid List or Empty State */}
      {hotelList.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center px-5`}>
          <NotFoundState title="No Hotels Found" />
        </View>
      ) : (
        <FlatList
          data={hotelList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={tw`px-5`}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={tw`justify-between mb-4`}
          renderItem={({ item }) => {
            const isFav = !!favorites[item.id];

            return (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/hotel-details/[id]",
                    params: { id: item?.id },
                  });
                }}
                activeOpacity={0.9}
                style={tw`w-[48.5%] bg-white border border-gray-100 rounded-2xl p-2.5 shadow-xs`}
              >
                {/* Image Container with Badges */}
                <View
                  style={tw`relative w-full h-36 rounded-xl overflow-hidden mb-2.5`}
                >
                  <Image
                    source={{ uri: item?.images?.[0]?.image_url }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />

                  {/* Rooms Badge */}
                  <View
                    style={tw`absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-md flex-row items-center gap-1`}
                  >
                    <SvgXml xml={roomQuantity} color={"#fff"} />
                    <Text style={tw`text-[10px] text-white font-medium`}>
                      {item.room_quantity}
                    </Text>
                  </View>

                  {/* Favorite Button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleFavorite(item.id)}
                    style={tw`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 items-center justify-center`}
                  >
                    <Ionicons
                      name={isFav ? "heart" : "heart-outline"}
                      size={15}
                      color="#FF5A1F"
                    />
                  </TouchableOpacity>
                </View>

                {/* Title */}
                <Text
                  style={tw`text-xs font-bold text-gray-900 mb-1`}
                  numberOfLines={1}
                >
                  {item?.name}
                </Text>

                {/* Location */}
                <View style={tw`flex-row items-center gap-1 mb-2`}>
                  <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                  <Text
                    style={tw`text-[11px] text-gray-400 flex-1`}
                    numberOfLines={1}
                  >
                    {item?.address}
                  </Text>
                </View>

                {/* Price & Rating */}
                <View style={tw`flex-row justify-between items-center mt-auto`}>
                  <Text style={tw`text-xs font-bold text-[#FF5A1F]`}>
                    {
                      formatCurrency({
                        amount: Number(item?.price_per_night ?? 0),
                        code: userProfile?.data?.currency ?? "USD",
                      })[0]
                    }
                    <Text style={tw`text-[10px] font-normal text-gray-400`}>
                      /night
                    </Text>
                  </Text>

                  <View style={tw`flex-row items-center gap-0.5`}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={tw`text-[11px] font-bold text-gray-900`}>
                      {item?.reviews_avg_rating
                        ? Number(item?.reviews_avg_rating).toFixed(1)
                        : "0.0"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
