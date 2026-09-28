import { useGetTermsQuery } from "@/redux/staticApi";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { plainText } from "../../../../lib/plainText";
import tw from "../../../../lib/tailwind";
import BackButton from "../../BackButton";
import { AboutSkeleton } from "../../skeleton/AboutSkeleton";

export default function Term() {
  const { data, isLoading, isFetching, refetch } = useGetTermsQuery({});

  const handleRefresh = async () => {
    await refetch();
  };
  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Terms of service" showBackButton={true} />

      {isLoading ? (
        <AboutSkeleton />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`bg-white px-5 pt-5 pb-10`}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={handleRefresh}
              tintColor="#5B7410"
              colors={["#5B7410"]}
            />
          }
        >
          <View style={tw`gap-y-4`}>
            {/* Main Title */}
            <Text
              style={tw`text-[#1A1A1A] font-Manrope-Bold.ttf text-lg leading-snug`}
            >
              {"Chapplus Terms of service"}
            </Text>

            {/* Paragraph Content */}
            <Text
              style={tw`text-[#727272] text-sm font-Manrope-Regular.ttf leading-6`}
            >
              {plainText(data?.data?.content)}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
