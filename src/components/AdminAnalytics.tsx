import React from 'react';
import { format, subDays } from 'date-fns';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAdmin } from '../context/AdminContext';

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];

function AdminAnalytics() {
  const { investments, users, withdrawals } = useAdmin();

  // Tendencias de inversión
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dailyInvestments = investments.filter(inv => 
      format(inv.startDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const totalAmount = dailyInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    const visitCount = Math.floor(Math.random() * 50) + 20; // Simulado
    const conversionRate = (dailyInvestments.length / visitCount) * 100;
    
    return {
      date: format(date, 'MMM dd'),
      amount: totalAmount,
      visits: visitCount,
      conversions: dailyInvestments.length,
      conversionRate: conversionRate.toFixed(1)
    };
  }).reverse();

  // Métricas de retención
  const retentionData = users.reduce((acc, user) => {
    const monthJoined = format(user.joinDate, 'MMM yyyy');
    const hasActiveInvestment = user.activeInvestments > 0;
    const daysSinceLastActivity = Math.floor((new Date().getTime() - user.lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (!acc[monthJoined]) {
      acc[monthJoined] = { 
        total: 0, 
        active: 0,
        returning: 0 
      };
    }
    
    acc[monthJoined].total++;
    if (hasActiveInvestment) acc[monthJoined].active++;
    if (daysSinceLastActivity < 7) acc[monthJoined].returning++;
    
    return acc;
  }, {});

  const retentionChartData = Object.entries(retentionData).map(([month, data]) => ({
    month,
    retentionRate: ((data.active / data.total) * 100).toFixed(1),
    returningRate: ((data.returning / data.total) * 100).toFixed(1)
  }));

  // Análisis de comportamiento
  const investorBehavior = {
    averageInvestment: (investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) / users.length).toFixed(2),
    plansPerUser: (investments.filter(inv => inv.status === 'active').length / users.length).toFixed(1),
    averageDuration: Math.round(investments.reduce((sum, inv) => {
      const days = (inv.endDate.getTime() - inv.startDate.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0) / investments.length),
    reinvestmentRate: ((users.filter(u => u.activeInvestments > 1).length / users.length) * 100).toFixed(1)
  };

  // Estadísticas de conversión
  const conversionStats = {
    totalVisits: last30Days.reduce((sum, day) => sum + day.visits, 0),
    totalConversions: investments.length,
    conversionRate: ((investments.length / last30Days.reduce((sum, day) => sum + day.visits, 0)) * 100).toFixed(1),
    averageTicket: (investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) / investments.length).toFixed(2)
  };

  // Distribución de planes
  const planDistribution = investments.reduce((acc, inv) => {
    const planName = `Plan ${inv.planId}`;
    if (!acc[planName]) {
      acc[planName] = {
        count: 0,
        volume: 0
      };
    }
    acc[planName].count++;
    acc[planName].volume += parseFloat(inv.amount);
    return acc;
  }, {});

  const planDistributionData = Object.entries(planDistribution).map(([name, data]) => ({
    name,
    count: data.count,
    volume: data.volume,
    percentage: ((data.count / investments.length) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-6">
      {/* KPIs de Conversión */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Tasa de Conversión</h3>
          <div className="text-3xl font-bold text-primary-600">{conversionStats.conversionRate}%</div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">Visitas</span>
            <span className="font-medium">{conversionStats.totalVisits}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Conversiones</span>
            <span className="font-medium">{conversionStats.totalConversions}</span>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Ticket Promedio</h3>
          <div className="text-3xl font-bold text-success-600">{conversionStats.averageTicket} USDT</div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">Volumen Total</span>
            <span className="font-medium">
              {investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0).toFixed(2)} USDT
            </span>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Retención</h3>
          <div className="text-3xl font-bold text-purple-600">
            {((users.filter(u => u.activeInvestments > 0).length / users.length) * 100).toFixed(1)}%
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">Usuarios Activos</span>
            <span className="font-medium">{users.filter(u => u.activeInvestments > 0).length}</span>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Tasa de Reinversión</h3>
          <div className="text-3xl font-bold text-blue-600">{investorBehavior.reinvestmentRate}%</div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">Usuarios Recurrentes</span>
            <span className="font-medium">{users.filter(u => u.activeInvestments > 1).length}</span>
          </div>
        </div>
      </div>

      {/* Gráficos de Tendencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Tendencia de Conversiones</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="conversionRate" 
                  name="Tasa de Conversión (%)"
                  stroke="#10B981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Volumen de Inversiones</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="Volumen (USDT)"
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribución de Planes y Comportamiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Distribución de Planes</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {planDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {planDistributionData.map((plan, index) => (
              <div key={plan.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{plan.name}</span>
                </div>
                <span className="font-medium">{plan.volume.toFixed(2)} USDT</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Métricas de Rendimiento</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Conversión por Plan</h4>
              {planDistributionData.map((plan, index) => (
                <div key={plan.name} className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{plan.name}</span>
                    <span className="font-medium">{plan.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${plan.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Comportamiento de Usuarios</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Inversión Promedio</div>
                  <div className="text-lg font-semibold">{investorBehavior.averageInvestment} USDT</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Planes por Usuario</div>
                  <div className="text-lg font-semibold">{investorBehavior.plansPerUser}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Duración Promedio</div>
                  <div className="text-lg font-semibold">{investorBehavior.averageDuration} días</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Tasa de Retorno</div>
                  <div className="text-lg font-semibold">{investorBehavior.reinvestmentRate}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;