import {
  useResturantProductAddToCartMutation,
  useResturantProductDetailsQuery,
  useResturantProductFavToggleMutation,
} from "@/redux/restaurantsApi";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Heart,
  Lock,
  ShoppingBag,
  Star,
  Truck,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductDetailsSkeleton } from "../../../components/ui/skeleton/ProductDetailSkeleton";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";

const FEEDBACKS = [
  {
    id: "1",
    name: "Annisa Azalea",
    date: "6 February 2022",
    rating: 4,
    comment:
      "In molestie sed dui nisi, egestas facilisis non. Pharetra, blandit tellus nisl ultrices egestas dui in suspendisse.",
  },
  {
    id: "2",
    name: "Joko Rakaibuming",
    date: "6 February 2022",
    rating: 4,
    comment:
      "In molestie sed dui nisi, egestas facilisis non. Pharetra, blandit tellus nisl ultrices egestas dui in suspendisse.",
  },
  {
    id: "3",
    name: "Savannah Nguyen",
    date: "6 February 2022",
    rating: 4,
    comment:
      "In molestie sed dui nisi, egestas facilisis non. Pharetra, blandit tellus nisl ultrices egestas dui in suspendisse.",
  },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useResturantProductDetailsQuery(id);

  // State Management
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const foodData = data?.data?.food;
  const galleryImages: string[] = data?.data?.images || [];
  const relatedFoods = data?.data?.related_foods || [];

  useEffect(() => {
    if (foodData) {
      setSelectedImage(
        foodData?.primary_image ||
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
      );
      setIsFavorite(!!foodData?.is_favorite);
    }
  }, [foodData]);

  // =============================================== Handle Add Favourites =========================================
  const [resturantProductFavToggle] = useResturantProductFavToggleMutation();

  const handleToggleFavourite = (itemId: string) => {
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
              // Optimistic local toggle for main item
              if (itemId === foodData?.id) {
                setIsFavorite((prev) => !prev);
              }

              const res = await resturantProductFavToggle(itemId).unwrap();
              if (res) {
                return successMsg(res?.message);
              }
            } catch (error: any) {
              // Revert state if error
              if (itemId === foodData?.id) {
                setIsFavorite((prev) => !prev);
              }
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

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <View style={tw`flex-1 bg-[#F6F6F6]`}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100 + insets.bottom,
          paddingTop: Math.max(insets.top, 16),
        }}
      >
        {/* Top Header Banner & Actions */}
        <View style={tw`pb-6 px-5 mt-4`}>
          <View style={tw`flex-row justify-between items-center z-10 mb-2`}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={tw`w-9 h-9 bg-white rounded-full items-center justify-center shadow-xs`}
            >
              <ChevronLeft size={18} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => foodData?.id && handleToggleFavourite(foodData.id)}
              style={tw`w-9 h-9 bg-white rounded-full items-center justify-center shadow-xs`}
            >
              <Heart
                size={16}
                color={isFavorite ? "#F95700" : "#374151"}
                fill={isFavorite ? "#F95700" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          {/* Main Hero Product Image */}
          <View style={tw`w-full h-56 items-center justify-center mb-6`}>
            <Image
              source={{
                uri:
                  selectedImage ||
                  foodData?.primary_image ||
                  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
              }}
              style={tw`w-full h-full`}
              resizeMode="contain"
            />
          </View>

          {/* Image Thumbnails Carousel */}
          {galleryImages.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`gap-x-2.5 justify-center flex-1`}
            >
              {galleryImages.map((img, index) => {
                const isSelected = selectedImage === img;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => setSelectedImage(img)}
                    style={tw`w-13 h-13 rounded-xl overflow-hidden border ${
                      isSelected ? "border-[#F95700]" : "border-gray-200"
                    }`}
                  >
                    <Image
                      source={{ uri: img }}
                      style={tw`w-full h-full`}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Title, Rating & Price */}
        <View style={tw`px-4 pt-2 pb-4`}>
          <View style={tw`flex-row justify-between items-start mb-1`}>
            <Text style={tw`text-lg font-bold text-gray-900 flex-1 mr-2`}>
              {foodData?.name}
            </Text>
            <View style={tw`flex-row items-center gap-x-1`}>
              <Star size={14} color="#EAB308" fill="#EAB308" />
              <Text style={tw`text-xs font-semibold text-gray-800`}>
                {Number(foodData?.rating ?? 0).toFixed(1)}
              </Text>
              <Text style={tw`text-xs text-gray-400`}>
                ({foodData?.reviews_count || 0} Reviews)
              </Text>
            </View>
          </View>

          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-bold text-[#F95700]`}>
              {foodData?.currency || "$"} {foodData?.price}
            </Text>
          </View>

          {/* Description */}
          <Text style={tw`text-xs font-bold text-gray-800 mb-1`}>
            Description
          </Text>
          <Text style={tw`text-[11px] text-gray-500 leading-4 mb-4`}>
            {foodData?.description || "No Description available."}
          </Text>

          {/* Service Perks */}
          <View style={tw`border-t border-b border-gray-200/60 py-3 gap-y-3`}>
            <View style={tw`flex-row items-center gap-x-3`}>
              <Truck size={18} color="#6B7280" />
              <View>
                <Text style={tw`text-xs font-semibold text-gray-800`}>
                  Instant Delivery & Regular Delivery
                </Text>
                <Text style={tw`text-[10px] text-gray-400`}>
                  2-3 business days
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-center gap-x-3`}>
              <Lock size={18} color="#6B7280" />
              <View>
                <Text style={tw`text-xs font-semibold text-gray-800`}>
                  Secure Payment
                </Text>
                <Text style={tw`text-[10px] text-gray-400`}>
                  100% secure transactions
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* You Might Like Grid */}
        {relatedFoods.length > 0 && (
          <View style={tw`px-4 pt-2 pb-4`}>
            <Text style={tw`text-sm font-bold text-gray-900 mb-3`}>
              You Might Like
            </Text>
            <View style={tw`flex-row flex-wrap justify-between`}>
              {relatedFoods.map((item: any) => {
                return (
                  <View key={item.id} style={tw`w-[48.5%] mb-3`}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        router.push({
                          pathname: "/restaurants_product_details/[id]",
                          params: { id: item.id },
                        });
                      }}
                      style={tw`bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2.5 shadow-xs`}
                    >
                      <View
                        style={tw`relative w-full h-28 rounded-xl overflow-hidden mb-2`}
                      >
                        <Image
                          source={{
                            uri:
                              item.primary_image ||
                              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
                          }}
                          style={tw`w-full h-full rounded`}
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
                        {item.name}
                      </Text>

                      <View style={tw`flex-row items-center gap-x-1 mb-2`}>
                        <Star size={11} color="#EAB308" fill="#EAB308" />
                        <Text
                          style={tw`text-[10px] font-semibold text-gray-700`}
                        >
                          {Number(item.rating ?? 0).toFixed(1)}
                        </Text>
                        <Text style={tw`text-[10px] text-gray-400`}>
                          ({item.reviews_count || item.reviews || 0})
                        </Text>
                      </View>

                      <View style={tw`flex-row justify-between items-center`}>
                        <Text style={tw`text-xs font-bold text-[#F95700]`}>
                          {item.currency || "$"} {item.price}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            handleAddToCart(item?.id);
                          }}
                          activeOpacity={0.8}
                          style={tw`w-6 h-6 bg-white rounded-full border border-gray-100 items-center justify-center shadow-xs`}
                        >
                          <ShoppingBag size={11} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* User Feedbacks Section */}
        <View style={tw`px-4 pt-2`}>
          <Text style={tw`text-sm font-bold text-gray-900 mb-3`}>
            User Feedbacks
          </Text>
          <View style={tw`gap-y-3`}>
            {FEEDBACKS.map((review) => (
              <View
                key={review.id}
                style={tw`bg-[#FBFBFB] border border-gray-100 rounded-2xl p-3 shadow-xs`}
              >
                <View style={tw`flex-row justify-between items-center mb-1`}>
                  <Text style={tw`text-xs font-bold text-gray-900`}>
                    {review.name}
                  </Text>
                  <View style={tw`flex-row gap-x-0.5`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        color={s <= review.rating ? "#EAB308" : "#E5E7EB"}
                        fill={s <= review.rating ? "#EAB308" : "#E5E7EB"}
                      />
                    ))}
                  </View>
                </View>

                <Text style={tw`text-[10px] text-gray-400 mb-1.5`}>
                  {review.date}
                </Text>

                <Text style={tw`text-[11px] text-gray-500 leading-4`}>
                  {review.comment}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-3 flex-row items-center gap-x-3 shadow-lg`,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (foodData?.restaurant_id) {
              router.push({
                pathname: "/restaurants_details/[id]",
                params: { id: foodData.restaurant_id },
              });
            } else {
              router.back();
            }
          }}
          activeOpacity={0.8}
          style={tw`flex-1 bg-[#F7F8F3] py-3.5 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-bold text-[#556B2F]`}>Shop Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleAddToCart(data?.data?.food?.id);
          }}
          activeOpacity={0.85}
          style={tw`flex-[#556B2F] flex-1 bg-[#556B2F] py-3.5 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-bold text-white`}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
