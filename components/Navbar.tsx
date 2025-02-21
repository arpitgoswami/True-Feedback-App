import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-transparent absolute w-full z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-2 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-sm">
              Youtube Tool
              <span className="text-xs text-green-500 ml-2 border border-green-500 rounded-md px-2 py-1 hover:bg-green-500 hover:text-white transition-all duration-300">
                BETA RELEASE
              </span>
            </Link>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white">
                    Documentation
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
