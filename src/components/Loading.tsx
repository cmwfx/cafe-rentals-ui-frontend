
import MainLayout from "@/layouts/MainLayout";

const Loading = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cafe-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Loading;
