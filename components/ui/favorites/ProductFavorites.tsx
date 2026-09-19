import {
    useAddFavouriteMutation,
    useAllFavoritesProductQuery,
} from "@/redux/eProductApi";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { NotFoundState } from "../../../components/NotFoundState";
import { ProductCard } from "../../../components/ui/ProductCard";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";
import { ProductCardSkeleton } from "../skeleton/ProductCardSkeleton";

export default function ProductFavorites() {
  const { data, isLoading, isError, refetch } = useAllFavoritesProductQuery({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const products = data?.data?.products || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  //=============================================== Handle Add Favourites =========================================

  const [addFavourite] = useAddFavouriteMutation();

  // Favorite toggle handler
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
              const res = await addFavourite(id).unwrap();
              if (res) {
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

  if (isLoading) {
    return (
      <View style={tw`flex-row flex-wrap justify-between`}>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <ProductCardSkeleton key={key} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`py-12 items-center justify-center`}>
        <Text style={tw`text-gray-500 mb-3`}>Failed to load products</Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={tw`bg-[#FF5A1F] px-4 py-2 rounded-lg`}
        >
          <Text style={tw`text-white font-medium`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={tw`py-12 items-center justify-center`}>
        <NotFoundState title="No Favorite Products Found" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={tw`justify-between mb-4`}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={["#FF5A1F"]}
          tintColor="#FF5A1F"
        />
      }
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onFavoriteToggle={() => handleToggleFavourite(item.id)}
          onPress={() =>
            router.push({
              pathname: "/product-details/[id]",
              params: { id: item?.id },
            })
          }
        />
      )}
    />
  );
}
