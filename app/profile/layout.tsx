import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchAllTechs } from "../action/fetch";
import { getUser } from "../lib/dal";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const technologies = await fetchAllTechs();
  const user = await getUser();

  return (
    <>
      <Header technologies={technologies} user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
