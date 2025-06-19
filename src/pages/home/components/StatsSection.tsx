
import { Stats } from "../types";

interface StatsSectionProps {
  stats: Stats;
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const statsDisplay = [
    { label: "Students", value: stats.totalUsers.toString() },
    { label: "Active Listings", value: stats.activeListings.toString() },
    { label: "Donations", value: stats.totalDonations.toString() },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Bazaar Stats</h2>
        <div className="grid grid-cols-3 gap-8">
          {statsDisplay.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
