const activities = [
  {
    id: "1",
    text: "Project created",
    time: "28 Jan 2026 • 10:00 AM",
  },
  {
    id: "2",
    text: "Attendance module completed",
    time: "29 Jan 2026 • 04:30 PM",
  },
  {
    id: "3",
    text: "New member added to project",
    time: "30 Jan 2026 • 11:15 AM",
  },
];

export default function ProjectActivity() {
  return (
    <div className="bg-base-100 border border-base-300 rounded-lg p-6">
      <h3 className="font-semibold text-base-content mb-4">
        Activity Timeline
      </h3>

      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-primary" />

            <div>
              <p className="text-sm text-base-content">
                {activity.text}
              </p>
              <p className="text-xs text-base-content/60">
                {activity.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
