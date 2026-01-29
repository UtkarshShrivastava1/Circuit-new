type Member = {
  id: string;
  name: string;
  role: string;
};

const members: Member[] = [
  { id: "1", name: "Alex Kumar", role: "Manager" },
  { id: "2", name: "Rahul Sharma", role: "Developer" },
  { id: "3", name: "Ankit Verma", role: "Designer" },
];

export default function ProjectMembers() {
  return (
    <div className="bg-base-100 border border-base-300 rounded-lg p-6">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-base-content">
          Team Members
        </h3>

        <button className="btn btn-sm btn-outline">
          + Add Member
        </button>
      </div>

      <ul className="divide-y divide-base-300">
        {members.map((member) => (
          <li
            key={member.id}
            className="py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-base-content">
                {member.name}
              </p>
              <p className="text-sm text-base-content/60">
                {member.role}
              </p>
            </div>

            <button className="btn btn-xs btn-error btn-outline">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
