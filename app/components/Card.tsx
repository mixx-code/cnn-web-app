// components/Card.tsx
import React from "react";
import Link from "next/link"; // Import Link from next/link

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
  link: string;
}

const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  value,
  link,
}) => {
  return (
    <Link href={link} passHref>
      <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="text-xl">{icon}</div>
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p>{description}</p>
            <p className="text-2xl">{value}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
