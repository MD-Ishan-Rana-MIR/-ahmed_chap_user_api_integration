import { router } from "expo-router";
import { Compass, Home, Sparkles } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "./../../lib/tailwind";

export default function NotFoundScreen() {
  const onGoHome = () => {
    router.back();
  };
  return (
    <View
      style={tw`flex-1 items-center justify-center bg-[#5B7410] px-6 relative overflow-hidden`}
    >
      {/* Ambient Background Glows */}
      <View
        style={tw`absolute -top-20 -left-20 w-72 h-72 bg-lime-300/20 rounded-full blur-3xl`}
      />
      <View
        style={tw`absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl`}
      />

      {/* Decorative Layered Icon Graphic */}
      <View style={tw`relative mb-8 items-center justify-center`}>
        {/* Soft Icon Glow */}
        <View
          style={tw`absolute w-36 h-36 bg-white/20 rounded-full blur-2xl`}
        />

        {/* Outer Circle */}
        <View
          style={tw`w-32 h-32 rounded-full border-2 border-white/20 items-center justify-center bg-white/10 backdrop-blur-md`}
        >
          {/* Inner Card Container */}
          <View
            style={tw`w-20 h-20 bg-white/20 rounded-2xl border border-white/30 items-center justify-center shadow-2xl`}
          >
            <Compass size={44} color="#ffffff" strokeWidth={1.75} />
          </View>
        </View>

        {/* Floating Decorative Sparkle Badge */}
        <View
          style={tw`absolute -top-1 -right-1 p-2 bg-white rounded-full border-2 border-[#5B7410] shadow-md`}
        >
          <Sparkles size={14} color="#5B7410" />
        </View>
      </View>

      {/* 404 Pill Badge */}
      <View
        style={tw`flex-row items-center px-3.5 py-1.5 bg-white/15 rounded-full border border-white/25 mb-4`}
      >
        <View style={tw`w-2 h-2 rounded-full bg-white mr-2 animate-pulse`} />
        <Text
          style={tw`text-xs font-bold uppercase tracking-widest text-white`}
        >
          Error 404
        </Text>
      </View>

      {/* Heading & Subtitle */}
      <Text
        style={tw`text-3xl font-extrabold text-white text-center mb-3 tracking-tight`}
      >
        Lost in Territory
      </Text>
      <Text
        style={tw`text-sm text-lime-100/90 text-center max-w-xs leading-relaxed mb-8`}
      >
        The screen you're looking for was moved, renamed, or no longer exists.
      </Text>

      {/* Action Buttons */}
      <View style={tw`w-full max-w-xs gap-y-3`}>
        {/* Primary Action: Go Home */}
        <TouchableOpacity
          onPress={onGoHome}
          activeOpacity={0.8}
          style={tw`w-full flex-row items-center justify-center bg-white py-3.5 px-6 rounded-2xl shadow-lg shadow-black/20`}
        >
          <Home size={18} color="#5B7410" style={tw`mr-2`} />
          <Text style={tw`text-[#5B7410] font-bold text-base`}>
            Back to Home
          </Text>
        </TouchableOpacity>

        {/* Secondary Action: Go Back */}
        {/* {onGoBack && (
          <TouchableOpacity
            onPress={onGoBack}
            activeOpacity={0.7}
            style={tw`w-full flex-row items-center justify-center bg-white/10 border border-white/25 py-3.5 px-6 rounded-2xl`}
          >
            <ArrowLeft size={18} color="#ffffff" style={tw`mr-2`} />
            <Text style={tw`text-white font-semibold text-base`}>Go Back</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
}
