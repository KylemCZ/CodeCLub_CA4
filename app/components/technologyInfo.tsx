import { mavenPro } from "@/app/fonts";
import { Projects } from "../lib/definitions";
import Image from "next/image";

interface TechnologyInfoTypes {
    projects : Projects;
}

const TechnologyInfo = ({ projects }: TechnologyInfoTypes) => {
    return (
                <section
                  className={`p-5 min-h-120 max-h-120 ${projects.bgColor} duration-300 ease-out hover:scale-102 rounded-xl flex flex-col justify-between`}
                >
                  <span>
                    <Image
                      src={projects.image}
                      alt={`${projects.id} logo`}
                      width={261}
                      height={180}
                      className="rounded-md w-full h-45"
                    />
                    <h2 className="text-2xl font-bold my-4">{projects.id}</h2>
                    <p className={`${mavenPro.className} line-clamp-3`}>{projects.description}</p>
                  </span>
                </section>
    );
}

export default TechnologyInfo;
