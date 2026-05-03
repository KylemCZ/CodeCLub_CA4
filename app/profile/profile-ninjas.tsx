import { fetchGuardianNinjas } from "@/app/action/users";
import AddNinjaCard from "@/app/components/addNinjaCard";
import Image from "next/image";


export default async function ProfileNinjas() {
  const ninjas = await fetchGuardianNinjas();

  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">
        My <span className="text-emerald-400">Ninjas</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {ninjas.map((ninja) => (
          
          <div key={ninja.id} className="relative rounded-2xl border-4 border-emerald-400 overflow-hidden min-h-40">
            <Image
              src={ninja.image}
              fill
              className="object-cover"
              alt={`${ninja.name} icon`}
            />
            <div className="absolute bottom-0 left-0 right-0 rounded-b-xl overflow-hidden">
              <p className="bg-emerald-400 text-white font-bold text-lg text-center first-letter:capitalize truncate">{ninja.name}</p>
            </div>
          </div>
        ))}
        {Array.from({ length: 5 - ninjas.length }).map((_, i) => (
          <div key={i} className="bg-cyan-950 rounded-2xl border-4 border-emerald-400 p-6 min-h-40 flex items-center justify-center">
            <AddNinjaCard />
          </div>
        ))}
      </div>
    </section>
  );
}
