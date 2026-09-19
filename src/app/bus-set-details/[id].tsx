import { Armchair, Bath, Plug, Snowflake } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import BackButton from "../../../components/ui/BackButton";
import { busShowIcon, driverIcon } from "../../../lib/icon";
import tw from "../../../lib/tailwind";

type SeatStatus = "available" | "booked" | "selected";

interface Seat {
  id: string; // e.g., "1A"
  row: number;
  col: "A" | "B" | "C" | "D";
  status: SeatStatus;
}

const INITIAL_SEATS: Seat[] = [
  // Row 1
  { id: "1A", row: 1, col: "A", status: "booked" },
  { id: "1B", row: 1, col: "B", status: "available" },
  { id: "1C", row: 1, col: "C", status: "booked" },
  { id: "1D", row: 1, col: "D", status: "booked" },
  // Row 2
  { id: "2A", row: 2, col: "A", status: "selected" },
  { id: "2B", row: 2, col: "B", status: "selected" },
  { id: "2C", row: 2, col: "C", status: "selected" },
  { id: "2D", row: 2, col: "D", status: "selected" },
  // Row 3
  { id: "3A", row: 3, col: "A", status: "available" },
  { id: "3B", row: 3, col: "B", status: "booked" },
  { id: "3C", row: 3, col: "C", status: "available" },
  { id: "3D", row: 3, col: "D", status: "available" },
  // Row 4
  { id: "4A", row: 4, col: "A", status: "available" },
  { id: "4B", row: 4, col: "B", status: "available" },
  { id: "4C", row: 4, col: "C", status: "available" },
  { id: "4D", row: 4, col: "D", status: "available" },
  // Row 5
  { id: "5A", row: 5, col: "A", status: "available" },
  { id: "5B", row: 5, col: "B", status: "available" },
  { id: "5C", row: 5, col: "C", status: "available" },
  { id: "5D", row: 5, col: "D", status: "booked" },
  // Row 6
  { id: "6A", row: 6, col: "A", status: "available" },
  { id: "6B", row: 6, col: "B", status: "available" },
  { id: "6C", row: 6, col: "C", status: "available" },
  { id: "6D", row: 6, col: "D", status: "available" },
  // Row 7
  { id: "7A", row: 7, col: "A", status: "booked" },
  { id: "7B", row: 7, col: "B", status: "booked" },
  { id: "7C", row: 7, col: "C", status: "available" },
  { id: "7D", row: 7, col: "D", status: "available" },
  // Row 8
  { id: "8A", row: 8, col: "A", status: "available" },
  { id: "8B", row: 8, col: "B", status: "available" },
  { id: "8C", row: 8, col: "C", status: "available" },
  { id: "8D", row: 8, col: "D", status: "available" },
  // Row 9
  { id: "9A", row: 9, col: "A", status: "available" },
  { id: "9B", row: 9, col: "B", status: "available" },
  { id: "9C", row: 9, col: "C", status: "available" },
  { id: "9D", row: 9, col: "D", status: "available" },
  // Row 10
  { id: "10A", row: 10, col: "A", status: "available" },
  { id: "10B", row: 10, col: "B", status: "available" },
  { id: "10C", row: 10, col: "C", status: "available" },
  { id: "10D", row: 10, col: "D", status: "available" },
];

