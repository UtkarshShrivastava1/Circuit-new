import type { Member } from "@/type/member";

interface SingleBirthdayCardProps {
  employee: Member;
}

const SingleBirthdayCard = ({ employee }: SingleBirthdayCardProps) => {
  return (
    <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-50">
      
      <div className="w-16 h-16 rounded-full bg-indigo-100 
                      flex items-center justify-center 
                      text-indigo-600 text-xl font-semibold">
        {employee.name.charAt(0)}
      </div>

      <div>
        <h3 className="font-semibold text-gray-800">
          {employee.name}
        </h3>

        <p className="text-sm text-gray-500 capitalize">
          {employee.role}
        </p>

        <p className="text-sm font-medium text-indigo-600 mt-1">
          🎉 Birthday Today
        </p>
      </div>

      <button className="ml-auto bg-indigo-600 hover:bg-indigo-700 
                         text-white px-4 py-2 rounded-lg text-sm 
                         transition hover:shadow-md">
        Send Wishes
      </button>
    </div>
  );
};

export default SingleBirthdayCard;