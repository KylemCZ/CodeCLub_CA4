import { mavenPro } from '../fonts';
import { Technology } from "@/app/lib/definitions";
import { fetchAllTechs } from "../action/fetch";
import TechnologyCard from "@/app/components/technologyCard";
import Add from "@/app/components/addTechnologyCard";
import { getUser } from "@/app/lib/dal";

export default async function Home() {
  const allTechs: Technology[] = await fetchAllTechs();
  const user = await getUser();
  const isAdmin = user?.role === 'admin';
  const technologies = allTechs.filter((t) => t.isActive);
  return (
      <div className="w-2/3 my-4 mx-auto flex flex-col items-center">
      <div id="intro-container" className="w-11/12 sw:w-3/5 bg-cyan-950 p-4 rounded-2xl border-solid border-4 border-emerald-400">
        <h1 className="text-4xl font-bold my-4">Learn to code with <span className="text-emerald-400">Code Club</span></h1>
        <p className={`${mavenPro.className}`}>Our projects have step-by-step instruction to teach you how to create games, animations, and much more. Choose from hundreds of options, in up to 30 languages</p>
      </div>
      <article id="article-container" className="min-w-full mx-5 my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {technologies.map((tech) => (
        <TechnologyCard key={tech.id} tech={tech} />
      ))}
      {isAdmin && <Add/>}
      </article>
      </div>
  );
}