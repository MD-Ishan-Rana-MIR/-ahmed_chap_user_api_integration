import {
  useAddFavouriteMutation,
  useGetProductsQuery,
} from "@/redux/eProductApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { ProductCard } from "../ProductCard";
import { ProductFilterModal } from "../ProductFilterModal";

import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import { SubCategoryBar } from "../SubCategoryCard";
import { ProductCardSkeleton } from "../skeleton/ProductCardSkeleton";

export default function ECommerce() {
  const router = useRouter();

  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Fetch Products via RTK Query
  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery(
    {
      category_slug: selectedCategory,
      page: page,
      per_page: 10,
      ...appliedFilters,
    },
  );

  const products = data?.data?.products?.data || [];
  const currentPage = data?.data?.products?.current_page || 1;
  const lastPage = data?.data?.products?.last_page || 1;

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    await refetch();
    setIsRefreshing(false);
  };

  // Handle Category Select & Reset Page
  const handleCategorySelect = (categorySlug: string) => {
    if (selectedCategory === categorySlug) {
      refetch(); // Refetch if tapping the active category
    } else {
      setSelectedCategory(categorySlug);
      setPage(1);
    }
  };

  // Pagination Handler (Scroll to bottom)
  const handleLoadMore = () => {
    if (!isFetching && currentPage < lastPage) {
      setPage((prevPage) => prevPage + 1);
    }
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

  // Filter application handler
  const handleApplyFilter = (filters: any) => {
    setAppliedFilters(filters);
    setPage(1);
    setIsFilterModalOpen(false);
  };

  // Render Footer Loader
  const renderFooter = () => {
    if (!isFetching || page === 1) return null;
    return (
      <View style={tw`py-4 items-center`}>
        <ActivityIndicator size="small" color="#5B7410" />
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="light" />

      {/* Navigation Header */}
      <View
        style={tw`bg-[#5B7410] flex-row items-center justify-between px-5 pb-6 pt-5 rounded-b-[12px]`}
      >
        <View style={tw`flex-row items-center mt-5 gap-3`}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={tw`w-10 h-10 rounded-full border border-white/40 items-center justify-center`}
          >
            <Ionicons name="chevron-back" size={22} color="white" />
          </TouchableOpacity>

          <Text style={tw`text-white text-xl font-medium`}>Shops</Text>
        </View>

        {/* Action Header Icons */}
        <View style={tw`flex-row items-center gap-2 mt-5`}>
          <TouchableOpacity
            onPress={() => setIsFilterModalOpen(true)}
            activeOpacity={0.8}
            style={tw`w-10 h-10 rounded-full border border-white/40 items-center justify-center`}
          >
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={tw`flex-1 mt-5`}>
        {/* Horizontal Subcategories */}
        <View>
          <SubCategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </View>

        {/* Product Grid with Infinite Scroll & Refresh */}
        <View style={tw`flex-1`}>
          {isLoading && page === 1 ? (
            <View style={tw`flex-row flex-wrap justify-between px-5`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => (
                <ProductCardSkeleton key={key} />
              ))}
            </View>
          ) : isError ? (
            <View style={tw`flex-1 items-center justify-center`}>
              <Text style={tw`text-gray-500 mb-3`}>
                Failed to load products
              </Text>
              <TouchableOpacity
                onPress={() => refetch()}
                style={tw`bg-[#5B7410] px-4 py-2 rounded-lg`}
              >
                <Text style={tw`text-white font-medium`}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              numColumns={2}
              contentContainerStyle={tw`px-5 pb-30`}
              columnWrapperStyle={tw`justify-between`}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={["#5B7410"]}
                  tintColor="#5B7410"
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
          )}
        </View>
      </View>

      {/* Filter Modal */}
      <ProductFilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
      />
    </View>
  );
}
