import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../lib/tailwind";

const DAYS_HEADER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const isSameDay = (d1: Date | null, d2: Date) => {
  if (!d1) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const formatDateToString = (date: Date | null): string => {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const parseStringToDate = (str: string): Date | null => {
  const reg = /^\d{4}-\d{2}-\d{2}$/;
  if (!reg.test(str)) return null;
  const [year, month, day] = str.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
};

export interface BookingSelection {
  startDate: Date | null;
  endDate: Date | null;
  rooms: string;
  guests: string;
}

interface HotelBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (data: BookingSelection) => void;
  title?: string;
}

export default function HotelBookingModal({
  visible,
  onClose,
  onApply,
  title = "Select Date & Time",
}: HotelBookingModalProps) {
  const insets = useSafeAreaInsets();

  const [viewDate, setViewDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [checkInInput, setCheckInInput] = useState("");
  const [checkOutInput, setCheckOutInput] = useState("");
  const [rooms, setRooms] = useState("1");
  const [guests, setGuests] = useState("2");

  // Reset state whenever modal opens
  useEffect(() => {
    if (visible) {
      setStartDate(null);
      setEndDate(null);
      setCheckInInput("");
      setCheckOutInput("");
      setRooms("1");
      setGuests("2");
      setViewDate(new Date());
    }
  }, [visible]);

  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + (direction === "next" ? 1 : -1),
      1,
    );
    setViewDate(newDate);
  };

  const calendarGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      grid.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
      });
    }

    const remaining = (7 - (grid.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      grid.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
      });
    }

    return grid;
  }, [viewDate]);

  const handleDatePress = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setCheckInInput(formatDateToString(date));
      setCheckOutInput("");
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setStartDate(date);
        setCheckInInput(formatDateToString(date));
      } else {
        setEndDate(date);
        setCheckOutInput(formatDateToString(date));
      }
    }
  };

  const handleCheckInChangeText = (text: string) => {
    setCheckInInput(text);
    const parsed = parseStringToDate(text);
    if (parsed) {
      setStartDate(parsed);
      setViewDate(new Date(parsed));
    }
  };

  const handleCheckOutChangeText = (text: string) => {
    setCheckOutInput(text);
    const parsed = parseStringToDate(text);
    if (parsed) {
      setEndDate(parsed);
    }
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const time = date.getTime();
    return time >= startDate.getTime() && time <= endDate.getTime();
  };

  const handleContinue = () => {
    onApply({
      startDate,
      endDate,
      rooms,
      guests,
    });
    onClose();
  };

  const today = new Date();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* Dimmed Overlay */}
      <View style={tw`flex-1 bg-black/50 justify-end`}>
        <Pressable style={tw`flex-1`} onPress={onClose} />

        {/* Bottom Sheet Modal Container */}
        <View
          style={[
            tw`bg-white rounded-t-3xl overflow-hidden max-h-[90%]`,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <StatusBar style="light" />

          {/* Drag Handle Indicator */}
          <View style={tw`w-full items-center pt-3 pb-1 bg-white`}>
            <View style={tw`w-12 h-1 bg-gray-300 rounded-full`} />
          </View>

          {/* Header Bar */}
          <View
            style={tw`flex-row justify-between items-center px-5 py-3 border-b border-gray-100 bg-white`}
          >
            <Text style={tw`text-lg font-bold text-[#1F2937]`}>{title}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={tw`w-8 h-8 items-center justify-center rounded-full bg-gray-100`}
            >
              <Ionicons name="close" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`p-5`}
          >
            {/* Calendar Card Container */}
            <View
              style={tw`border border-gray-100 rounded-3xl p-4 bg-white mb-6`}
            >
              {/* Month Selector Header */}
              <View style={tw`flex-row justify-between items-center mb-6 px-2`}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => changeMonth("prev")}
                  style={tw`p-1.5 rounded-full bg-gray-50`}
                >
                  <Ionicons name="chevron-back" size={18} color="#4B5563" />
                </TouchableOpacity>

                <View style={tw`flex-row items-center gap-1.5`}>
                  <Text style={tw`text-base font-bold text-[#1F2937]`}>
                    {viewDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#4B5563" />
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => changeMonth("next")}
                  style={tw`p-1.5 rounded-full bg-gray-50`}
                >
                  <Ionicons name="chevron-forward" size={18} color="#4B5563" />
                </TouchableOpacity>
              </View>

              {/* Days Header */}
              <View style={tw`flex-row mb-3`}>
                {DAYS_HEADER.map((day, idx) => (
                  <Text
                    key={idx}
                    style={tw`flex-1 text-center text-xs font-semibold text-gray-400`}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              {/* Dynamic Grid */}
              <View style={tw`flex-row flex-wrap`}>
                {calendarGrid.map((item, index) => {
                  const isStart = isSameDay(startDate, item.date);
                  const isEnd = isSameDay(endDate, item.date);
                  const isRange = isInRange(item.date);
                  const isCurrentDay = isSameDay(today, item.date);

                  return (
                    <View
                      key={index}
                      style={[
                        tw`h-11 items-center justify-center my-0.5`,
                        { width: "14.28%" },
                      ]}
                    >
                      {isRange && item.isCurrentMonth && (
                        <View
                          style={[
                            tw`absolute top-0 bottom-0 left-0 right-0 bg-[#FFF0E8]`,
                            isStart && tw`rounded-l-full`,
                            isEnd && tw`rounded-r-full`,
                          ]}
                        />
                      )}

                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!item.isCurrentMonth}
                        onPress={() => handleDatePress(item.date)}
                        style={[
                          tw`w-10 h-10 rounded-full items-center justify-center relative`,
                          (isStart || isEnd) && tw`bg-[#F25C05]`,
                        ]}
                      >
                        <Text
                          style={[
                            tw`text-sm`,
                            item.isCurrentMonth
                              ? tw`text-[#374151]`
                              : tw`text-gray-300`,
                            isCurrentDay &&
                              !isStart &&
                              !isEnd &&
                              tw`font-extrabold text-[#111827]`,
                            (isStart || isEnd) && tw`text-white font-bold`,
                          ]}
                        >
                          {item.date.getDate()}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Check In / Check Out Inputs */}
            <View style={tw`flex-row gap-3 mb-4`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs text-gray-500 mb-1.5 ml-1`}>
                  Check In
                </Text>
                <View
                  style={tw`border border-gray-100 rounded-full px-4 py-2.5 flex-row justify-between items-center bg-white`}
                >
                  <TextInput
                    value={checkInInput}
                    onChangeText={handleCheckInChangeText}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                    style={tw`text-xs text-gray-600 flex-1 p-0`}
                  />
                  <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                </View>
              </View>

              <View style={tw`flex-1`}>
                <Text style={tw`text-xs text-gray-500 mb-1.5 ml-1`}>
                  Check Out
                </Text>
                <View
                  style={tw`border border-gray-100 rounded-full px-4 py-2.5 flex-row justify-between items-center bg-white`}
                >
                  <TextInput
                    value={checkOutInput}
                    onChangeText={handleCheckOutChangeText}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                    style={tw`text-xs text-gray-600 flex-1 p-0`}
                  />
                  <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                </View>
              </View>
            </View>

            {/* Number of Room */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-xs text-gray-500 mb-1.5 ml-1`}>
                Number of Room
              </Text>
              <View
                style={tw`border border-gray-100 rounded-full px-4 py-2.5 bg-white`}
              >
                <TextInput
                  value={rooms}
                  onChangeText={setRooms}
                  keyboardType="numeric"
                  style={tw`text-xs text-gray-600 p-0`}
                />
              </View>
            </View>

            {/* Number of Guest */}
            <View style={tw`mb-8`}>
              <Text style={tw`text-xs text-gray-500 mb-1.5 ml-1`}>
                Number of Guest
              </Text>
              <View
                style={tw`border border-gray-100 rounded-full px-4 py-2.5 bg-white`}
              >
                <TextInput
                  value={guests}
                  onChangeText={setGuests}
                  keyboardType="numeric"
                  style={tw`text-xs text-gray-600 p-0`}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleContinue}
              style={tw`bg-[#5B7410] py-4 rounded-full items-center justify-center`}
            >
              <Text style={tw`text-white font-semibold text-base`}>
                Continue
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
