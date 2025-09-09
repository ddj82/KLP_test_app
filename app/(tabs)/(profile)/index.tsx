import {Redirect} from 'expo-router';
import ProfileScreen from "@/app/(tabs)/(profile)/profile";
import {useAuthStore} from "@/stores/authStore";

export default function ProfileIndex() {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return <Redirect href="./login" />;
  return <ProfileScreen />;
}
