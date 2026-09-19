import { ScrollView, StyleSheet, Text, View } from "react-native";
import tw from "../../../../lib/tailwind";
import BackButton from "../../BackButton";

export default function About() {
  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="About Us" showBackButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`bg-white px-5 pt-5 pb-10`}
      >
        <View style={tw`gap-y-4`}>
          {/* Main Title */}
          <Text
            style={tw`text-[#1A1A1A] font-Manrope-Bold.ttf text-lg leading-snug`}
          >
            Chapplus About Us
          </Text>

          {/* Paragraph 1 */}
          <Text
            style={tw`text-[#727272] text-sm font-Manrope-Regular.ttf leading-6`}
          >
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </Text>

          {/* Paragraph 2 */}
          <Text
            style={tw`text-[#727272] text-sm font-Manrope-Regular.ttf leading-6`}
          >
            Many desktop publishing packages and web page editors now use Lorem
            Ipsum as their default model text, and a search for 'lorem ipsum'
            will uncover many web sites still in their infancy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
