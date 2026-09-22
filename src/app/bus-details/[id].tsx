import { useBusDetailsQuery } from "@/redux/busApi";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Coffee,
  Plug,
  Sparkles,
  Tv,
  Wifi,
  Wind,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { busShowIcon } from "../../../lib/icon";
import tw from "../../../lib/tailwind";

// Fallback image gallery
const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600",
];

// Icon Mapping Helper
const getFacilityIcon = (facilityName: string) => {
  const normalized = facilityName.toLowerCase().replace(/\s+/g, "");

  if (normalized.includes("wifi")) return Wifi;
  if (normalized.includes("air") || normalized.includes("ac")) return Wind;
  if (normalized.includes("tv")) return Tv;
  if (
    normalized.includes("snack") ||
    normalized.includes("water") ||
    normalized.includes("coffee")
  )
    return Coffee;
  if (
    normalized.includes("power") ||
    normalized.includes("charging") ||
    normalized.includes("plug")
  )
    return Plug;

  return Sparkles; // Default icon
};

export default function BusDetailScreen() {
  const { id, travel_date } = useLocalSearchParams();
  const { data, isLoading } = useBusDetailsQuery({ id, travel_date });

  const bus = data?.data?.bus;

  // Extract array of image URLs correctly from API object array
  const apiImages =
    bus?.images?.map((img: { image_url: string }) => img.image_url) || [];
  const galleryImages: string[] = apiImages.length
    ? apiImages
    : bus?.primary_image
      ? [bus.primary_image]
      : DEFAULT_GALLERY;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Default active image selection
  const currentImage = selectedImage || galleryImages[0];

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator size="large" color="#57720F" />
      </View>
    );
  }

  // Route Stops setup from API response
  const routeStops = [
    {
      id: "1",
      time: bus?.departure_time || "N/A",
      terminal: bus?.departure_place || "Origin Station",
      location: "Departure",
    },
    {
      id: "2",
      time: bus?.destination_time || "N/A",
      terminal: bus?.destination_place || "Destination Station",
      location: `Arrival (${bus?.journey_duration || ""})`,
    },
  ];

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-36`}
      >
        {/* Banner Header */}
        <ImageBackground
          source={{ uri: currentImage }}
          style={tw`w-full h-80 justify-between pt-12`}
          resizeMode="cover"
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={tw`w-10 h-10 rounded-full bg-white/90 items-center justify-center ml-5 shadow-sm`}
          >
            <ChevronLeft size={22} color="#1F2937" />
          </TouchableOpacity>

          {/* Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <View
              style={tw`bg-white/80 p-1.5 rounded-2xl mb-4 flex-row gap-x-2 self-center border border-white/50`}
            >
              {galleryImages.map((imgUri: string, index: number) => {
                const isSelected = currentImage === imgUri;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => setSelectedImage(imgUri)}
                    style={tw`rounded-xl overflow-hidden border-2 ${
                      isSelected ? "border-orange-500" : "border-transparent"
                    }`}
                  >
                    <Image
                      source={{ uri: imgUri }}
                      style={tw`w-12 h-12 rounded-lg`}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ImageBackground>

        {/* Content Section */}
        <View style={tw`px-5 pt-5`}>
          {/* Operator Info & Seat Badge */}
          <View style={tw`flex-row justify-between items-start`}>
            <View style={tw`flex-row items-center gap-x-3 flex-1 mr-2`}>
              <SvgXml xml={busShowIcon} height={20} width={33} />
              <View style={tw`flex-1`}>
                <Text style={tw`text-[16px] font-semibold text-black`}>
                  {bus?.name || bus?.operator?.business_name || "Bus Operator"}
                </Text>
                {bus?.operator?.business_name && (
                  <Text style={tw`text-xs text-gray-500`}>
                    Operated by {bus.operator.business_name}
                  </Text>
                )}
              </View>
            </View>

            <Text style={tw`text-sm font-semibold text-orange-600`}>
              {bus?.available_seats_count ?? 0} Seats Left
            </Text>
          </View>

          {/* Bus Type & Pattern */}
          <Text style={tw`mt-2 text-[#6D717F] text-xs mb-4`}>
            {bus?.bus_type || "Standard"}{" "}
            <Text style={tw`text-[#6D717F]`}>•</Text>{" "}
            {bus?.seat_pattern || "2-2"} Seating
          </Text>

          {/* Facilities Section */}
          {bus?.facilities && bus.facilities.length > 0 && (
            <View style={tw`mb-5`}>
              <Text style={tw`text-[#101010] font-semibold text-[16px] mb-3`}>
                Facilities
              </Text>
              <View style={tw`flex-row flex-wrap gap-4 items-center`}>
                {bus.facilities.map((facilityName: string, index: number) => {
                  const IconComponent = getFacilityIcon(facilityName);
                  return (
                    <View key={index} style={tw`items-center min-w-[60px]`}>
                      <View
                        style={tw`w-12 h-12 rounded-full bg-[#FFF5EF] items-center justify-center`}
                      >
                        <IconComponent size={20} color="#F97316" />
                      </View>
                      <Text
                        style={tw`text-xs text-[#606060] mt-2 capitalize text-center`}
                      >
                        {facilityName}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Description */}
          <Text style={tw`text-[#101010] font-semibold text-[16px] mb-2`}>
            Description
          </Text>
          <Text style={tw`text-sm text-[#606060] mb-5 leading-5`}>
            {bus?.description ||
              "Enjoy a comfortable journey with modern amenities and experienced drivers to ensure safe and timely travel."}
          </Text>

          {/* Route Timeline */}
          <Text style={tw`text-[#101010] font-semibold text-[16px] mb-2`}>
            Route Timeline
          </Text>
          <View
            style={tw`border border-gray-100 rounded-2xl p-4 bg-white shadow-xs`}
          >
            {routeStops.map((stop, index) => {
              const isLast = index === routeStops.length - 1;

              return (
                <View key={stop.id} style={tw`flex-row`}>
                  {/* Timeline Indicator */}
                  <View style={tw`items-center mr-3 w-5`}>
                    <View
                      style={tw`w-3.5 h-3.5 rounded-full bg-orange-500 items-center justify-center`}
                    />
                    {!isLast && (
                      <View
                        style={tw`w-[1px] flex-1 my-1 border-l border-dashed border-gray-300`}
                      />
                    )}
                  </View>

                  {/* Stop Details */}
                  <View style={tw`flex-1 ${!isLast ? "mb-5" : ""}`}>
                    <View style={tw`flex-row items-center justify-between`}>
                      <Text style={tw`text-sm font-semibold text-black`}>
                        {stop.terminal}
                      </Text>
                      <Text style={tw`text-sm font-bold text-orange-600`}>
                        {stop.time}
                      </Text>
                    </View>
                    <Text style={tw`text-xs text-[#6D717F] mt-0.5`}>
                      {stop.location}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom CTA Bar with Fare Price */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 bg-white px-5 py-4 border-t border-[#EAEAEA] shadow-lg flex-row items-center justify-between`}
      >
        <View>
          <Text style={tw`text-xs text-gray-500`}>Ticket Price</Text>
          <Text style={tw`text-lg font-bold text-black`}>
            {bus?.currency || "KES"} {bus?.price_per_seat ?? "0"}
            <Text style={tw`text-xs font-normal text-gray-500`}> /seat</Text>
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={tw`bg-[#57720F] px-8 py-3.5 rounded-full items-center justify-center`}
          onPress={() => {
            router.push({
              pathname: "/bus-set-details/[id]",
              params: { id: bus?.id, travel_date: travel_date },
            });
          }}
        >
          <Text style={tw`text-white font-bold text-base`}>View Seats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
