import Link from "next/link";
import { Button } from "./button";

const NavBar = () => {
  return (
    <header>
      <nav className="h-10  flex justify-between w-full bg-gray-950">
        <Link href="/">
          <h1 className="text-red-700 ml-2 my-auto font-semibold">F86</h1>
        </Link>
        <Link href="/auth/login">
          <Button
            variant="outline"
            className="font-semibold hover:bg-red-500 my-1 mr-1 h-8"
          >
            Login
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default NavBar;