export default function SeatSelectionScreen() {
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);

  const toggleSeat = (id: string) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === id) {
          if (seat.status === "available")
            return { ...seat, status: "selected" };
          if (seat.status === "selected")
            return { ...seat, status: "available" };
        }
        return seat;
      }),
    );
  };

  const getSeatByPos = (row: number, col: "A" | "B" | "C" | "D") => {
    return seats.find((s) => s.row === row && s.col === col);
  };

  const renderSeatBox = (row: number, col: "A" | "B" | "C" | "D") => {
    const seat = getSeatByPos(row, col);
    if (!seat) return <View style={tw`w-11 h-11`} />;

    if (seat.status === "booked") {
      return (
        <View
          style={tw`w-11 h-11 rounded-xl bg-[#646A79] items-center justify-center`}
        >
          <Armchair size={20} color="#FFFFFF" />
        </View>
      );
    }

    if (seat.status === "selected") {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleSeat(seat.id)}
          style={tw`w-11 h-11 rounded-xl bg-[#F95700] items-center justify-center`}
        >
          <Armchair size={20} color="#FFFFFF" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => toggleSeat(seat.id)}
        style={tw`w-11 h-11 rounded-xl border border-gray-200 bg-white`}
      />
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="View Seats" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 mt-5 pb-36`}
      >
        {/* Top Ticket Summary Header */}
        <View style={tw` border border-[#E7E9EF] p-3 rounded-[12px] `}>
          <View style={tw`flex-row justify-between items-center `}>
            <View style={tw`flex-row items-center gap-x-2`}>
              <SvgXml xml={busShowIcon} width={33} height={20} />
              <Text
                style={tw`text-[16px] font-Manrope-SemiBold.ttf text-blackText `}
              >
                Rahman Travels
              </Text>
            </View>
            <Text style={tw`text-[#F86B17] text-sm font-Manrope-SemiBold.ttf `}>
              32 Seat Left
            </Text>
          </View>

          {/* Route Time & Timeline */}
          <View style={tw`flex-row justify-between items-center my-4`}>
            <View>
              <Text style={tw`text-black font-Manrope-Regular.ttf text-[16px]`}>
                08:00
              </Text>
              <Text
                style={tw`text-[#6D717F] text-[10px] font-Manrope-Regular.ttf `}
              >
                Jakarta
              </Text>
            </View>

            <View style={tw`flex-1 mx-3 flex-row items-center justify-center`}>
              <View style={tw`w-1.5 h-1.5 rounded-full bg-gray-300`} />
              <View
                style={tw`flex-1 border-b border-dashed border-gray-300 mx-1`}
              />
              <Text style={tw`text-[11px] text-gray-400 font-medium px-1`}>
                9h 30m
              </Text>
              <View
                style={tw`flex-1 border-b border-dashed border-gray-300 mx-1`}
              />
              <View style={tw`w-1.5 h-1.5 rounded-full bg-gray-300`} />
            </View>

            <View style={tw`items-end`}>
              <Text style={tw`text-black font-Manrope-Regular.ttf text-[16px]`}>
                10:30
              </Text>
              <Text
                style={tw`text-[#6D717F] text-[10px] font-Manrope-Regular.ttf `}
              >
                Surabaya
              </Text>
            </View>
          </View>

          {/* Amenities Row */}
          <View style={tw`flex-row items-center justify-between  px-1`}>
            <View style={tw`flex-row items-center gap-x-1.5`}>
              <Snowflake size={14} color="#111827" />
              <Text
                style={tw`text-[10px] font-Manrope-Regular.ttf  text-blackText `}
              >
                AC
              </Text>
            </View>

            <View style={tw`h-3 w-[1px] bg-gray-200`} />

            <View style={tw`flex-row items-center gap-x-1.5`}>
              <Armchair size={14} color="#111827" />
              <Text
                style={tw`text-[10px] font-Manrope-Regular.ttf  text-blackText `}
              >
                Reclining Seat
              </Text>
            </View>

            <View style={tw`h-3 w-[1px] bg-gray-200`} />

            <View style={tw`flex-row items-center gap-x-1.5`}>
              <Plug size={14} color="#111827" />
              <Text
                style={tw`text-[10px] font-Manrope-Regular.ttf  text-blackText `}
              >
                USB Charger
              </Text>
            </View>

            <View style={tw`h-3 w-[1px] bg-gray-200`} />

            <View style={tw`flex-row items-center gap-x-1.5`}>
              <Bath size={14} color="#111827" />
              <Text
                style={tw`text-[10px] font-Manrope-Regular.ttf  text-blackText `}
              >
                Toilet
              </Text>
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={tw`flex-row items-center justify-center gap-x-5 my-6`}>
          <View style={tw`flex-row items-center gap-x-2`}>
            <View
              style={tw`w-4 h-4 rounded-full border border-gray-200 bg-white`}
            />
            <Text style={tw`text-xs text-gray-700 font-medium`}>Available</Text>
          </View>
          <View style={tw`flex-row items-center gap-x-2`}>
            <View style={tw`w-4 h-4 rounded-full bg-[#646A79]`} />
            <Text style={tw`text-xs text-gray-700 font-medium`}>Booked</Text>
          </View>
          <View style={tw`flex-row items-center gap-x-2`}>
            <View style={tw`w-4 h-4 rounded-full bg-[#F95700]`} />
            <Text style={tw`text-xs text-gray-700 font-medium`}>Selected</Text>
          </View>
        </View>

        {/* Bus Layout Card */}
        <View
          style={tw`bg-white border border-gray-100 rounded-3xl p-5 shadow-xs`}
        >
          {/* Top Bus Controls (Door & Steering Wheel) */}
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View
              style={tw`px-6 py-2.5 border border-gray-200 rounded-2xl bg-white`}
            >
              <Text style={tw`text-sm font-semibold text-gray-800`}>Door</Text>
            </View>
            <View style={tw`w-12 h-12 items-center justify-center`}>
              <SvgXml xml={driverIcon} />
            </View>
          </View>

          {/* Column Headers */}
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`flex-row gap-x-3 w-[100px] justify-between px-1`}>
              <Text
                style={tw`w-11 text-center font-bold text-gray-800 text-base`}
              >
                A
              </Text>
              <Text
                style={tw`w-11 text-center font-bold text-gray-800 text-base`}
              >
                B
              </Text>
            </View>
            <View style={tw`flex-1`} />
            <View style={tw`flex-row gap-x-3 w-[100px] justify-between px-1`}>
              <Text
                style={tw`w-11 text-center font-bold text-gray-800 text-base`}
              >
                C
              </Text>
              <Text
                style={tw`w-11 text-center font-bold text-gray-800 text-base`}
              >
                D
              </Text>
            </View>
          </View>

          {/* Seat Grid (Rows 1 to 10) */}
          <View style={tw`gap-y-3`}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rowNum) => (
              <View key={rowNum} style={tw`flex-row items-center`}>
                {/* Left Side Seats (A & B) */}
                <View style={tw`flex-row gap-x-3`}>
                  {renderSeatBox(rowNum, "A")}
                  {renderSeatBox(rowNum, "B")}
                </View>

                {/* Center Row Number */}
                <Text
                  style={tw`flex-1 text-center font-bold text-gray-900 text-base`}
                >
                  {rowNum}
                </Text>

                {/* Right Side Seats (C & D) */}
                <View style={tw`flex-row gap-x-3`}>
                  {renderSeatBox(rowNum, "C")}
                  {renderSeatBox(rowNum, "D")}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Buttons */}
      <View
        style={tw`absolute bottom-4 border-t border-[#EAEAEA]  left-0 right-0 bg-white px-5 py-6 flex-row gap-x-3`}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`flex-1 bg-[#57720F] py-3.5 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-white font-semibold text-sm`}>Edit Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
