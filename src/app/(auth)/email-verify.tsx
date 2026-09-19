import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import CustomInput from "../../../components/CustomInput";
import BackButton from "../../../components/ui/BackButton";
import Button from "../../../components/ui/Button";
import tw from "../../../lib/tailwind";

interface EmailVerifyFormInputs {
  email: string;
}

const EmailVerify = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerifyFormInputs>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (_data: EmailVerifyFormInputs) => {
    router.push("/(auth)/otp-verify");
  };

  return (
    <View style={tw`bg-bgOlive flex-1`}>
      {/* Header Container */}
      <View style={tw`relative overflow-hidden h-[218px] mb-1`}>
        {/* Header Content */}
        <View style={tw`z-10 pr-20`}>
          {/* Back Button */}
          <View>
            <BackButton />
          </View>

          {/* Title & Subtitle */}
          <View style={tw`px-5`}>
            <Text style={tw`text-white text-2xl font-semibold mb-1.5`}>
              Forgot Password
            </Text>
            <Text style={tw`text-white/80 text-sm mt-3`}>
              Please enter your email address which was used to create your
              account.
            </Text>
          </View>
        </View>
      </View>

      {/* Form Container */}
      <View
        style={tw`bg-white flex-1 px-5 rounded-tl-[37px] rounded-tr-[37px]`}
      >
        <View style={tw`mt-6`}>
          <CustomInput<EmailVerifyFormInputs>
            name="email"
            label="Email Address"
            control={control}
            errors={errors}
            placeholder="Enter Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email address",
              },
            }}
          />
        </View>

        {/* Submit Section */}
        <View style={tw`gap-4 mt-7`}>
          <Button
            onPress={handleSubmit(onSubmit)}
            text="Continue"
            // disabled={isSubmi0tting}
          />
        </View>
      </View>
    </View>
  );
};

export default EmailVerify;
