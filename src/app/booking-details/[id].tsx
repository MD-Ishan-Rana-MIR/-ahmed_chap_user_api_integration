import { useBookingSeatMutation, useBusDetailsQuery } from "@/redux/busApi";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import BackButton from "../../../components/ui/BackButton";
import Button from "../../../components/ui/Button";
import { busShowIcon } from "../../../lib/icon";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";

export default function BookingSummaryScreen() {
  const params = useLocalSearchParams();
  console.log("params data is", params?.currency);

  // Dynamic parameters passed from previous screens with fallback dummy data matching the UI

  const [bookingSeat, { isLoading: loading }] = useBookingSeatMutation();

  const handleContinuePayment = () => {
    Alert.alert(
      "Confirm Booking",
      "Are you sure you want to proceed with the payment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            // ২. ইউজার Confirm করার পর API Call হবে
            const payload = {
              bus_id: params?.id,
              travel_date: params?.travel_date,
              seat_numbers: params?.selected_seat_numbers,
              passenger_name: params?.passenger_name,
              passenger_phone: params?.passenger_phone,
              passenger_email: params?.email,
              payment_method: "mpesa",
              mpesa_number: params?.passenger_phone,
            };

            try {
              const res = await bookingSeat(payload).unwrap();
              if (res) {
                router.push("/(user-tab)");
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
      { cancelable: true },
    );
  };

  const { data, isLoading } = useBusDetailsQuery({
    id: params?.id,
    travel_date: params?.travel_date,
  });

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Booking Summary" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pt-4 pb-10 flex-grow justify-between`}
      >
        <View style={tw`gap-y-6`}>
          {/* Top Bus & Passenger Details Card */}
          <View
            style={tw`border border-[#E5E7EB] rounded-2xl p-4 bg-white shadow-xs`}
          >
            {/* Bus Brand & Date Header */}
            <View style={tw`flex-row justify-between items-center pb-3`}>
              <View style={tw`flex-row items-center gap-x-2`}>
                <View
                  style={tw`w-8 h-8 rounded-lg bg-[#4338CA] items-center justify-center`}
                >
                  <SvgXml
                    xml={busShowIcon}
                    width={22}
                    height={14}
                    color="#FFF"
                  />
                </View>
                <Text style={tw`text-[16px] font-semibold text-[#111827]`}>
                  {data?.data?.bus?.name}
                </Text>
              </View>
              <Text style={tw`text-[14px] font-semibold text-[#F95700]`}>
                {params?.travel_date}
              </Text>
            </View>

            {/* Departure & Arrival Timeline */}
            <View style={tw`flex-row justify-between items-center my-3`}>
              <View>
                <Text style={tw`text-[18px] font-bold text-[#111827]`}>
                  {data?.data?.bus?.departure_time}
                </Text>
                <Text style={tw`text-[12px] text-[#9CA3AF] mt-0.5`}>
                  {data?.data?.bus?.departure_place}
                </Text>
              </View>

              <View
                style={tw`flex-1 mx-3 flex-row items-center justify-center`}
              >
                <View style={tw`w-1.5 h-1.5 rounded-full bg-[#E5E7EB]`} />
                <View
                  style={tw`flex-1 border-b border-dashed border-[#E5E7EB] mx-1`}
                />
                <Text style={tw`text-[12px] text-[#9CA3AF] font-normal px-1`}>
                  {data?.data?.bus?.journey_duration}
                </Text>
                <View
                  style={tw`flex-1 border-b border-dashed border-[#E5E7EB] mx-1`}
                />
                <View style={tw`w-1.5 h-1.5 rounded-full bg-[#E5E7EB]`} />
              </View>

              <View style={tw`items-end`}>
                <Text style={tw`text-[18px] font-bold text-[#111827]`}>
                  {data?.data?.bus?.destination_time}
                </Text>
                <Text style={tw`text-[12px] text-[#9CA3AF] mt-0.5`}>
                  {data?.data?.bus?.destination_place}
                </Text>
              </View>
            </View>

            {/* Seat List */}
            <View
              style={tw`flex-row justify-between items-center py-3 border-t border-[#F3F4F6]`}
            >
              <Text style={tw`text-[14px] text-[#9CA3AF] font-normal`}>
                Seat
              </Text>
              <Text style={tw`text-[14px] text-[#111827] font-semibold`}>
                {params?.selected_seat_numbers}
              </Text>
            </View>

            {/* Passenger Name */}
            <View
              style={tw`flex-row justify-between items-center py-3 border-t border-[#F3F4F6]`}
            >
              <Text style={tw`text-[14px] text-[#9CA3AF] font-normal`}>
                Passenger
              </Text>
              <Text style={tw`text-[14px] text-[#111827] font-semibold`}>
                {params?.passenger_name}
              </Text>
            </View>

            {/* Phone Number */}
            <View
              style={tw`flex-row justify-between items-center pt-3 border-t border-[#F3F4F6]`}
            >
              <Text style={tw`text-[14px] text-[#9CA3AF] font-normal`}>
                Phone Number
              </Text>
              <Text style={tw`text-[14px] text-[#111827] font-semibold`}>
                {params?.passenger_phone}
              </Text>
            </View>
          </View>

          {/* Payment Summary Section */}
          <View style={tw`mt-2`}>
            <Text style={tw`text-[18px] font-semibold text-[#111827] mb-3`}>
              Payment summary
            </Text>

            <View
              style={tw`border border-[#E5E7EB] rounded-2xl p-4 bg-white shadow-xs gap-y-3.5`}
            >
              {/* Tickets Count */}
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-[14px] text-[#9CA3AF] font-normal`}>
                  Tickets
                </Text>
                <Text style={tw`text-[14px] text-[#111827] font-semibold`}>
                  {params?.totalSeat}
                </Text>
              </View>

              <View style={tw`h-[1px] bg-[#F3F4F6] w-full`} />

              {/* Individual Ticket Price */}
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-[14px] text-[#9CA3AF] font-normal`}>
                  Ticket Price
                </Text>
                <Text style={tw`text-[14px] text-[#111827] font-semibold`}>
                  {params?.currency} {params?.total_price}
                </Text>
              </View>

              <View style={tw`h-[1px] bg-[#F3F4F6] w-full`} />

              {/* Total Price */}
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-[15px] text-[#6B7280] font-semibold`}>
                  Total Price
                </Text>
                <Text style={tw`text-[16px] text-[#111827] font-bold`}>
                  {params?.currency} {params?.total_price}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Continue Payment Button */}
        {/* <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinuePayment}
          style={tw`w-full h-[54px] bg-[#587211] rounded-full items-center justify-center mt-8`}
        >
          <Text style={tw`text-white font-semibold text-[16px]`}>
            Continue Payment
          </Text>
        </TouchableOpacity> */}
        <Button
          text="Continue Payment"
          isLoading={loading}
          onPress={handleContinuePayment}
        />
      </ScrollView>
    </View>
  );
}
