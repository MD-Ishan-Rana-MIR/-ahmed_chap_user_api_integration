import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomInput from "../../../components/CustomInput";
import { FormDatePicker } from "../../../components/FormDatePicker";
import { FormGenderSelect } from "../../../components/FormGenderSelect";
import BackButton from "../../../components/ui/BackButton";
import tw from "../../../lib/tailwind";

interface ProfileUpdate {
  full_name: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  address: string;
}

export default function ProfileSetUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdate>({
    defaultValues: {
      full_name: "",
      phone_number: "",
      gender: "",
      date_of_birth: "",
      address: "",
    },
  });

  const { page_name } = useLocalSearchParams<{ page_name?: string }>();

  const handleNavigate = () => {};

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* header option  */}

      <BackButton title="Profile set-up" />

      <View style={tw`mt-5 px-5`}>
        {/* Full Name  */}

        <CustomInput
          name="full_name"
          label="Full Name"
          control={control as any}
          errors={errors}
          placeholder="Enter your name"
          rules={{ required: "First name is required" }}
        />

        <View style={tw`mt-4.5`}>
          <CustomInput
            name="phone_number"
            label="Phone Number"
            control={control as any}
            errors={errors}
            placeholder="Enter your phone number"
            rules={{
              required: "Phone number is required",
              validate: (val) => {
                // Strips non-digits to check actual digit count (standard 7 to 15 digits)
                const digitsOnly = val?.replace(/\D/g, "") || "";
                if (digitsOnly.length < 7 || digitsOnly.length > 15) {
                  return "Please enter a valid phone number (7-15 digits)";
                }
                return true;
              },
            }}
          />
        </View>

        <View style={tw`mt-4.5 flex flex-row gap-x-3.5 `}>
          <View style={tw`w-[50%]`}>
            <FormGenderSelect
              name="gender"
              label="Gender"
              control={control as any}
              errors={errors}
              placeholder="Select Gender"
              // rules={{ required: "Gender selection is required" }}
            />
          </View>
          <View style={tw`w-[50%]`}>
            <FormDatePicker
              name="dob"
              label="Date of Birth"
              placeholder="DD/MM/YY"
              control={control as any}
              errors={errors}
              // rules={{ required: "Date of birth is required" }}
            />
          </View>
        </View>

        <View style={tw`mt-4.5`}>
          <CustomInput
            name="full_name"
            label="Address"
            control={control as any}
            errors={errors}
            placeholder="Enter your name"
            // rules={{ required: "Address is required" }}
          />
        </View>

        <View style={tw`mt-7`}>
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/profile-picture-upload");
            }}
            activeOpacity={0.9}
            style={tw` bg-bgOlive py-3.5 rounded-[36.55px] `}
          >
            <Text
              style={tw`text-white text-center  text-sm font-Manrope-Medium.ttf `}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
