import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Heart,
  Lock,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../../lib/tailwind";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300",
  "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=300",
  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300",
];

const SUGGESTIONS = [
  {
    id: "1",
    name: "Beef Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  },
  {
    id: "2",
    name: "Cheese Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400",
  },
  {
    id: "3",
    name: "Chicken Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=400",
  },
  {
    id: "4",
    name: "Grilled Burger",
    price: "$42",
    rating: 4.5,
    reviews: "1k",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
  },
];

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
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState(GALLERY_IMAGES[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favItems, setFavItems] = useState<{ [key: string]: boolean }>({});

  const toggleItemFav = (id: string) => {
    setFavItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        <View style={tw`pb-6 px-5 mt-4 `}>
          <View style={tw`flex-row justify-between items-center`}>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              activeOpacity={0.8}
              style={tw`w-9 h-9 bg-white rounded-full items-center justify-center shadow-xs`}
            >
              <ChevronLeft size={18} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsFavorite(!isFavorite)}
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
              source={{ uri: selectedImage }}
              style={tw`w-full h-full`}
              resizeMode="contain"
            />
          </View>

          {/* Image Thumbnails Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`gap-x-2.5 justify-center flex-1`}
          >
            {GALLERY_IMAGES.map((img, index) => {
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
        </View>

        {/* Title, Rating & Tag */}
        <View style={tw`px-4 pt-5 pb-4`}>
          <View style={tw`flex-row justify-between items-start mb-1`}>
            <Text style={tw`text-lg font-bold text-gray-900`}>Beef Burger</Text>
            <View style={tw`flex-row items-center gap-x-1`}>
              <Star size={14} color="#EAB308" fill="#EAB308" />
              <Text style={tw`text-xs font-semibold text-gray-800`}>4.7</Text>
              <Text style={tw`text-xs text-gray-400`}>(243 Reviews)</Text>
            </View>
          </View>

          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-bold text-[#F95700]`}>$42.95</Text>
            <View style={tw`bg-[#FFF4EF] px-2.5 py-1 rounded-full`}>
              <Text style={tw`text-[11px] font-semibold text-[#F95700]`}>
                The Urban Fork
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={tw`text-xs font-bold text-gray-800 mb-1`}>
            Description
          </Text>
          <Text style={tw`text-[11px] text-gray-400 leading-4 mb-4`}>
            Elevate your professional wardrobe with this timeless classic black
            blazer. Crafted from premium materials, this versatile piece
            combines sophisticated style with all-day comfort. Perfect for the
            office, special occasions, or elevating your casual look.
          </Text>

          {/* Service Perks */}
          <View style={tw`border-t border-b border-gray-100 py-3 gap-y-3`}>
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
        <View style={tw`px-4 pt-2 pb-4`}>
          <Text style={tw`text-sm font-bold text-gray-900 mb-3`}>
            You Might Like
          </Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {SUGGESTIONS.map((item) => {
              const isFav = !!favItems[item.id];
              return (
                <View key={item.id} style={tw`w-[48.5%] mb-3`}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={tw`bg-[#FBFBFB] border border-gray-100 rounded-2xl p-2.5 shadow-xs`}
                  >
                    <View
                      style={tw`relative w-full h-28 rounded-xl overflow-hidden mb-2`}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={tw`w-full h-full`}
                        resizeMode="contain"
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleItemFav(item.id)}
                        style={tw`absolute top-2 right-2 w-6 h-6 bg-white rounded-full items-center justify-center shadow-xs z-10`}
                      >
                        <Heart
                          size={12}
                          color="#F95700"
                          fill={isFav ? "#F95700" : "transparent"}
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
                      <Text style={tw`text-[10px] font-semibold text-gray-700`}>
                        {item.rating}
                      </Text>
                      <Text style={tw`text-[10px] text-gray-400`}>
                        ({item.reviews})
                      </Text>
                    </View>

                    <View style={tw`flex-row justify-between items-center`}>
                      <Text style={tw`text-xs font-bold text-[#F95700]`}>
                        {item.price}
                      </Text>
                      <TouchableOpacity
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

      {/* Fixed Bottom Action Bar with Safe Area Bottom Insets */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-3 flex-row items-center gap-x-3 shadow-lg`,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            router.push("/restaurants_details/[id]");
          }}
          activeOpacity={0.8}
          style={tw`flex-1 bg-[#F7F8F3] py-3.5 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-bold text-[#556B2F]`}>Shop Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={tw`flex-1 bg-[#556B2F] py-3.5 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-bold text-white`}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
