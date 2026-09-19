import { router } from "expo-router";
import { ChevronLeft, Coffee, Plug, Tv, Wifi, Wind } from "lucide-react-native";
import { useState } from "react";
import {
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

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600",
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600",
  "https://images.unsplash.com/photo-1517649763962-0c623266010b?q=80&w=600",
  "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?q=80&w=600",
];

const FACILITIES = [
  { id: "1", name: "Wifi", Icon: Wifi },
  { id: "2", name: "AC", Icon: Wind },
  { id: "3", name: "TV", Icon: Tv },
  { id: "4", name: "Snack", Icon: Coffee },
  { id: "5", name: "Power", Icon: Plug },
];

const ROUTE_STOPS = [
  {
    id: "1",
    time: "08:00",
    terminal: "Pulo Gebang Bus Terminal",
    location: "Jakarta",
    isStopover: false,
  },
  {
    id: "2",
    time: "10:00",
    terminal: "Karawang Rest Stop",
    location: "Break",
    isStopover: true,
  },
  {
    id: "3",
    time: "23:00",
    terminal: "Bungur Asih Bus Terminal",
    location: "Surabaya",
    isStopover: false,
  },
];

export default function BusDetailScreen() {
  const [selectedImage, setSelectedImage] = useState(GALLERY_IMAGES[0]);

  const id = 1;

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-36`}
      >
        {/* Main Header Banner */}
        <ImageBackground
          source={{ uri: selectedImage }}
          style={tw`w-full h-80 justify-between  pt-12`}
          resizeMode="cover"
        >
          {/* Back Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={tw`w-10 h-10 rounded-full bg-white items-center justify-center   ml-5 `}
          >
            <ChevronLeft size={22} color="#1F2937" />
          </TouchableOpacity>

          {/* Thumbnail Gallery Overlay */}
          <View
            style={tw`bg-white/80 p-1.5 rounded-2xl mb-4 flex-row gap-x-2 self-center border border-white/50 backdrop-blur-md`}
          >
            {GALLERY_IMAGES.map((imgUri, index) => {
              const isSelected = selectedImage === imgUri;
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
        </ImageBackground>

        {/* Content Section */}
        <View style={tw`px-5 pt-5`}>
          {/* Operator Header & Seat Availability */}
          <View style={tw`flex-row justify-between items-start`}>
            <View style={tw`flex-row items-center gap-x-3`}>
              {/* Logo Icon */}
              <View>
                <SvgXml xml={busShowIcon} height={20} width={33} />
              </View>

              <View>
                <Text
                  style={tw`text-[16px] font-Manrope-SemiBold.ttf text-blackText `}
                >
                  Rahman Travels
                </Text>
              </View>
            </View>

            <Text style={tw`text-sm font-Manrope-SemiBold.ttf `}>
              32 Seat Left
            </Text>
          </View>

          <Text
            style={tw`mt-2 text-[#6D717F] text-xs font-Manrope-Regular.ttf mb-4 `}
          >
            Regular AC <Text style={tw`text-[#6D717F]`}>•</Text> 2-2 Seating
          </Text>

          {/* Property Facilities */}
          <Text
            style={tw`font-Manrope-SemiBold.ttf text-[16px] mb-3 text-[#101010] `}
          >
            Property Facilities
          </Text>
          <View style={tw`flex-row justify-between items-center`}>
            {FACILITIES.map((item) => (
              <View key={item.id} style={tw`items-center`}>
                <View
                  style={tw`w-12 h-12 rounded-full bg-[#FFF5EF] items-center justify-center`}
                >
                  <item.Icon size={20} color="#F97316" />
                </View>
                <Text
                  style={tw` font-Manrope-Regular.ttf text-sm text-[#606060] mt-3 `}
                >
                  {item.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text
            style={tw` text-[#101010] font-Manrope-SemiBold.ttf text-[16px] mt-5 mb-2 `}
          >
            Description
          </Text>
          <Text
            style={tw`text-sm font-Manrope-Regular.ttf text-[#606060] mb-5`}
          >
            Set on the old site of Bali Hyatt on the main street of Sanur, the
            hotel is located on a delightful beachfront and nine hectares of
            lush.
            <Text style={tw`text-orange-500 font-medium`}>Read more...</Text>
          </Text>

          {/* Route Timeline */}
          <Text
            style={tw`text-[#101010] font-Manrope-SemiBold.ttf text-[16px] mb-2`}
          >
            Route
          </Text>
          <View style={tw`border border-gray-100 rounded-2xl p-4 bg-white`}>
            {ROUTE_STOPS.map((stop, index) => {
              const isLast = index === ROUTE_STOPS.length - 1;

              return (
                <View key={stop.id} style={tw`flex-row`}>
                  {/* Left Column: Timeline Indicator */}
                  <View style={tw`items-center mr-3 w-5`}>
                    {stop.isStopover ? (
                      <View
                        style={tw`w-3.5 h-3.5 rounded-full border-2 border-orange-500 bg-white items-center justify-center`}
                      >
                        <View
                          style={tw`w-1.5 h-1.5 rounded-full bg-orange-500`}
                        />
                      </View>
                    ) : (
                      <View style={tw`w-3 h-3 rounded-full bg-orange-500`} />
                    )}

                    {!isLast && (
                      <View
                        style={tw`w-[1px] flex-1 my-1 border-l border-dashed border-gray-300`}
                      />
                    )}
                  </View>

                  {/* Right Column: Time & Station Details */}
                  <View style={tw`flex-1 ${!isLast ? "mb-5" : ""}`}>
                    <View style={tw`flex-row items-center gap-x-3`}>
                      <Text
                        style={tw`text-sm font-Manrope-SemiBold.ttf text-blackText`}
                      >
                        {stop.time}
                      </Text>
                      <Text
                        style={tw`text-sm font-Manrope-SemiBold.ttf text-blackText flex-1`}
                        numberOfLines={1}
                      >
                        {stop.terminal}
                      </Text>
                    </View>
                    <Text
                      style={tw`text-xs text-[#6D717F] font-Manrope-Regular.ttf mt-0.5 ml-14`}
                    >
                      {stop.location}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Call To Action */}
      <View
        style={tw`absolute bottom-4 border-t border-[#EAEAEA]  left-0 right-0 bg-white px-5 py-6 flex-row gap-x-3 `}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`bg-[#57720F] py-3.5 rounded-full items-center justify-center w-full`}
          onPress={() => {
            router.push({
              pathname: "/bus-set-details/[id]",
              params: { id: id },
            });
          }}
        >
          <Text style={tw`text-white font-bold text-base`}>View Seats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
