import { getFullUser } from "@/app/lib/dal";
import ProfileInfo from "./profile-info";
import ProfileBookings from "./profile-bookings";
import ProfileNinjas from "./profile-ninjas";

export default async function ProfilePage() {
  const user = await getFullUser();
  if (!user) return null;

  return (
    <div className="w-2/3 my-8 mx-auto space-y-10">
      <ProfileInfo />
      <ProfileBookings />
      {user.role === 'guardian' && <ProfileNinjas />}
    </div>
  );
}
