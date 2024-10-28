import { auth, signOut } from "@/../auth";
// import { NavigationMenuHeader } from "@/components/ui/NavBar";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (session)
    return (
      <div className="max-h-screen h-screen flex flex-col items-center justify-center">
        {/*bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-200 to-emerald-400}*/}
        {/* <NavigationMenuHeader session={session} /> */}
        <form
          className="absolute top-5 right-3"
          action={async () => {
            "use server";

            await signOut({ redirectTo: "/auth/login" });
          }}
        >
          <button type="submit" className=" p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H17C17.5523 21 18 20.5523 18 20C18 19.4477 17.5523 19 17 19H6C5.44772 19 5 18.5523 5 18V6C5 5.44772 5.44772 5 6 5H17C17.5523 5 18 4.55228 18 4C18 3.44772 17.5523 3 17 3H6ZM15.7071 7.29289C15.3166 6.90237 14.6834 6.90237 14.2929 7.29289C13.9024 7.68342 13.9024 8.31658 14.2929 8.70711L16.5858 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16.5858L14.2929 15.2929C13.9024 15.6834 13.9024 16.3166 14.2929 16.7071C14.6834 17.0976 15.3166 17.0976 15.7071 16.7071L19.7071 12.7071C20.0976 12.3166 20.0976 11.6834 19.7071 11.2929L15.7071 7.29289Z"
                fill="#000000"
              />
            </svg>
          </button>
        </form>
        {children}
      </div>
    );
};
export default HomeLayout;