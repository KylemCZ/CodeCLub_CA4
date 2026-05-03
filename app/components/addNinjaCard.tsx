import Link from "next/link";

export default function AddNinjaCard() {
  return (
        <Link href="/guardian/add-ninja" className={"h-full w-full items-center justify-center flex"}>
            <div className="text-9xl" style={{transform: 'translateY(-0.1em)'}}>
            +
            </div>
        </Link>
  );
}