import React from 'react';
import { DollarSign, TrendingUp, Users, PieChart } from 'lucide-react';

interface CostsSummaryProps {
  championshipId?: string;
}

const CostsSummary: React.FC<CostsSummaryProps> = () => {
  // Mock data - replace with real data from your API
  const costData = {
    totalCost: 15000,
    laborCost: 8000,
    equipmentCost: 4000,
    otherCosts: 3000,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <CostCard
          title="Costo Total"
          amount={costData.totalCost}
          icon={DollarSign}
          trend="+12%"
        />
        <CostCard
          title="Costo Laboral"
          amount={costData.laborCost}
          icon={Users}
          trend="+8%"
        />
        <CostCard
          title="Costo Equipamiento"
          amount={costData.equipmentCost}
          icon={TrendingUp}
          trend="+5%"
        />
        <CostCard
          title="Otros Costos"
          amount={costData.otherCosts}
          icon={PieChart}
          trend="+3%"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Desglose de Costos
        </h3>
        <div className="space-y-4">
          {Object.entries({
            'Costos Laborales': costData.laborCost,
            'Equipamiento': costData.equipmentCost,
            'Otros': costData.otherCosts,
          }).map(([category, amount]) => (
            <div key={category} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-500">{category}</p>
                  <span className="ml-auto text-sm font-medium text-gray-900">
                    ${amount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(amount / costData.totalCost) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CostCardProps {
  title: string;
  amount: number;
  icon: React.FC<{ className?: string }>;
  trend: string;
}

const CostCard: React.FC<CostCardProps> = ({ title, amount, icon: Icon, trend }) => (
  <div className="bg-white overflow-hidden rounded-lg shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                ${amount.toLocaleString()}
              </div>
              <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                {trend}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default CostsSummary;