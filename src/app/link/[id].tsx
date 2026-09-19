import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import Notifications from "../../../components/ui/user/notification/Notification";
import About from "../../../components/ui/user/profile/About";
import AccountSetting from "../../../components/ui/user/profile/AccountSetting";
import DeliveryAddress from "../../../components/ui/user/profile/DeliveryAddress";
import ChangePassword from "../../../components/ui/user/profile/PasswordChange";
import PersonalInformation from "../../../components/ui/user/profile/PersonalInformation";
import Privacy from "../../../components/ui/user/profile/Privacy";
import Term from "../../../components/ui/user/profile/Term";

export default function ProfileLink() {
  const { id } = useLocalSearchParams();
  console.log(id);

  if (id === "personal-info") {
    return <PersonalInformation />;
  } else if (id === "setting") {
    return <AccountSetting />;
  } else if (id === "password-change") {
    return <ChangePassword />;
  } else if (id === "address") {
    return <DeliveryAddress />;
  } else if (id === "notification") {
    return <Notifications />;
  } else if (id === "about") {
    return <About />;
  } else if (id === "privacy") {
    return <Privacy />;
  } else if (id === "term") {
    return <Term />;
  }
}

const styles = StyleSheet.create({});
