import {
  useResturantDetailsQuery,
  useResturantProductAddToCartMutation,
  useResturantProductFavToggleMutation,
} from "@/redux/restaurantsApi";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Heart,
  MapPin,
  ShoppingBag,
  Star,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RestaurantDetailSkeleton from "../../../components/ui/skeleton/RestaurantDetailSkeleton";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind"; // Adjust import to your tailwind path

interface FoodItem {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: string;
  image: string;
}

interface CategoryItem {
  id?: string | number;
  name?: string;
  slug?: string;
}

const BURGER_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "Beef Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
  },
  {
    id: "2",
    name: "Cheese Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500",
  },
  {
    id: "3",
    name: "Chicken Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500",
  },
  {
    id: "4",
    name: "Grilled Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500",
  },
];

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();

  // ======================================= Restaurant Details Api =========================================
  const { data, isLoading } = useResturantDetailsQuery(id);

  const highlyRecommended = data?.data?.highly_recommended || [];
  const CATEGORIES: CategoryItem[] = data?.data?.categories || [];

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (CATEGORIES.length > 0 && !activeCategory) {
      const firstCategoryVal = CATEGORIES[0]?.slug || CATEGORIES[0]?.name || "";
      setActiveCategory(firstCategoryVal);
    }
  }, [CATEGORIES]);

  // const toggleFavorite = (itemId: string) => {

  // };

  //=============================================== Handle Add Favourites =========================================

  const [resturantProductFavToggle] = useResturantProductFavToggleMutation();

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
              const res = await resturantProductFavToggle(id).unwrap();
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

  // ============================================ Add To Cart Api ===================================================

  const [resturantProductAddToCart] = useResturantProductAddToCartMutation();

  const handleAddToCart = (id: string, quantity: number = 1) => {
    const payload = {
      product_id: id,
    };

    Alert.alert(
      "Add to Cart",
      "Are you sure you want to add this item to your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add",
          style: "default",
          onPress: async () => {
            try {
              const res = await resturantProductAddToCart(payload).unwrap();
              if (res) {
                return successMsg(res?.message || "Item added to cart!");
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

  //  resturant product menu

  const menuList = data?.data?.menu || [];

  if (isLoading) {
    return <RestaurantDetailSkeleton />;
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Header Image */}
        <View style={tw`relative w-full h-60 bg-gray-100`}>
          <Image
            source={{
              uri:
                data?.data?.restaurant?.cover_image_url ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200",
            }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={tw`absolute top-12 left-4 w-9 h-9 bg-white rounded-full items-center justify-center shadow-xs z-10`}
          >
            <ArrowLeft size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Profile Info Section */}
        <View style={tw`px-4 pt-3 pb-4 border-b border-gray-100 relative`}>
          <View style={tw`flex-row items-end mb-3`}>
            {/* Circular Avatar overlap */}
            <View
              style={tw`-mt-12 border-4 border-white rounded-full bg-white overflow-hidden shadow-sm`}
            >
              <Image
                source={{
                  uri:
                    data?.data?.restaurant?.profile_image_url ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200",
                }}
                style={tw`w-20 h-20 rounded-full`}
              />
            </View>
          </View>

          {/* Title & Stats */}
          <Text style={tw`text-xl font-bold text-gray-900 mb-1`}>
            {data?.data?.restaurant?.business_name}
          </Text>

          <View style={tw`flex-row items-center gap-x-4 mb-3`}>
            <View style={tw`flex-row items-center gap-x-1`}>
              <MapPin size={14} color="#9CA3AF" />
              <Text style={tw`text-xs text-gray-500 font-medium`}>
                {Number(data?.data?.restaurant?.distance_km ?? 0).toFixed(2)}km
              </Text>
            </View>

            <View style={tw`flex-row items-center gap-x-1`}>
              <Star size={14} color="#EAB308" fill="#EAB308" />
              <Text style={tw`text-xs font-semibold text-gray-800`}>
                {Number(
                  data?.data?.restaurant?.reviews_avg_rating ?? 0,
                ).toFixed(1)}
              </Text>
              <Text style={tw`text-xs text-gray-400`}>
                ({data?.data?.restaurant?.reviews_count || 0})
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={tw`text-xs text-gray-400 leading-5`}>
            {data?.data?.restaurant?.description || "No Description"}
          </Text>
        </View>

        {/* Highly Recommended Section (Horizontal List) */}
        {highlyRecommended.length > 0 && (
          <View style={tw`pt-4 pb-2 border-b border-gray-100`}>
            <Text style={tw`px-4 text-base font-bold text-gray-900 mb-3`}>
              Highly Recommended
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`px-4 gap-x-3`}
            >
              {highlyRecommended.map((item: any) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    onPress={() =>
                      router.push({
                        pathname: "/restaurants_product_details/[id]",
                        params: { id: item.id },
                      })
                    }
                    style={tw`w-40 bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2.5 shadow-xs mb-2`}
                  >
                    <View
                      style={tw`relative w-full h-28 rounded-xl overflow-hidden mb-2`}
                    >
                      <Image
                        source={{
                          uri:
                            item.image_url ||
                            item.image ||
                            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
                        }}
                        style={tw`w-full h-full`}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleToggleFavourite(item.id)}
                        style={tw`absolute top-2 right-2 w-6 h-6 bg-white rounded-full items-center justify-center shadow-xs z-10`}
                      >
                        <Heart
                          size={12}
                          color="#F95700"
                          fill={item?.is_favorite ? "#F95700" : "transparent"}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text
                      numberOfLines={1}
                      style={tw`text-xs font-bold text-gray-900 mb-1`}
                    >
                      {item.name || item.title}
                    </Text>

                    <View style={tw`flex-row items-center gap-x-1 mb-2`}>
                      <Star size={11} color="#EAB308" fill="#EAB308" />
                      <Text style={tw`text-[10px] font-semibold text-gray-700`}>
                        {item.rating ?? "4.5"}
                        {item.reviews_count && (
                          <Text style={tw`text-[10px] text-gray-400`}>
                            ({item.reviews_count})
                          </Text>
                        )}
                      </Text>
                    </View>

                    <View style={tw`flex-row justify-between items-center`}>
                      <Text style={tw`text-xs font-bold text-[#F95700]`}>
                        ${item.price}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={tw`w-6 h-6 bg-white rounded-full border border-gray-100 items-center justify-center shadow-xs`}
                      >
                        <ShoppingBag size={11} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Category Tabs */}
        {/* {CATEGORIES.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`border-b border-gray-100`}
            contentContainerStyle={tw`px-4`}
          >
            {CATEGORIES.map((category: CategoryItem, index: number) => {
              const categoryVal =
                category?.slug || category?.name || String(index);
              const isActive = activeCategory === categoryVal;

              return (
                <TouchableOpacity
                  key={category?.id || index}
                  activeOpacity={0.8}
                  onPress={() => setActiveCategory(categoryVal)}
                  style={tw`py-3.5 mr-8 border-b-2 ${
                    isActive ? "border-[#F95700]" : "border-transparent"
                  }`}
                >
                  <Text
                    style={tw`text-xs font-semibold ${
                      isActive ? "text-[#F95700]" : "text-gray-400"
                    }`}
                  >
                    {category?.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )} */}

        {/* Grid Title */}
        <View style={tw`px-4 pt-5 pb-3`}>
          <Text style={tw`text-base font-bold text-gray-900 capitalize`}>
            Restaurants Menu
          </Text>
        </View>

        {/* Food Items Grid (2 Columns) */}
        <View style={tw`px-4 pb-8 flex-row flex-wrap justify-between`}>
          {menuList.map((item) => {
            return (
              <View key={item.id} style={tw`w-[48.5%] mb-4`}>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/restaurants_product_details/[id]",
                      params: { id: item.id },
                    });
                  }}
                  activeOpacity={0.9}
                  style={tw`bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2.5 shadow-xs`}
                >
                  {/* Image with Heart Button */}
                  <View
                    style={tw`relative w-full h-32 rounded-xl overflow-hidden mb-2.5`}
                  >
                    <Image
                      source={{
                        uri:
                          item.primary_image ||
                          item.primary_image ||
                          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
                      }}
                      style={tw`w-full h-full`}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleToggleFavourite(item.id)}
                      style={tw`absolute top-2 right-2 w-7 h-7 bg-white rounded-full items-center justify-center shadow-xs z-10`}
                    >
                      <Heart
                        size={14}
                        color="#F95700"
                        fill={item?.is_favorite ? "#F95700" : "transparent"}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Title & Rating */}
                  <Text
                    numberOfLines={1}
                    style={tw`text-xs font-bold text-gray-900 mb-1`}
                  >
                    {item.name}
                  </Text>

                  <View style={tw`flex-row items-center gap-x-1 mb-2`}>
                    <Star size={12} color="#EAB308" fill="#EAB308" />
                    <Text style={tw`text-[11px] font-semibold text-gray-700`}>
                      {item.rating}
                    </Text>
                    <Text style={tw`text-[11px] text-gray-400`}>
                      ({item.reviews_count})
                    </Text>
                  </View>

                  {/* Price & Add to Cart */}
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`text-sm font-bold text-[#F95700]`}>
                      {Number(item.price.toFixed(0))} {item?.currency}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleAddToCart(item?.id);
                      }}
                      activeOpacity={0.8}
                      style={tw`w-7 h-7 bg-white rounded-full border border-gray-100 items-center justify-center shadow-xs`}
                    >
                      <ShoppingBag size={13} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
