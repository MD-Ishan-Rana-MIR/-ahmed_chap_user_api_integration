import { useUserProfileQuery } from "@/redux/authApi";
import { useGetNearHotelsQuery } from "@/redux/hotelApi";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { NotFoundState } from "../../../components/NotFoundState";
import Button from "../../../components/ui/Button";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import PromoSlider from "../../../components/ui/user/home/PromoSlider";
import { ServicesGrid } from "../../../components/ui/user/home/ServicesGrid";
import { NearHotelCard } from "../../../components/ui/user/hotel/NearHotelCard";
import { locationIcon, notificationIcon } from "../../../lib/icon";
import tw from "../../../lib/tailwind";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const onViewAll = () => {
    router.push("/NearHotel");
  };

  const allService = () => {
    router.push("/all-category");
  };

  const { data } = useUserProfileQuery({});

  // ====================================================== Near Hotel API =====================================================
  const [npage, nsetPage] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  // Fetch Lat/Long from AsyncStorage
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const storedLat = await AsyncStorage.getItem("latitude");
        const storedLon = await AsyncStorage.getItem("longitude");

        if (storedLat && storedLon) {
          setLocation({
            lat: parseFloat(storedLat),
            lon: parseFloat(storedLon),
          });
        }
      } catch (error) {
        console.error("Failed to load location from AsyncStorage", error);
      }
    };

    fetchLocation();
  }, []);

  const {
    data: nearData,
    isLoading: nearLoading,
    isFetching: nearFetching,
    refetch: refetchNear,
  } = useGetNearHotelsQuery(
    {
      page: npage,
      lat: location?.lat || 0,
      lon: location?.lon || 0,
      perPage: 4,
    },
    {
      skip: !location,
    },
  );

  const hotelList = nearData?.data?.properties?.data || [];
  const nLastPage = nearData?.data?.properties?.last_page || 1;

  const handleNearLoadMore = () => {
    if (!nearFetching && npage < nLastPage) {
      nsetPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    nsetPage(1);
    refetchNear();
  };

  // Outer ScrollView Infinite Load Listener
  const handleMainScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isEndReached) {
      handleNearLoadMore();
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <StatusBar style="dark" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-8`}
        >
          {/* Top Header Bar */}
          <View style={tw`px-5 mt-3 flex-row items-center justify-between`}>
            {/* User Info Section */}
            <View style={tw`flex-row items-center gap-x-3`}>
              <Image
                source={
                  data?.data?.profile_photo_url
                    ? { uri: data?.data.profile_photo_url }
                    : require("../../../assets/images/profile.png")
                }
                style={tw`w-12 h-12 rounded-full`}
                resizeMode="cover"
              />

              <View>
                {/* Header Greeting */}
                <Text style={tw`font-semibold text-base text-blackText`}>
                  {data?.data?.name}
                </Text>

                {/* Location Row */}
                <View style={tw`flex-row items-center gap-1 mt-0.5`}>
                  <SvgXml xml={locationIcon} width={16} height={16} />

                  <Text style={tw`text-grayText text-sm`}>
                    {data?.data?.address}
                  </Text>
                </View>
              </View>
            </View>

            {/* Notification Button Container */}
            <TouchableOpacity
              onPress={() => {
                router.push("/user-notification");
              }}
              activeOpacity={0.7}
              style={tw`relative w-12 h-12 bg-[#F4F4F4] rounded-full items-center justify-center`}
            >
              <SvgXml xml={notificationIcon} width={20} height={20} />

              {/* Notification Badge / Pill */}
              <View
                style={tw`absolute top-2 right-2 bg-red-500 min-w-[16px] h-[16px] rounded-full items-center justify-center px-1 border-2 border-white`}
              >
                <Text style={tw`text-white text-[9px] font-bold leading-none`}>
                  3
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={tw`px-5 my-5`}>
            <View
              style={tw`flex-row items-center bg-[#F4F4F4] rounded-full px-4 py-1 border border-transparent focus:border-[#5B7410]`}
            >
              {/* Left Search Icon */}
              <Ionicons name="search-outline" size={20} color="#757575" />

              {/* Text Input */}
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor="#9CA3AF"
                style={tw`flex-1 ml-2.5 text-sm text-gray-800  font-normal`}
                returnKeyType="search"
              />

              {/* Clear Button */}
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearSearch}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Promo Slider Banner */}
          <View style={tw`mt-1`}>
            <PromoSlider />
          </View>

          <SectionHeader title="Available Services" onViewAll={allService} />

          {/* Service List  */}

          <ServicesGrid />

          <View style={tw`px-5 pt-5`}>
            <View
              style={tw`bg-[#EFF1E7] rounded-[8px] border border-[#5B74101F] px-5 py-2 flex-row  items-center justify-between `}
            >
              <View style={tw` `}>
                <Text
                  style={tw`text-blackText font-Manrope-Bold.ttf text-[16px] mb-0.5 `}
                >
                  Track your order
                </Text>
                <Text
                  style={tw`text-[#858585] text-xs font-Manrope-Regular.ttf `}
                >{`Stay updated on your\ndeliveries in real time`}</Text>
                <View style={tw`w-32 mt-3`}>
                  <Button
                    text="Track Now"
                    onPress={() => {
                      router.push("/orders");
                    }}
                  />
                </View>
              </View>
              <View>
                <Image
                  source={require("../../../assets/hotel/bike.png")}
                  style={tw` w-[165px] h-[123px] `}
                />
              </View>
            </View>
          </View>

          {/* Hotel List  */}

          <View style={tw`mt-6`}>
            <SectionHeader title="Hotel Near you" onViewAll={onViewAll} />
          </View>

          <View style={tw`gap-y-3 px-5`}>
            {hotelList.map((item: any) => (
              <NearHotelCard key={item.id} item={item} />
            ))}

            {hotelList.length === 0 && !nearFetching && (
              <NotFoundState title="Not found your near hotel" message="" />
            )}

            {nearFetching && npage > 1 && (
              <View style={tw`py-4 items-center justify-center`}>
                <ActivityIndicator size="small" color="#F95700" />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
