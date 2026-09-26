import {
  useUserProfileQuery,
  useUserProfileUpdateMutation,
} from "@/redux/authApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { errorMsg } from "../../../../lib/msg/errorMsg";
import { successMsg } from "../../../../lib/msg/successMsg";
import tw from "../../../../lib/tailwind";
import CustomInput from "../../../CustomInput";
import { FormGenderSelect } from "../../../FormGenderSelect";
import BackButton from "../../BackButton";
import Button from "../../Button";

interface ProfileUpdateForm {
  name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  country: string;
  city: string;
  address: string;
  profile_picture?: string;
  lat?: string;
  lon?: string;
}

// Custom Date Picker Modal Component
interface CustomDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (formattedDate: string) => void;
  initialDate?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function CustomDatePickerModal({
  visible,
  onClose,
  onSelectDate,
  initialDate,
}: CustomDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0); // 0-11
  const [selectedYear, setSelectedYear] = useState(2000);

  const [activeTab, setActiveTab] = useState<"day" | "month" | "year">("day");

  useEffect(() => {
    if (initialDate) {
      const parts = initialDate.split("/");
      if (parts.length === 3) {
        setSelectedDay(parseInt(parts[0], 10) || 1);
        setSelectedMonth((parseInt(parts[1], 10) || 1) - 1);
        setSelectedYear(parseInt(parts[2], 10) || 2000);
      }
    }
  }, [initialDate, visible]);

  // Dynamic Days count in selected Month/Year
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleConfirm = () => {
    const formattedDay = String(selectedDay).padStart(2, "0");
    const formattedMonth = String(selectedMonth + 1).padStart(2, "0");
    onSelectDate(`${formattedDay}/${formattedMonth}/${selectedYear}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={tw`flex-1 bg-black/50 justify-center items-center px-4`}>
        <View style={tw`bg-white w-full rounded-2xl p-5 max-h-[80%]`}>
          <Text style={tw`text-base font-bold text-gray-800 text-center mb-4`}>
            Select Date of Birth
          </Text>

          {/* Selected Date Header */}
          <View
            style={tw`flex-row justify-around bg-orange-50 p-3 rounded-xl mb-4 border border-[#F25C05]/20`}
          >
            <TouchableOpacity onPress={() => setActiveTab("day")}>
              <Text style={tw`text-xs text-gray-500`}>Day</Text>
              <Text
                style={tw`text-lg font-bold ${
                  activeTab === "day" ? "text-[#F25C05]" : "text-gray-700"
                }`}
              >
                {selectedDay}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab("month")}>
              <Text style={tw`text-xs text-gray-500`}>Month</Text>
              <Text
                style={tw`text-lg font-bold ${
                  activeTab === "month" ? "text-[#F25C05]" : "text-gray-700"
                }`}
              >
                {MONTHS[selectedMonth]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab("year")}>
              <Text style={tw`text-xs text-gray-500`}>Year</Text>
              <Text
                style={tw`text-lg font-bold ${
                  activeTab === "year" ? "text-[#F25C05]" : "text-gray-700"
                }`}
              >
                {selectedYear}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selection Area */}
          <View style={tw`h-52 mb-4`}>
            {activeTab === "day" && (
              <FlatList
                data={days}
                numColumns={5}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedDay(item)}
                    style={tw`flex-1 m-1 py-2 rounded-lg items-center ${
                      selectedDay === item ? "bg-[#F25C05]" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      style={tw`font-semibold ${
                        selectedDay === item ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {activeTab === "month" && (
              <FlatList
                data={MONTHS}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedMonth(index);
                      setActiveTab("day");
                    }}
                    style={tw`p-3 my-1 rounded-lg items-center ${
                      selectedMonth === index ? "bg-[#F25C05]" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      style={tw`font-semibold ${
                        selectedMonth === index ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {activeTab === "year" && (
              <FlatList
                data={years}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedYear(item);
                      setActiveTab("month");
                    }}
                    style={tw`p-3 my-1 rounded-lg items-center ${
                      selectedYear === item ? "bg-[#F25C05]" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      style={tw`font-semibold ${
                        selectedYear === item ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row justify-between gap-x-3`}>
            <TouchableOpacity
              onPress={onClose}
              style={tw`flex-1 py-3 bg-gray-200 rounded-full items-center`}
            >
              <Text style={tw`font-semibold text-gray-600`}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              style={tw`flex-1 py-3 bg-[#F25C05] rounded-full items-center`}
            >
              <Text style={tw`font-semibold text-white`}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Main Component
export default function PersonalInformation() {
  const [isFetchingCoords, setIsFetchingCoords] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
  );
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProfileUpdateForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      date_of_birth: "",
      country: "",
      city: "",
      address: "",
      lat: "",
      lon: "",
    },
  });

  // ================= User Profile Api =================
  const { data } = useUserProfileQuery({});
  const profile = data?.data;

  // Initial Form Field Populator when Profile Data arrives
  useEffect(() => {
    if (profile) {
      setValue("name", profile.name || "");
      setValue("email", profile.email || "");
      setValue("phone", profile.phone || "");
      setValue("gender", profile.gender || "");
      setValue("date_of_birth", profile.date_of_birth || "");
      setValue("country", profile.country || "");
      setValue("city", profile.city || "");
      setValue("address", profile.address || "");
      setValue("lat", profile.lat || "");
      setValue("lon", profile.lon || "");
      if (profile.profile_picture) {
        setProfileImage(profile.profile_picture);
      }
    }
  }, [profile, setValue]);

  // ================= Image Picker Handler =================

  // ================= Image Picker Handler =================
  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "You need to allow access to your photos to upload a profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.IMAGES, // Updated API to fix deprecation warning
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setProfileImage(selectedUri);
        setValue("profile_picture", selectedUri, { shouldDirty: true });
      }
    } catch (error) {
      console.error("ImagePicker Error:", error);
      Alert.alert(
        "Error",
        "Failed to open image picker. Please restart the app.",
      );
    }
  };

  // ================= Address -> Coordinates (Lat/Lon) Generator =================
  const geocodeAddress = async (fullAddress: string) => {
    if (!fullAddress.trim()) return;

    try {
      setIsFetchingCoords(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        return;
      }

      const geocoded = await Location.geocodeAsync(fullAddress);

      if (geocoded.length > 0) {
        const { latitude, longitude } = geocoded[0];
        setValue("lat", String(latitude), { shouldDirty: true });
        setValue("lon", String(longitude), { shouldDirty: true });
        console.log("Geocoded Coordinates:", { latitude, longitude });
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
    } finally {
      setIsFetchingCoords(false);
    }
  };

  const handleAddressBlur = () => {
    const address = getValues("address");
    const city = getValues("city");
    const country = getValues("country");

    const fullAddress = [address, city, country].filter(Boolean).join(", ");

    if (fullAddress) {
      geocodeAddress(fullAddress);
    }
  };

  // ===================================================== Profile Update Api ====================================================

  const [userProfileUpdate, { isLoading: profileUpdateLoading }] =
    useUserProfileUpdateMutation();

  // ================= Form Submit Handler =================
  const onSubmit = async (data: ProfileUpdateForm) => {
    let finalLat = data.lat;
    let finalLon = data.lon;

    const fullAddress = [data.address, data.city, data.country]
      .filter(Boolean)
      .join(", ");

    // ১. Geocoding coordinates calculation
    if (fullAddress && (!finalLat || !finalLon)) {
      try {
        const geocoded = await Location.geocodeAsync(fullAddress);
        if (geocoded.length > 0) {
          finalLat = String(geocoded[0].latitude);
          finalLon = String(geocoded[0].longitude);
        }
      } catch (err) {
        console.error("Geocoding during submit failed", err);
      }
    }

    // ২. Constructing FormData
    const formData = new FormData();
    formData.append("name", data?.name || "");
    formData.append("phone", data?.phone || "");
    formData.append("gender", data?.gender || "");
    formData.append("date_of_birth", data?.date_of_birth || "");
    formData.append("address", data?.address || "");
    formData.append("country", data?.country || "");
    formData.append("city", data?.city || "");

    if (finalLat) formData.append("lat", finalLat);
    if (finalLon) formData.append("lon", finalLon);

    // ৩. React Native Standard Image Append
    if (data.profile_picture) {
      const fileUri = data.profile_picture;
      const filename = fileUri.split("/").pop() || "profile.jpg";

      // File Extension থেকে type তৈরি করা
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("profile_picture", {
        uri: fileUri,
        name: filename,
        type: type,
      } as any);
    }

    // ৪. Alert Dialog handling with async onPress
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to update your profile information?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const res = await userProfileUpdate(formData).unwrap();
              if (res) {
                return successMsg(
                  res?.message || "Profile updated successfully!",
                );
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

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Top Navigation Bar */}
      <BackButton title="Personal Information" showBackButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`bg-white px-5 pt-5 pb-10`}
      >
        {/* Avatar Section */}
        <View style={tw`items-center mb-8`}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePickImage}
            style={tw`relative`}
          >
            <View
              style={tw`w-24 h-24 rounded-full p-1 border-2 border-[#F25C05] items-center justify-center overflow-hidden`}
            >
              <Image
                source={{ uri: profileImage }}
                style={tw`w-full h-full rounded-full`}
              />
            </View>

            <View
              style={tw`absolute bottom-0 right-0 bg-black w-6 h-6 rounded-full items-center justify-center border-2 border-white`}
            >
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={handlePickImage}>
            <Text style={tw`text-xs font-semibold text-gray-800 mt-2.5`}>
              Change Your Profile Picture
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs Container */}
        <View style={tw`gap-y-4`}>
          {/* Full Name */}
          <CustomInput<ProfileUpdateForm>
            name="name"
            label="Full Name"
            control={control}
            errors={errors}
            placeholder="Enter Your Full Name"
          />

          {/* Email Address */}
          <CustomInput<ProfileUpdateForm>
            name="email"
            label="Email Address"
            control={control}
            errors={errors}
            placeholder="Enter Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Number Input */}
          <CustomInput<ProfileUpdateForm>
            name="phone"
            label="Phone Number"
            control={control}
            errors={errors}
            placeholder="Enter Your Phone Number"
            keyboardType="phone-pad"
          />

          {/* Gender Selector Dropdown */}
          <FormGenderSelect
            name="gender"
            label="Gender"
            control={control as any}
            errors={errors}
            placeholder="Select Gender"
          />

          {/* Country */}
          <CustomInput<ProfileUpdateForm>
            name="country"
            label="Country"
            control={control}
            errors={errors}
            placeholder="Enter Your Country"
            onBlur={handleAddressBlur}
          />

          {/* City */}
          <CustomInput<ProfileUpdateForm>
            name="city"
            label="City"
            control={control}
            errors={errors}
            placeholder="Enter Your City"
            onBlur={handleAddressBlur}
          />

          {/* Address */}
          <CustomInput<ProfileUpdateForm>
            name="address"
            label="Address"
            control={control}
            errors={errors}
            placeholder="Enter Your Address"
            onBlur={handleAddressBlur}
          />

          {/* Date of Birth Custom Input */}
          <View>
            <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
              Date of Birth
            </Text>
            <Controller
              control={control}
              name="date_of_birth"
              render={({ field: { value } }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setDatePickerVisible(true)}
                  style={tw`border border-gray-100 rounded-full px-4 py-3 bg-white flex-row justify-between items-center`}
                >
                  <Text
                    style={tw`text-sm ${
                      value ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {value || "DD/MM/YYYY"}
                  </Text>
                  <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            />

            {/* Custom Date Picker Modal */}
            <Controller
              control={control}
              name="date_of_birth"
              render={({ field: { value } }) => (
                <CustomDatePickerModal
                  visible={isDatePickerVisible}
                  onClose={() => setDatePickerVisible(false)}
                  initialDate={value}
                  onSelectDate={(formattedDate) => {
                    setValue("date_of_birth", formattedDate, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              )}
            />
          </View>

          {/* Save Button */}
          <View style={tw`mt-7`}>
            <Button
              text="Save Changes"
              onPress={handleSubmit(onSubmit)}
              isLoading={profileUpdateLoading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
