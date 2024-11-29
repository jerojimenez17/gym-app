import { Input } from "@/components/ui/input";

const page = () => {
  return (
    <div className="h-full bg-slate-100 overflow-auto">
      <div className="flex flex-col gap-3">
        <div className="h-20 text-2xl text-red-400 font-bold mx-auto my-2">
          <h1>Bienvenido</h1>
        </div>
        <div className="mx-auto w-2/3 font-semibold text-gray-900">
          <p>Ingrese su DNI:</p>
          <Input type="text" placeholder="DNI:XXXXXXXX" />
        </div>
      </div>
    </div>
  );
};

export default page;
