/* eslint-disable react/prop-types */
import { useState } from "react";

const DashboardCard = ({
  title,
  value,
  icon,
  isBlurred = false,
  onClick,
  color = "blue",
}) => {
  const [isVisible, setIsVisible] = useState(!isBlurred);

  const handleClick = () => {
    if (isBlurred) {
      setIsVisible(true);
      if (onClick) onClick();
    }
  };

  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    orange: "bg-orange-500 text-white",
    red: "bg-red-500 text-white",
  };

  return (
    <div
      className={`rounded-lg shadow-md p-6 ${colorClasses[color]} cursor-pointer transition-all duration-300 hover:shadow-lg`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p
            className={`text-2xl font-bold ${
              isBlurred && !isVisible ? "blur-sm" : ""
            }`}
          >
            {isBlurred && !isVisible ? "••••••" : value}
          </p>
          {isBlurred && !isVisible && (
            <p className="text-xs mt-1 text-white text-opacity-80">
              Click to view
            </p>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
