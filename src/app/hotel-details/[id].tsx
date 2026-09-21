import { useUserProfileQuery } from "@/redux/authApi";
import {
  useHotelDetailsQuery,
  useToggleFavoriteHotelMutation,
} from "@/redux/hotelApi";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { formatCurrency } from "react-native-format-currency";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HotelBookingModal, {
  BookingSelection,
} from "../../../components/ui/HotelBookingModal";
import HotelDetailsSkeleton from "../../../components/ui/skeleton/HotelDetailsSkeleton";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";

// Mock Data

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

export default function HotelDetailsScreen() {
  // Icon mapping config for API facility names
  const FACILITY_ICON_MAP: Record<
    string,
    {
      name: string;
      library: "Feather" | "FontAwesome5" | "MaterialIcons" | "Ionicons";
    }
  > = {
    AC: { name: "wind", library: "Feather" },
    Gym: { name: "dumbbell", library: "FontAwesome5" },
    Pool: { name: "pool", library: "MaterialIcons" },
    WiFi: { name: "wifi", library: "Feather" },
    Parking: { name: "car", library: "FontAwesome5" },
    TV: { name: "tv", library: "Feather" },
    Kitchen: { name: "utensils", library: "FontAwesome5" },
  };

  // Helper component to render dynamic vector icons
  const FacilityIcon = ({ facilityName }: { facilityName: string }) => {
    const config = FACILITY_ICON_MAP[facilityName] || {
      name: "check-circle",
      library: "Feather",
    };

    switch (config.library) {
      case "FontAwesome5":
        return (
          <FontAwesome5 name={config.name as any} size={18} color="#FF7A51" />
        );
      case "MaterialIcons":
        return (
          <MaterialIcons name={config.name as any} size={20} color="#FF7A51" />
        );
      case "Ionicons":
        return <Ionicons name={config.name as any} size={20} color="#FF7A51" />;
      default:
        return <Feather name={config.name as any} size={20} color="#FF7A51" />;
    }
  };

  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const [modal1Visible, setModal1Visible] = useState(false);
  const [booking1, setBooking1] = useState<BookingSelection | null>(null);
  const { id } = useLocalSearchParams();

  const { data, isLoading } = useHotelDetailsQuery(id);
  const { data: userProfile } = useUserProfileQuery({});

  // console.log(data?.data?.property?.is_favorite);

  const maxLength = 120;

  // ======================================== Favorite Hotel Api =============================================

  const [toggleFavoriteHotel] = useToggleFavoriteHotelMutation();

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
              const res = await toggleFavoriteHotel(id).unwrap();
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
    return <HotelDetailsSkeleton />;
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="light" />

      {/* Main Content Scroll View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-28`}
      >
        {/* Top Hero Image Header */}
        <View style={tw`relative w-full h-80 bg-gray-200`}>
          {/* Main Hero Image */}
          <Image
            source={{
              uri: (() => {
                const images = data?.data?.property?.images || [];
                const selectedItem = images[selectedIndex] || images[0];
                if (!selectedItem) return "";
                return typeof selectedItem === "string"
                  ? selectedItem
                  : selectedItem?.image_url || selectedItem?.url || "";
              })(),
            }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />

          {/* Floating Top Buttons */}
          <View
            style={[
              tw`absolute left-5 right-5 flex-row justify-between items-center`,
              { top: Math.max(insets.top + 8, 20) },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              style={tw`w-10 h-10 rounded-full bg-white justify-center items-center shadow-md`}
            >
              <Ionicons name="chevron-back" size={20} color="#1F2937" />
            </TouchableOpacity>

            <TouchableOpacity
              onPressIn={() => {
                handleToggleFavourite(data?.data?.property?.id);
              }}
              activeOpacity={0.8}
              onPress={() => setIsFavorite((prev) => !prev)}
              style={tw`w-10 h-10 rounded-full bg-white justify-center items-center shadow-md`}
            >
              <Ionicons
                name={
                  data?.data?.property?.is_favorite ? "heart" : "heart-outline"
                }
                size={20}
                color={
                  data?.data?.property?.is_favorite ? "#FF5A1F" : "#1F2937"
                }
              />
            </TouchableOpacity>
          </View>

          {/* Thumbnail Gallery Overlay */}
          <View
            style={tw`absolute bottom-4 left-5 right-5 bg-black/20 p-1.5 rounded-2xl flex-row justify-between items-center border border-white/40`}
          >
            {(data?.data?.property?.images || [])
              .slice(0, 5)
              .map((item: any, index: number) => {
                const isSelected = selectedIndex === index;
                const uri =
                  typeof item === "string"
                    ? item
                    : item?.image_url || item?.url || "";

                return (
                  <TouchableOpacity
                    key={item?.id ?? index}
                    activeOpacity={0.8}
                    onPress={() => setSelectedIndex(index)}
                    style={[
                      tw`w-14 h-12 rounded-xl overflow-hidden bg-gray-300`,
                      isSelected
                        ? { borderWidth: 2, borderColor: "#FFFFFF", opacity: 1 }
                        : { opacity: 0.6 },
                    ]}
                  >
                    <Image
                      source={{ uri }}
                      style={tw`w-full h-full`}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* Content Body */}
        <View style={tw`px-5 pt-5`}>
          {/* Title & Overall Rating Row */}
          <View style={tw`flex-row justify-between items-start mb-1`}>
            <Text style={tw`text-2xl font-semibold text-[#1F2937] flex-1 mr-2`}>
              {data?.data?.property?.name}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={tw`text-sm font-semibold text-[#1F2937] ml-1`}>
                {data?.data?.property?.reviews_avg_rating
                  ? Number(data.data.property.reviews_avg_rating).toFixed(1)
                  : "0.0"}
              </Text>
              <Text style={tw`text-sm text-gray-400 ml-1`}>
                ({data?.data?.property?.reviews_count})
              </Text>
            </View>
          </View>

          {/* Location Row */}
          <View style={tw`flex-row items-center mb-6`}>
            <Ionicons name="location-outline" size={16} color="#9CA3AF" />
            <Text style={tw`text-sm text-gray-400 ml-1`}>
              {data?.data?.property?.address}
            </Text>
          </View>

          {/* Property Facilities */}
          <Text style={tw`text-base font-bold text-[#1F2937] mb-3.5`}>
            Property Facilities
          </Text>
          <View style={tw`flex-row justify-around items-center mb-6`}>
            {data?.data?.property?.facilities.map(
              (facility: any, index: string) => (
                <View key={`${facility}-${index}`} style={tw`items-center`}>
                  <View
                    style={tw`w-14 h-14 rounded-full bg-[#FFF5F2] justify-center items-center mb-1.5`}
                  >
                    <FacilityIcon facilityName={facility} />
                  </View>
                  <Text style={tw`text-xs text-gray-500`}>{facility}</Text>
                </View>
              ),
            )}
          </View>

          {/* Description Section */}
          <Text style={tw`text-base font-bold text-[#1F2937] mb-2`}>
            Description
          </Text>
          <Text style={tw`text-sm text-gray-400 leading-5 mb-6`}>
            {data?.data?.property?.description.length > maxLength && !isExpanded
              ? `${data?.data?.property?.description.slice(0, maxLength)}... `
              : data?.data?.property?.description + " "}

            {data?.data?.property?.description.length > maxLength && (
              <Text
                onPress={() => setIsExpanded(!isExpanded)}
                style={tw`text-[#FF5A1F] font-semibold`}
              >
                {isExpanded ? "Read less" : "Read more..."}
              </Text>
            )}
          </Text>

          {/* User Feedbacks Section */}
          <Text style={tw`text-base font-bold text-[#1F2937] mb-3`}>
            User Feedbacks
          </Text>
          <View style={tw`bg-[#F9FAFB] rounded-2xl p-4 gap-4`}>
            {data?.data?.property?.reviews.map((review: any, idx: number) => (
              <View
                key={review.id}
                style={tw`${idx !== REVIEWS.length - 1 ? "pb-4 border-b border-gray-100" : ""}`}
              >
                <View style={tw`flex-row justify-between items-center mb-1`}>
                  <Text style={tw`text-sm font-bold text-[#1F2937]`}>
                    {review?.user?.name}
                  </Text>
                  <View style={tw`flex-row gap-0.5`}>
                    {[1, 2, 3, 4, 5].map((starIndex) => {
                      const currentRating = Number(review?.rating ?? 0);
                      return (
                        <Ionicons
                          key={starIndex}
                          name="star"
                          size={14}
                          color={
                            starIndex <= currentRating ? "#F59E0B" : "#E5E7EB"
                          }
                        />
                      );
                    })}
                  </View>
                </View>
                <Text style={tw`text-xs text-gray-400 mb-2`}>
                  {review.date}
                </Text>
                <Text style={tw`text-xs text-gray-500 leading-4`}>
                  {review.comment}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Booking Bar */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white px-5 py-3 flex-row justify-between items-center border-t border-gray-100`,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View>
          <Text style={tw`text-xs text-gray-400`}>Price</Text>
          <Text style={tw`text-2xl font-bold text-[#1F2937]`}>
            {
              formatCurrency({
                amount: Number(data?.data?.property?.price_per_night ?? 0),
                code: userProfile?.data?.currency ?? "USD",
              })[0]
            }
            {/* {data?.data?.property?.price_per_night} */}
            <Text style={tw`text-xs text-gray-400 font-normal`}>/night</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setModal1Visible(true);
          }}
          activeOpacity={0.9}
          style={tw`bg-[#5B7410] px-8 py-3.5 rounded-full justify-center items-center`}
        >
          <Text style={tw`text-white text-sm font-semibold`}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Instance 1 */}
      <HotelBookingModal
        visible={modal1Visible}
        title="Select Primary Booking"
        onClose={() => setModal1Visible(false)}
        onApply={(data) => setBooking1(data)}
      />
    </View>
  );
}
