import React from "react";

interface Stat {
  value: number;
  label: string;
}

const SatisfactionStats: React.FC = () => {
  const stats: Stat[] = [
    { value: 1000, label: "Puas" },
    { value: 29, label: "Kurang Puas" },
    { value: 10, label: "Tidak Puas" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 text-center rounded-md shadow-md"
        >
          <p className="text-4xl font-bold">{stat.value}</p>
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default SatisfactionStats;
