import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useUserRegistrationMutation } from "@/redux/authApi";
import BackButton from "../../../components/ui/BackButton";
import Button from "../../../components/ui/Button";
import { FormPasswordInput } from "../../../components/ui/FormPasswordInput";
import { FormTextInput } from "../../../components/ui/FormTextInput";
import { InputEmail } from "../../../components/ui/InputEmail";
import { countryData, CountryOption } from "../../../lib/countryData";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";

export interface RiderRegistrationPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  country: string;
  city: string;
  currency: string;
}

export default function Registration() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RiderRegistrationPayload>({
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      country: "",
      currency: "",
      city: "",
    },
  });

  const [userRegistration, { isLoading }] = useUserRegistrationMutation();

  const selectedCountryCode = watch("country");
  const selectedCurrency = watch("currency");

  // Display label for selected country button
  const selectedCountryLabel =
    countryData.find((c) => c.code === selectedCountryCode)?.country ||
    "Select your country";

  const filteredCountries = countryData.filter((c) =>
    c.country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectCountry = (item: CountryOption) => {
    // Sets country code (e.g. "BD") and auto-populates currency (e.g. "BDT")
    setValue("country", item.code, { shouldValidate: true });
    setValue("currency", item.currencyCode, { shouldValidate: true });
    setModalVisible(false);
    setSearchQuery("");
  };

  const onSubmit = async (data: RiderRegistrationPayload) => {
    try {
      const res = await userRegistration(data).unwrap();
      router.push(
        `/(auth)/otp-verify?email=${data?.email}&page_name=registration`,
      );
      reset();
      return successMsg(res.message);
    } catch (error) {
      return errorMsg(
        error && typeof error === "object" && "data" in error
          ? ((error as { data?: { message?: string } }).data?.message ??
              String(error))
          : error instanceof Error
            ? error.message
            : String(error),
      );
    }
  };

  return (
    <View style={tw`flex-1 bg-bgOlive`}>
      <View style={tw`flex-1`}>
        {/* Header Section */}
        <View style={tw`relative overflow-hidden mb-1`}>
          <View style={tw`z-10 pr-20`}>
            <BackButton />
            <View style={tw`px-5`}>
              <Text style={tw`text-white text-2xl font-semibold mb-1.5`}>
                Create your account
              </Text>
              <Text style={tw`text-white/80 text-sm mt-3`}>
                Register to continue your journey with us
              </Text>
            </View>
          </View>
        </View>

        {/* White Form Container */}
        <View style={tw`flex-1 bg-white rounded-t-[36px] mt-10 px-6 pt-6`}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-20`}
            keyboardShouldPersistTaps="handled"
          >
            {/* Full Name */}
            <View style={tw`mb-4.5`}>
              <FormTextInput
                name="name"
                label="Full Name"
                control={control as any}
                errors={errors}
                placeholder="Enter your name"
                rules={{ required: "Full name is required" }}
              />
            </View>

            {/* Email Address */}
            <View style={tw`mb-4.5`}>
              <InputEmail
                name="email"
                label="Email Address"
                control={control as any}
                errors={errors}
                placeholder="Enter Your Email"
                keyboardType="email-address"
                autoCapitalize="none"
                rules={{
                  required: "Email is required",
                  validate: (value) => {
                    const isEmail = /\S+@\S+\.\S+/.test(value);
                    const isPhone = /^[0-9+\s-]{8,15}$/.test(value);
                    return isEmail || isPhone || "Enter a valid email address";
                  },
                }}
              />
            </View>

            {/* Country Dropdown Selector */}
            <View style={tw`mb-4.5`}>
              <Text style={tw`text-sm text-[#757575]  mb-1.5`}>Country</Text>
              <Controller
                control={control}
                name="country"
                rules={{ required: "Country selection is required" }}
                render={() => (
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={tw`border ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    } rounded-xl px-4 py-3.5 bg-gray-50 flex-row justify-between items-center`}
                  >
                    <Text
                      style={tw`${
                        selectedCountryCode ? "text-gray-900" : "text-gray-400"
                      } text-base`}
                    >
                      {selectedCountryLabel}
                    </Text>
                    <Text style={tw`text-gray-500 text-xs`}>▼</Text>
                  </TouchableOpacity>
                )}
              />
              {errors.country && (
                <Text style={tw`text-red-500 text-xs mt-1`}>
                  {errors.country.message}
                </Text>
              )}
            </View>

            {/* Disabled Currency Field */}
            <View style={tw`mb-4.5`}>
              <Text style={tw`text-sm text-[#757575]  mb-1.5`}>Currency</Text>
              <View
                style={tw`border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-100 flex-row justify-between items-center`}
              >
                <Text
                  style={tw`${
                    selectedCurrency ? "text-gray-800 " : "text-gray-400"
                  } text-base`}
                >
                  {selectedCurrency || "Auto-selected based on country"}
                </Text>
              </View>
            </View>

            {/* City */}
            <View style={tw`mb-4.5`}>
              <FormTextInput
                name="city"
                label="City"
                control={control as any}
                errors={errors}
                placeholder="Enter your city name"
                rules={{ required: "City name is required" }}
              />
            </View>

            {/* Password */}
            <View style={tw`mb-4.5`}>
              <FormPasswordInput
                name="password"
                label="Password"
                control={control as any}
                errors={errors}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />
            </View>

            {/* Confirm Password */}
            <View style={tw`mb-2`}>
              <FormPasswordInput
                name="password_confirmation"
                label="Confirm Password"
                placeholder="Re-enter password"
                control={control as any}
                errors={errors}
                rules={{
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                }}
              />
            </View>

            {/* Submit Button */}
            <View style={tw`mt-5`}>
              <Button
                onPress={handleSubmit(onSubmit)}
                text="Sign up"
                isLoading={isLoading}
              />
            </View>

            {/* Footer */}
            <View style={tw`flex-row justify-center items-center mt-4`}>
              <Text style={tw`text-xs text-gray-400`}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={tw`text-xs font-bold text-[#5d7a12]`}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Country Selection Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl max-h-[80%] p-5`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                Select Country
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={tw`text-base font-semibold text-gray-500`}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <TextInput
              style={tw`border border-gray-300 rounded-xl px-4 py-2.5 mb-3 bg-gray-50 text-base`}
              placeholder="Search country..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`py-3 px-2 border-b border-gray-100 flex-row justify-between items-center`}
                  onPress={() => handleSelectCountry(item)}
                >
                  <Text style={tw`text-base text-gray-800`}>
                    {item.country}
                  </Text>
                  <Text style={tw`text-sm text-gray-400`}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
