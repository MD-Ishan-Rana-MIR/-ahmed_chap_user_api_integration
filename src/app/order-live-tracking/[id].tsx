import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SvgXml } from "react-native-svg";
import tw from "twrnc";
import BackButton from "../../../components/ui/BackButton";
import { checkIcon } from "../../../lib/icon";

interface TimelineStep {
  id: string;
  title: string;
  time: string;
  status: "completed" | "active" | "pending";
}

const TIMELINE_DATA: TimelineStep[] = [
  { id: "1", title: "Order Confirmed", time: "2:30 PM", status: "completed" },
  { id: "2", title: "Rider Picked", time: "2:45 PM", status: "completed" },
  { id: "3", title: "On the Way", time: "3:00 PM", status: "completed" },
  { id: "4", title: "Nearby", time: "In 15 min", status: "active" },
  { id: "5", title: "Delivered", time: "Pending", status: "pending" },
];

const OrderTrackingScreen = () => {
  // Map Coordinates
  const riderCoords = { latitude: 26.326, longitude: 43.975 };
  const userCoords = { latitude: 26.355, longitude: 43.995 };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Live Tracking" />
      <ScrollView
        style={tw`flex-1 bg-[#F9FAFB]`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`px-5 pt-5 gap-4 pb-12`}>
          {/* 1. Map View Section */}
          <View
            style={tw`h-56 rounded-2xl overflow-hidden border border-gray-200`}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={tw`w-full h-full`}
              initialRegion={{
                latitude: 26.34,
                longitude: 43.985,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {/* Dashed Route Line */}
              <Polyline
                coordinates={[riderCoords, userCoords]}
                strokeColor="#FF5C00"
                strokeWidth={4}
                lineDashPattern={[6, 6]}
              />

              {/* Rider Marker */}
              <Marker coordinate={riderCoords}>
                <View style={tw`items-center`}>
                  <View
                    style={tw`bg-gray-800 px-2 py-0.5 rounded text-center mb-1`}
                  >
                    <Text style={tw`text-[10px] font-bold text-white`}>
                      Rider
                    </Text>
                  </View>
                  <View
                    style={tw`w-8 h-8 bg-[#FF5C00] rounded-full items-center justify-center shadow-md`}
                  >
                    <Ionicons name="navigate-sharp" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </Marker>

              {/* Destination Marker */}
              <Marker coordinate={userCoords}>
                <View style={tw`items-center`}>
                  <View
                    style={tw`bg-gray-800 px-2 py-0.5 rounded text-center mb-1`}
                  >
                    <Text style={tw`text-[10px] font-bold text-white`}>
                      Your location
                    </Text>
                  </View>
                  <Ionicons name="location-sharp" size={32} color="#FF5C00" />
                </View>
              </Marker>
            </MapView>
          </View>

          {/* 2. Rider Info Card */}
          <View
            style={tw`bg-[#FCFCFC] rounded-2xl p-3 border border-[#EDEDED] flex-row items-center gap-3 shadow-xs`}
          >
            <View
              style={tw`w-[50px] h-[50px] rounded-full border border-[#E8E8E8] overflow-hidden`}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
                }}
                style={tw`w-full h-full p-0.5 rounded-full`}
                resizeMode="cover"
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-Manrope-Medium.ttf text-[#373232]`}>
                Abdur Rahman
              </Text>
              <View style={tw`flex-row items-center gap-1 mt-0.5`}>
                <Ionicons name="call-outline" size={12} color="#303030" />
                <Text
                  style={tw`text-xs text-[#303030] font-Manrope-Regular.ttf `}
                >
                  +880124 65664
                </Text>
              </View>
            </View>
          </View>

          {/* 3. Delivery Timeline Card */}
          <View
            style={tw`bg-white rounded-2xl p-4 border border-gray-100 shadow-xs`}
          >
            <Text
              style={tw`font-Manrope-Medium.ttf text-[16px] text-[#373232] mb-4`}
            >
              Delivery Timeline
            </Text>

            <View style={tw`gap-0`}>
              {TIMELINE_DATA.map((item, index) => {
                const isLast = index === TIMELINE_DATA.length - 1;

                return (
                  <View key={item.id} style={tw`flex-row items-start`}>
                    {/* Left Column: Icon + Vertical Connecting Line */}
                    <View style={tw`items-center mr-3`}>
                      {/* Status Icon Indicator */}
                      {item.status === "completed" ? (
                        <View
                          style={tw`w-8 h-8 rounded-full bg-[#12B76A] items-center justify-center`}
                        >
                          <SvgXml xml={checkIcon} />
                        </View>
                      ) : item.status === "active" ? (
                        <View
                          style={tw`w-8 h-8 rounded-full bg-[#FF5C00] items-center justify-center`}
                        >
                          <Ionicons
                            name="cube-outline"
                            size={16}
                            color="#FFFFFF"
                          />
                        </View>
                      ) : (
                        <View
                          style={tw`w-8 h-8 rounded-full bg-gray-100 items-center justify-center`}
                        >
                          <Ionicons
                            name="cube-outline"
                            size={16}
                            color="#9CA3AF"
                          />
                        </View>
                      )}

                      {/* Connecting Line */}
                      {!isLast && (
                        <View style={tw`w-[2px] h-8 bg-gray-200 my-0.5`} />
                      )}
                    </View>

                    {/* Right Column: Title and Time */}
                    <View
                      style={tw`flex-1 flex-row justify-between items-center pt-1`}
                    >
                      <Text
                        style={tw`text-sm font-semibold ${
                          item.status === "active"
                            ? "text-[#FF5C00]"
                            : item.status === "completed"
                              ? "text-gray-800"
                              : "text-gray-400"
                        }`}
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={tw`text-xs ${
                          item.status === "active"
                            ? "text-gray-700 font-semibold"
                            : "text-gray-500 font-normal"
                        }`}
                      >
                        {item.time}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 4. Order Details Card */}
          <View
            style={tw`bg-[#FFFFFF] rounded-2xl p-4 border border-[#EDEAEA] shadow-xs gap-3`}
          >
            <Text style={tw`text-lg font-Manrope-Medium.ttf text-[#373232]`}>
              Order Details
            </Text>

            <View style={tw`flex-row justify-between items-center`}>
              <Text
                style={tw`text-[#8C8C8C] font-Manrope-Regular.ttf text-sm `}
              >
                Order ID
              </Text>
              <Text style={tw`text-sm font-Manrope-Medium.ttf text-[#373232]`}>
                #ORDNYPHX8OME
              </Text>
            </View>

            <View style={tw`flex-row justify-between items-center`}>
              <Text
                style={tw`text-[#8C8C8C] font-Manrope-Regular.ttf text-sm `}
              >
                Items
              </Text>
              <Text style={tw`text-sm font-Manrope-Medium.ttf text-[#373232]`}>
                1 item
              </Text>
            </View>

            <View style={tw`flex-row justify-between items-center`}>
              <Text
                style={tw`text-[#8C8C8C] font-Manrope-Regular.ttf text-sm `}
              >
                Product Price
              </Text>
              <Text style={tw`text-sm font-Manrope-Medium.ttf text-[#373232]`}>
                $42.00
              </Text>
            </View>

            <View
              style={tw`flex-row justify-between items-center pb-3 border-b border-[#E2E2E2]`}
            >
              <Text
                style={tw`text-[#8C8C8C] font-Manrope-Regular.ttf text-sm `}
              >
                Delivery Charge
              </Text>
              <Text style={tw`text-sm font-Manrope-Medium.ttf text-[#373232]`}>
                $20.02
              </Text>
            </View>

            <View style={tw`flex-row justify-between items-center pt-1`}>
              <Text style={tw`text-sm font-Manrope-Medium.ttf text-[#373232]`}>
                Total Amount
              </Text>
              <Text
                style={tw`text-base font-Manrope-SemiBold.ttf text-[#373232] `}
              >
                $60.02
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderTrackingScreen;
