import Image from "next/image";

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md sticky top-6">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {user?.name}
        </h3>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>
    </div>
  );
}
