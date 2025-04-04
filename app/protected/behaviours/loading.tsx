import { LoadingSpinner } from "@/components/loading-spinner";

export default function BehavioursLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner size={40} />
    </div>
  );
} 