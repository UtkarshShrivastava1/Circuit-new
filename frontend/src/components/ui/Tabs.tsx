interface TabItem<T extends string> {
  key: T;
  label: string;
}

interface TabsProps<T extends string> {
  value: T;
  onChange: (tab: T) => void;
  tabs: TabItem<T>[];
}

export default function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: TabsProps<T>) {
  return (
    <div className="tabs tabs-boxed bg-base-200 w-fit mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab ${value === tab.key ? "tab-active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
