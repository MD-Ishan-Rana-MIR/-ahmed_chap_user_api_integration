import {
  useAddFavouriteMutation,
  useAddToCartMutation,
  useProductDetailsQuery,
} from "@/redux/eProductApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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

// Mock Data
const PRODUCT_IMAGES = [
  require("../../../assets/product/product.png"),
  require("../../../assets/product/product.png"),
  require("../../../assets/product/product.png"),
  require("../../../assets/product/product.png"),
  require("../../../assets/product/product.png"),
];

const REVIEWS = [
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
    name: "Joko Rakabuming",
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

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id?: string; title?: string }>();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data, isLoading } = useProductDetailsQuery(id);

  const relatedProduct = data?.data?.related_products || [];

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

  // ============================================ Add To Cart Api ===================================================

  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = (id: string, quantity: number = 1) => {
    const payload = {
      product_id: id,
      quantity,
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
              const res = await addToCart(payload).unwrap();
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
    <ProductDetailsSkeleton />;
  }

  return (
    <View style={tw`flex-1 bg-[#F6F6F6]`}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section & Navigation */}
        <View style={tw`bg-[#F8F9FA] relative pt-4 pb-6 px-5`}>
          {/* Top Bar Floating Buttons */}
          <View
            style={[
              tw`flex-row justify-between items-center z-10 w-full absolute left-5 right-5`,
              { top: Math.max(insets.top, 12) },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={tw`w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm`}
            >
              <Ionicons name="chevron-back" size={20} color="#1F2937" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleToggleFavourite(data?.data?.product?.id)}
              activeOpacity={0.8}
              style={tw`w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm`}
            >
              <Ionicons
                name={
                  data?.data?.product?.is_favorite ? "heart" : "heart-outline"
                }
                size={20}
                color={data?.data?.product?.is_favorite ? "#EF4444" : "#1F2937"}
              />
            </TouchableOpacity>
          </View>

          {/* Featured Image */}
          <View style={tw`items-center justify-center mt-12 mb-4 h-64`}>
            <Image
              source={PRODUCT_IMAGES[selectedImageIndex]}
              style={tw`w-64 h-64`}
              resizeMode="contain"
            />
          </View>

          {/* Thumbnail Strip */}
          <View style={tw`flex-row justify-center items-center gap-2.5 mt-2`}>
            {PRODUCT_IMAGES.map((img, index) => {
              const isSelected = selectedImageIndex === index;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  activeOpacity={0.8}
                  style={tw`w-13 h-13 rounded-xl bg-white border ${
                    isSelected ? "border-[#5B7410] p-0.5" : "border-gray-200"
                  } items-center justify-center overflow-hidden`}
                >
                  <Image
                    source={img}
                    style={tw`w-full h-full rounded-lg`}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Product Meta Info */}
        <View style={tw`px-5 pt-5`}>
          {/* Title & Rating */}
          <View style={tw`flex-row justify-between items-center mb-1`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>
              {data?.data?.product?.name}
            </Text>
            <View style={tw`flex-row items-center gap-1`}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={tw`text-xs font-semibold text-gray-700`}>
                {data?.data?.product?.rating}
                <Text style={tw`text-gray-400 font-normal`}>
                  ({data?.data?.product?.reviews_count} Reviews)
                </Text>
              </Text>
            </View>
          </View>

          {/* Price & Badge */}
          <View style={tw`flex-row justify-between items-center mb-5`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              {data?.data?.product?.price}
              <Text style={tw`text-sm font-normal text-gray-400`}>
                /1{data?.data?.product?.unit_type}
              </Text>
            </Text>
            <View
              style={tw`border border-[#FF8A00]/40 bg-[#FFF8F0] px-3 py-1 rounded-full`}
            >
              <Text style={tw`text-xs font-medium text-[#FF8A00]`}>
                {data?.data?.product?.store?.business_name}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-bold text-gray-800 mb-1.5`}>
              Description
            </Text>
            <Text style={tw`text-xs text-gray-500 leading-5`}>
              {data?.data?.product?.description}
            </Text>
          </View>

          {/* Delivery & Payment Features */}
          <View style={tw`gap-4`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View
                style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
              >
                <Ionicons name="bus-outline" size={20} color="#374151" />
              </View>
              <View>
                <Text style={tw`text-xs font-bold text-gray-800`}>
                  Instant Delivery & Regular Delivery
                </Text>
                <Text style={tw`text-[11px] text-gray-400`}>
                  2-3 business days
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-center gap-3`}>
              <View
                style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#374151"
                />
              </View>
              <View>
                <Text style={tw`text-xs font-bold text-gray-800`}>
                  Secure Payment
                </Text>
                <Text style={tw`text-[11px] text-gray-400`}>
                  100% secure transactions
                </Text>
              </View>
            </View>
          </View>

          {/* You Might Like Section */}
          <View style={tw`mt-6`}>
            <Text
              style={tw`text-[#1A1A1A] font-Manrope-SemiBold.ttf text-[16px] mb-2.5 `}
            >
              You Might Like
            </Text>
            <View style={tw`flex-row flex-wrap justify-between gap-y-4  `}>
              {relatedProduct.map((item) => (
                <View
                  key={item.id}
                  style={tw`w-[48%]  bg-white  p-3 relative rounded-[12px]  `}
                >
                  <TouchableOpacity
                    onPress={() => handleToggleFavourite(item.id)}
                    activeOpacity={0.8}
                    style={tw`absolute top-3 right-3 z-10  `}
                  >
                    <Ionicons
                      name={item?.is_favorite ? "heart" : "heart-outline"}
                      size={18}
                      color={item?.is_favorite ? "#EF4444" : "#FF7A00"}
                    />
                  </TouchableOpacity>

                  <View style={tw`items-center justify-center my-2 h-28`}>
                    <Image
                      source={
                        item?.primary_image
                          ? { uri: item?.primary_image }
                          : require("../../../assets/product/product.png")
                      }
                      style={tw`w-24 h-24`}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={tw`flex-row items-center justify-between `}>
                    <Text
                      style={tw`text-xs text-[#303030] font-Manrope-SemiBold.ttf `}
                    >
                      {item?.name.slice(0, 12)}...
                    </Text>
                    <View style={tw`flex-row items-center gap-1 `}>
                      <Ionicons name="star" size={12} color="#FDC700" />
                      <Text
                        style={tw`text-sm font-Manrope-Regular.ttf text-[#4A5565]`}
                      >
                        {item?.rating}
                        <Text
                          style={tw`text-[10px] font-Manrope-Regular.ttf text-[#4A5565]`}
                        >
                          ({item?.reviews_count})
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-row justify-between items-center mt-2`}>
                    <Text
                      style={tw`text-sm font-Manrope-SemiBold.ttf text-[#4A5565]`}
                    >
                      {item.price}
                      {/* <Text
                        style={tw`text-[10px] font-Manrope-Regular.ttf text-[#4A5565]`}
                      >
                        {item?.unit_type}
                      </Text> */}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={tw`w-7 h-7 rounded-full bg-white border border-gray-200 items-center justify-center`}
                      onPress={() => {
                        handleAddToCart(item?.id);
                      }}
                    >
                      <Ionicons name="cart-outline" size={14} color="#374151" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* User Feedbacks Section */}
          <View style={tw`mt-6`}>
            <Text
              style={tw`text-[#1A1A1A] font-Manrope-Bold.ttf text-[16px] mb-2.5 `}
            >
              User Feedbacks
            </Text>
            <View style={tw`gap-3`}>
              {REVIEWS.map((review) => (
                <View key={review.id} style={tw`bg-[#fff] rounded-2xl p-4`}>
                  <View style={tw`flex-row justify-between items-start mb-2`}>
                    <View>
                      <Text style={tw`text-sm font-Manrope-SemiBold.ttf`}>
                        {review.name}
                      </Text>
                      <Text
                        style={tw`text-xs font-Manrope-Regular.ttf text-[#7E8CA0] mt-0.5`}
                      >
                        {review.date}
                      </Text>
                    </View>
                    <View style={tw`flex-row gap-0.5`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name="star"
                          size={16}
                          color={star <= review.rating ? "#FFA404" : "#E5E7EB"}
                        />
                      ))}
                    </View>
                  </View>
                  <Text
                    style={tw`text-xs font-Manrope-Regular.ttf text-[#242B42] leading-4`}
                  >
                    {review.comment}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white  px-5 pt-3 flex-row gap-3  `,
          { paddingBottom: Math.max(insets.bottom, 4) },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.4}
          style={tw`flex-1 bg-[#F5F7EF] py-3.5 rounded-full items-center justify-center`}
          // onPress={() => {
          //   router.push("/shop-details/[id]");
          // }}
          onPress={() => {
            router.push({
              pathname: "/shop-details/[id]",
              params: { id: data?.data?.product?.store?.id },
            });
          }}
        >
          <Text style={tw`text-[#5B7410] font-semibold text-sm`}>
            Shop Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleAddToCart(data?.data?.product?.id);
          }}
          activeOpacity={0.4}
          style={tw`flex-1 bg-[#5B7410] py-3.5 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-white font-semibold text-sm`}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
