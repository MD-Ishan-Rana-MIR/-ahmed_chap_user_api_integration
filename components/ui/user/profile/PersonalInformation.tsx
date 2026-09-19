import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "../../../../lib/tailwind";
import CustomInput from "../../../CustomInput";
import { FormGenderSelect } from "../../../FormGenderSelect";
import BackButton from "../../BackButton";
import Button from "../../Button";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
interface RegistrationFormInputs {
  full_name: string;
  country: string;
  email: string;
  phone_number: string;
  currency: string;
  city: string;
  address: string;
}

export default function PersonalInformation() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormInputs>({
    defaultValues: {
      full_name: "",
      country: "",
      email: "",
      currency: "",
      phone_number: "",
      city: "",
      address: "",
    },
  });

  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("");

  // Gender Dropdown Modal State
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  // Avatar Image State
  const [profileImage, setProfileImage] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
  );

  // Date Picker States
  const [dobDate, setDobDate] = useState<Date>(new Date(1998, 0, 1));
  const [dobText, setDobText] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 1. Image Picker Handler
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // 2. Date Picker Handler
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDobDate(selectedDate);
      const formatted = `${String(selectedDate.getDate()).padStart(
        2,
        "0",
      )}/${String(selectedDate.getMonth() + 1).padStart(
        2,
        "0",
      )}/${selectedDate.getFullYear()}`;
      setDobText(formatted);
    }
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
            {/* Double Border Circle Wrapper */}
            <View
              style={tw`w-24 h-24 rounded-full p-1 border-2 border-[#F25C05] items-center justify-center overflow-hidden`}
            >
              <Image
                source={{ uri: profileImage }}
                style={tw`w-full h-full rounded-full`}
              />
            </View>

            {/* Plus Icon Overlay */}
            <View
              style={tw`absolute bottom-0 right-0 bg-black w-6 h-6 rounded-full items-center justify-center border-2 border-white`}
            >
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Label under Avatar */}
          <TouchableOpacity activeOpacity={0.7} onPress={handlePickImage}>
            <Text style={tw`text-xs font-semibold text-gray-800 mt-2.5`}>
              Change Your Profile Picture
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs Container */}
        {/* Full Name  */}
        <View style={tw``}>
          <CustomInput<RegistrationFormInputs>
            name="full_name"
            label="Full Name"
            control={control as any}
            errors={errors}
            placeholder="Enter Your Full Name"
            // rules={{
            //   required: "Country is required",
            // }}
          />

          {/* Email Address */}
          <CustomInput<RegistrationFormInputs>
            name="email"
            label="Email Address"
            control={control as any}
            errors={errors}
            placeholder="Enter Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
            // rules={{
            //   required: "Email is required",
            //   pattern: {
            //     value: /\S+@\S+\.\S+/,
            //     message: "Enter a valid email address",
            //   },
            // }}
          />

          {/* Phone Number Input */}
          <CustomInput<RegistrationFormInputs>
            name="phone_number"
            label="Phone Number"
            control={control as any}
            errors={errors}
            placeholder="Enter Your Phone Number"
            keyboardType="phone-pad"
            // rules={{
            //   required: "Phone number is required",
            // }}
          />

          {/* Gender Selector Dropdown */}
          <View>
            <FormGenderSelect
              name="gender"
              label="Gender"
              control={control as any}
              errors={errors}
              placeholder="Select Gender"
              // rules={{ required: "Gender selection is required" }}
            />
          </View>

          <View style={tw`mt-4.5`}>
            <CustomInput<RegistrationFormInputs>
              name="country"
              label="Country"
              control={control as any}
              errors={errors}
              placeholder="Enter Your Country"
              // rules={{
              //   required: "Country is required",
              // }}
            />
          </View>
          {/* City  */}
          <View style={tw``}>
            <CustomInput<RegistrationFormInputs>
              name="city"
              label="City"
              control={control as any}
              errors={errors}
              placeholder="Enter Your City"
              // rules={{
              //   required: "City is required",
              // }}
            />
          </View>

          {/* Address  */}
          <View style={tw``}>
            <CustomInput<RegistrationFormInputs>
              name="address"
              label="Address"
              control={control as any}
              errors={errors}
              placeholder="Enter Your Address"
              // rules={{
              //   required: "Address is required",
              // }}
            />
          </View>

          {/* Date of Birth Native Picker */}
          <View>
            <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
              Date of Birth
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDatePicker(true)}
              style={tw`border border-gray-100 rounded-full px-4 py-3 bg-white flex-row justify-between items-center`}
            >
              <Text
                style={tw`text-sm ${
                  dobText ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {dobText || "DD/MM/YYYY"}
              </Text>
              <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Native Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={dobDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={tw`mt-7`}>
            <Button text="Save Changes" />
          </View>
        </View>
      </ScrollView>

      {/* Gender Dropdown Selection Modal */}
      <Modal
        visible={showGenderDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowGenderDropdown(false)}>
          <View style={tw`flex-1 bg-black/40 justify-center items-center px-6`}>
            <TouchableWithoutFeedback>
              <View style={tw`bg-white rounded-2xl w-full p-4 shadow-lg`}>
                <Text
                  style={tw`text-base font-semibold text-gray-900 mb-3 px-2`}
                >
                  Select Gender
                </Text>
                {GENDER_OPTIONS.map((item, index) => {
                  const isSelected = item === gender;
                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.7}
                      onPress={() => {
                        setGender(item);
                        setShowGenderDropdown(false);
                      }}
                      style={[
                        tw`flex-row items-center justify-between py-3 px-3 rounded-xl`,
                        isSelected && tw`bg-gray-50`,
                        index !== GENDER_OPTIONS.length - 1 &&
                          tw`border-b border-gray-100`,
                      ]}
                    >
                      <Text
                        style={tw`text-sm ${
                          isSelected
                            ? "font-semibold text-[#F25C05]"
                            : "text-gray-700"
                        }`}
                      >
                        {item}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={18} color="#F25C05" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
