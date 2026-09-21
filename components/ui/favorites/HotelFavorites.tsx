import { useGetFavoriteHotelsQuery } from "@/redux/hotelApi";
import { Building2, Heart, MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";
import { HotelItem } from "../../../lib/type";
import { PopularHotelSkeletonItem } from "../skeleton/PopularHotelSkeleton";

export default function HotelFavorites() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isFetching, refetch } = useGetFavoriteHotelsQuery({
    page_no: page,
    per_page: 10,
  });

  const hotels = data?.data?.properties?.data || [];
  const currentPage = data?.data?.properties?.current_page || 1;
  const lastPage = data?.data?.properties?.last_page || 1;

  // Infinite Scroll Handler
  const handleLoadMore = () => {
    if (!isFetching && currentPage < lastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Pull to Refresh Handler
  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  // Card Item Renderer
  const renderItem = ({ item }: { item: HotelItem }) => {
    const primaryImg =
      item.images.find((img) => img.is_primary)?.image_url ||
      item.images[0]?.image_url ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500";

    const currencySymbol = item.merchant_profile?.currency || "$";

    return (
      <View style={tw`w-[48.5%] mb-4`}>
        <TouchableOpacity
          activeOpacity={0.9}
          // onPress={() => {
          //   router.push({
          //     pathname: "/hotel_details/[id]",
          //     params: { id: item.id },
          //   });
          // }}
          style={tw`bg-white border border-gray-100 rounded-2xl p-2.5 shadow-xs`}
        >
          {/* Image Header */}
          <View
            style={tw`relative w-full h-28 rounded-xl overflow-hidden mb-2 bg-gray-100`}
          >
            <Image
              source={{ uri: primaryImg }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={tw`absolute top-2 right-2 w-7 h-7 bg-white rounded-full items-center justify-center shadow-xs z-10`}
            >
              <Heart size={14} color="#F95700" fill="#F95700" />
            </TouchableOpacity>
          </View>

          {/* Hotel Name */}
          <Text
            numberOfLines={1}
            style={tw`text-xs font-bold text-gray-900 mb-1`}
          >
            {item.name}
          </Text>

          {/* Location */}
          <View style={tw`flex-row items-center gap-x-1 mb-1.5`}>
            <MapPin size={11} color="#6B7280" />
            <Text
              numberOfLines={1}
              style={tw`text-[10px] text-gray-500 flex-1`}
            >
              {item.address || item.city}
            </Text>
          </View>

          {/* Rating & Price */}
          <View
            style={tw`flex-row justify-between items-center mt-1 border-t border-gray-100 pt-1.5`}
          >
            <View style={tw`flex-row items-center gap-x-0.5`}>
              <Star size={11} color="#EAB308" fill="#EAB308" />
              <Text style={tw`text-[10px] font-semibold text-gray-700`}>
                {item.reviews_avg_rating
                  ? Number(item.reviews_avg_rating).toFixed(1)
                  : "0.0"}
              </Text>
              <Text style={tw`text-[9px] text-gray-400`}>
                ({item.reviews_count})
              </Text>
            </View>

            <Text style={tw`text-[11px] font-bold text-[#F95700]`}>
              {currencySymbol}
              {item.price_per_night}
              <Text style={tw`text-[8px] font-normal text-gray-400`}>
                /night
              </Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Footer Loader for Scroll Pagination
  const renderFooter = () => {
    if (!isFetching || page === 1) return null;
    return (
      <View style={tw`py-4 items-center justify-center`}>
        <ActivityIndicator size="small" color="#F95700" />
      </View>
    );
  };

  // Empty State
  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={tw`flex-1 items-center justify-center py-20 px-6`}>
        <View
          style={tw`w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4`}
        >
          <Building2 size={36} color="#F95700" />
        </View>
        <Text style={tw`text-base font-bold text-gray-900 mb-1 text-center`}>
          No Favorite Hotels
        </Text>
        <Text
          style={tw`text-xs text-gray-500 text-center leading-4 max-w-[250px]`}
        >
          You haven't saved any hotels to your favorites yet. Explore places to
          stay!
        </Text>
      </View>
    );
  };

  if (isLoading && page === 1) {
    return <PopularHotelSkeletonItem />;
  }

  return (
    <View style={tw`flex-1 `}>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={tw`justify-between`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // paddingTop: Math.max(insets.top, 16),
          paddingBottom: insets.bottom + 20,
          flexGrow: hotels.length === 0 ? 1 : undefined,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
            colors={["#F95700"]}
            tintColor="#F95700"
          />
        }
      />
    </View>
  );
}
