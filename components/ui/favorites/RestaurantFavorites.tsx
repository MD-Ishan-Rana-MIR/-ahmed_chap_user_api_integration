import {
  RestaurantItem,
  useGetFavoriteRestaurantsQuery,
  useToggleFavrouiteResMutation,
} from "@/redux/restaurantsApi";
import { router } from "expo-router";
import { Heart, MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";
import { NotFoundState } from "../../NotFoundState";
import { FavoriteSkeleton } from "../skeleton/FavoriteSkeleton";

export default function RestaurantFavorites() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isFetching, refetch } =
    useGetFavoriteRestaurantsQuery({ page_no: page, per_page: 20 });

  const restaurants = data?.data?.restaurants?.data || [];
  const currentPage = data?.data?.restaurants?.current_page || 1;
  const lastPage = data?.data?.restaurants?.last_page || 1;

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

  // Single Card Component
  const renderItem = ({ item }: { item: RestaurantItem }) => {
    const defaultImage =
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500";

    return (
      <View style={tw`w-[48.5%] `}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            router.push({
              pathname: "/restaurants_details/[id]",
              params: { id: item.id },
            });
          }}
          style={tw`bg-white border border-gray-100 rounded-2xl p-2.5 shadow-xs`}
        >
          <View
            style={tw`relative w-full h-28 rounded-xl overflow-hidden mb-2 bg-gray-100`}
          >
            <Image
              source={{
                uri:
                  item.profile_image_url ||
                  item.cover_image_url ||
                  defaultImage,
              }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => {
                handleToggleFavourite(String(item?.id));
              }}
              activeOpacity={0.8}
              style={tw`absolute top-2 right-2 w-7 h-7 bg-white rounded-full items-center justify-center shadow-xs z-10`}
            >
              <Heart
                size={18}
                color="#F95700"
                fill={item?.is_favorite ? "#F95700" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          <Text
            numberOfLines={1}
            style={tw`text-xs font-bold text-gray-900 mb-1`}
          >
            {item.business_name}
          </Text>

          <View style={tw`flex-row items-center gap-x-1 mb-1.5`}>
            <MapPin size={11} color="#6B7280" />
            <Text
              numberOfLines={1}
              style={tw`text-[10px] text-gray-500 flex-1`}
            >
              {item.address || item.city}
            </Text>
          </View>

          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center gap-x-1`}>
              <Star size={11} color="#EAB308" fill="#EAB308" />
              <Text style={tw`text-[10px] font-semibold text-gray-700`}>
                {item.reviews_avg_rating
                  ? Number(item.reviews_avg_rating).toFixed(1)
                  : "0.0"}
              </Text>
              <Text style={tw`text-[10px] text-gray-400`}>
                ({item.reviews_count})
              </Text>
            </View>

            <Text style={tw`text-[10px] font-bold text-[#F95700]`}>
              {item.distance_km ? `${item.distance_km.toFixed(1)} km` : ""}
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

  // Not Found / Empty State Component

  if (isLoading && page === 1) {
    return <FavoriteSkeleton />;
  }

  return (
    <View style={tw`flex-1`}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={tw`justify-between`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // paddingTop: Math.max(insets.top, 16),
          paddingBottom: insets.bottom + 20,
          flexGrow: restaurants.length === 0 ? 1 : undefined,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <NotFoundState
            title="No Favorite Restaurants"
            message="You haven't added any restaurants to your favorites yet. Explore and
          save your favorite places!"
          />
        }
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
