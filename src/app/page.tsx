import { Separator } from "@/components/ui/separator";
import CSVFileForm from "@/components/custom/csvFileForm";
import EmailForm from "@/components/custom/emailForm";

export default function Home() {
  return (
    <div className="grid grid-rows-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-3 items-center w-full max-w-[350px]">
        <p className="mb-3">Submit/Drag and drop a .csv file</p>
        
        <CSVFileForm />

        <div className="flex h-5 items-center justify-center space-x-4 text-sm">
          <Separator className="w-24 bg-white/80" />
          <div>Or</div>
          <Separator className="w-24 bg-white/80" />
        </div>

        <EmailForm />
      </main>
    </div>
  );
}
