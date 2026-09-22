import {
  useAddFavouriteMutation,
  useGetProductsQuery,
} from "@/redux/eProductApi";
import { useStoreDetailsQuery } from "@/redux/storeApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { NotFoundState } from "../../../components/NotFoundState";
import { ShopDetailsSkeleton } from "../../../components/ui/skeleton/ShopDetailsSkeleton";
import { phoneIcon } from "../../../lib/icon";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";

const defaultImage = require("../../../assets/product/product.png");

export default function ShopDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [page, setPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);

  // 1. Fetch Store Details (Renamed data -> storeData, isLoading -> isStoreLoading)
  const { data: storeData, isLoading: isStoreLoading } =
    useStoreDetailsQuery(id);
  const TABS = storeData?.data?.categories || [];
  const highlyRecommendedProduct = storeData?.data?.highly_recommended || [];

  // Set default active tab
  useEffect(() => {
    if (TABS.length > 0 && !activeTab) {
      setActiveTab(TABS[0]?.slug || TABS[0]?.name?.toLowerCase());
    }
  }, [TABS]);

  // 2. Fetch Products via RTK Query
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery(
    {
      category_slug: activeTab,
      page: page,
      per_page: 10,
    },
    { skip: !activeTab },
  );

  const products = productsData?.data?.products?.data || [];
  const currentPage = productsData?.data?.products?.current_page || 1;
  const lastPage = productsData?.data?.products?.last_page || 1;

  //=============================================== Handle Add Favourites =========================================

  const [addFavourite] = useAddFavouriteMutation();

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

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    await refetch();
    setIsRefreshing(false);
  };

  // Category Tab Selection
  const handleCategorySelect = (categorySlug: string) => {
    if (activeTab === categorySlug) {
      refetch();
    } else {
      setActiveTab(categorySlug);
      setPage(1);
    }
  };

  // Infinite Scroll Handler
  const handleLoadMore = () => {
    if (!isFetching && currentPage < lastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (isStoreLoading) {
    return <ShopDetailsSkeleton />;
  }

  // --- Render Header Component ---
  const renderHeader = () => (
    <View style={tw`bg-white`}>
      {/* Banner Image & Back Button */}
      <View style={tw`relative h-56 w-full bg-gray-200`}>
        <Image
          source={
            profileError || !storeData?.data?.store?.profile_image_url
              ? defaultImage
              : { uri: storeData?.data?.store?.profile_image_url }
          }
          onError={() => setProfileError(true)}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={[
            tw`absolute left-5 w-10 h-10 rounded-full bg-white items-center justify-center shadow-md z-10`,
            { top: Math.max(insets.top, 12) },
          ]}
        >
          <Ionicons name="chevron-back" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Store Logo & Details */}
      <View style={tw`px-5 pb-4`}>
        <View
          style={tw`-mt-8 w-25 h-25 rounded-full border-4 border-white bg-white overflow-hidden shadow-md items-center justify-center`}
        >
          <Image
            source={
              coverError || !storeData?.data?.store?.cover_image_url
                ? defaultImage
                : { uri: storeData?.data?.store?.cover_image_url }
            }
            onError={() => setCoverError(true)}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>

        <View style={tw`ml-28 -mt-14`}>
          <Text
            style={tw`text-[16px] font-Manrope-SemiBold text-[#303030] mb-1.5`}
          >
            {storeData?.data?.store?.business_name || "Store"}
          </Text>

          <View style={tw`flex-row items-center gap-x-3 mb-3`}>
            <View style={tw`flex-row items-center gap-1.5`}>
              <SvgXml
                xml={phoneIcon}
                width={14}
                height={14}
                color={"#505050"}
              />
              <Text style={tw`text-xs text-[#505050] font-Manrope-Regular`}>
                {storeData?.data?.store?.phone_number}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={tw`text-sm text-[#757575] mt-4 leading-5 mb-4`}>
          {storeData?.data?.store?.description || "No description available."}
        </Text>

        {/* --- HIGHLY RECOMMENDED SECTION --- */}
        {highlyRecommendedProduct.length > 0 && (
          <View style={tw`mb-5`}>
            <Text
              style={tw`text-[16px] font-Manrope-SemiBold text-[#222222] mb-3`}
            >
              Highly Recommended
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`gap-x-3`}
            >
              {highlyRecommendedProduct.map((recItem: any) => {
                const itemImage =
                  recItem?.primary_image || recItem?.images?.[0];

                return (
                  <TouchableOpacity
                    key={recItem?.id}
                    activeOpacity={0.9}
                    onPress={() =>
                      router.push({
                        pathname: "/product-details/[id]" as any,
                        params: { id: recItem?.id },
                      })
                    }
                    style={tw`w-38 bg-[#F8F9FA] rounded-2xl p-3 relative border border-gray-100`}
                  >
                    {/* Favorite Icon */}
                    <TouchableOpacity
                      onPress={() => handleToggleFavourite(recItem?.id)}
                      activeOpacity={0.8}
                      style={tw`absolute top-2.5 right-2.5 z-10`}
                    >
                      <Ionicons
                        name={recItem?.is_favorite ? "heart" : "heart-outline"}
                        size={16}
                        color={recItem?.is_favorite ? "#EF4444" : "#FF6B00"}
                      />
                    </TouchableOpacity>

                    {/* Image */}
                    <View style={tw`items-center justify-center my-1 h-20`}>
                      <Image
                        source={itemImage ? { uri: itemImage } : defaultImage}
                        style={tw`w-16 h-16`}
                        resizeMode="contain"
                      />
                    </View>

                    {/* Title */}
                    <Text
                      style={tw`text-xs font-Manrope-SemiBold text-[#303030] mt-1`}
                      numberOfLines={1}
                    >
                      {recItem?.name}
                    </Text>

                    {/* Category */}
                    <Text
                      style={tw`text-[10px] text-gray-400 font-Manrope-Regular`}
                      numberOfLines={1}
                    >
                      {recItem?.category?.name}
                    </Text>

                    {/* Price & Unit */}
                    <View
                      style={tw`flex-row justify-between items-center mt-2`}
                    >
                      <Text
                        style={tw`text-xs font-Manrope-SemiBold text-[#F86B17]`}
                      >
                        {recItem?.currency || "KES"} {recItem?.price}
                      </Text>

                      <Text
                        style={tw`text-[10px] text-gray-500 font-Manrope-Regular`}
                      >
                        /{parseFloat(recItem?.unit_value || "1")}
                        {recItem?.unit_type}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Dynamic Category Tabs */}
        <View style={tw`flex-row border-b border-gray-200 justify-between`}>
          {TABS.map((tab: any) => {
            const tabKey = tab?.slug || tab?.name?.toLowerCase();
            const isActive = activeTab === tabKey;
            return (
              <TouchableOpacity
                key={tab?.id || tabKey}
                onPress={() => handleCategorySelect(tabKey)}
                activeOpacity={0.7}
                style={tw`pb-3 px-1 border-b-2 ${
                  isActive ? "border-[#F86B17]" : "border-transparent"
                }`}
              >
                <Text
                  style={tw`text-xs font-Manrope-Medium ${
                    isActive ? "text-[#F86B17]" : "text-[#B1B1B1]"
                  }`}
                >
                  {tab?.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section Title */}
        <Text
          style={tw`text-[16px] font-Manrope-SemiBold text-[#222222] mt-5 mb-1`}
        >
          All Products
        </Text>
      </View>
    </View>
  );

  // --- Render Main Products Item ---
  const renderProductItem = ({ item }: { item: any }) => {
    const itemImage = item?.primary_image || item?.images?.[0];

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/product-details/[id]" as any,
            params: { id: item?.id },
          })
        }
        style={tw`flex-1 m-5 bg-[#F8F9FA] rounded-2xl p-3 border border-gray-100 relative`}
      >
        <TouchableOpacity
          onPress={() => handleToggleFavourite(item?.id)}
          activeOpacity={0.8}
          style={tw`absolute top-2.5 right-2.5 z-10`}
        >
          <Ionicons
            name={item?.is_favorite ? "heart" : "heart-outline"}
            size={16}
            color={item?.is_favorite ? "#EF4444" : "#FF6B00"}
          />
        </TouchableOpacity>

        <View style={tw`items-center justify-center h-24 my-1`}>
          <Image
            source={itemImage ? { uri: itemImage } : defaultImage}
            style={tw`w-20 h-20`}
            resizeMode="contain"
          />
        </View>

        <Text
          style={tw`text-xs font-Manrope-SemiBold text-[#303030] mt-1`}
          numberOfLines={1}
        >
          {item?.name}
        </Text>

        <Text style={tw`text-[10px] text-gray-400`} numberOfLines={1}>
          {item?.category?.name}
        </Text>

        <View style={tw`flex-row justify-between items-center mt-2`}>
          <Text style={tw`text-xs font-Manrope-SemiBold text-[#F86B17]`}>
            {item?.currency || "KES"} {item?.price}
          </Text>
          <Text style={tw`text-[10px] text-gray-500`}>
            /{parseFloat(item?.unit_value || "1")}
            {item?.unit_type}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isStoreLoading) {
    return <ShopDetailsSkeleton />;
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="dark" />

      <FlatList
        data={products}
        keyExtractor={(item: any) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        renderItem={renderProductItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          isFetching && page > 1 ? (
            <View style={tw`py-4`}>
              <ActivityIndicator size="small" color="#F86B17" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isProductsLoading ? (
            <NotFoundState
              title={`No products found in ${activeTab || "this category"}`}
            />
          ) : (
            <ActivityIndicator style={tw`my-10`} color="#F86B17" />
          )
        }
        contentContainerStyle={tw` pb-6`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
