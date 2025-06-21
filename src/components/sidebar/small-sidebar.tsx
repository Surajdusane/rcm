import Link from "next/link";
import { MainMenu } from "./main-menu";

export function Sidebar() {
  return (
    <aside className="h-screen flex-shrink-0 flex-col justify-between fixed top-0 pb-4 items-center hidden md:flex border-r border-border w-[70px]">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="size-[70px] flex items-center justify-center border-b border-border">
          <Link href="/">
            <h1 className="text-xl font-semibold">RCM</h1>
          </Link>
        </div>

        <MainMenu />
      </div>

      
    </aside>
  );
}