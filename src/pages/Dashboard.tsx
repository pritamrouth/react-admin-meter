
import React from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  PieChart as PieChartIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Pie,
  PieChart
} from "recharts";

const visitorData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 200 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 500 },
  { name: 'Jul', value: 600 }
];

const incomeData = [
  { name: 'Mon', value: 1200 },
  { name: 'Tue', value: 900 },
  { name: 'Wed', value: 1600 },
  { name: 'Thu', value: 1000 },
  { name: 'Fri', value: 1400 },
  { name: 'Sat', value: 1700 },
  { name: 'Sun', value: 1300 }
];

const salesData = [
  { name: 'Jan', products: 4000, services: 2400 },
  { name: 'Feb', products: 3000, services: 1398 },
  { name: 'Mar', products: 2000, services: 9800 },
  { name: 'Apr', products: 2780, services: 3908 },
  { name: 'May', products: 1890, services: 4800 },
  { name: 'Jun', products: 2390, services: 3800 }
];

const analyticsData = [
  { name: 'Jun', value: 250 },
  { name: 'Jul', value: 90 },
  { name: 'Aug', value: 300 },
  { name: 'Sep', value: 200 },
  { name: 'Oct', value: 280 },
  { name: 'Nov', value: 100 },
  { name: 'Dec', value: 200 }
];

const ordersData = [
  { id: '84564564', product: 'Camera Lens', quantity: 40, status: 'rejected', amount: 40570 },
  { id: '84564565', product: 'Laptop', quantity: 300, status: 'pending', amount: 180139 },
  { id: '84564566', product: 'Mobile', quantity: 355, status: 'approved', amount: 180139 },
  { id: '84564567', product: 'Tablet', quantity: 50, status: 'approved', amount: 25000 },
  { id: '84564568', product: 'Headphones', quantity: 125, status: 'pending', amount: 12500 }
];

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'rejected':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
      {getStatusIcon()}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Dashboard = () => {
  return (
    <SidebarLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Dashboard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="stat-card">
          <h6 className="stat-card-title">Total Page Views</h6>
          <div className="stat-card-value">
            442,236
            <span className="stat-card-badge bg-blue-100 text-blue-800 border border-blue-200">
              <TrendingUp className="w-3 h-3" />
              59.3%
            </span>
          </div>
          <p className="stat-card-footer">
            You made an extra <span className="text-blue-700">35,000</span> this year
          </p>
        </Card>
        
        <Card className="stat-card">
          <h6 className="stat-card-title">Total Users</h6>
          <div className="stat-card-value">
            78,250
            <span className="stat-card-badge bg-green-100 text-green-800 border border-green-200">
              <TrendingUp className="w-3 h-3" />
              70.5%
            </span>
          </div>
          <p className="stat-card-footer">
            You made an extra <span className="text-green-700">8,900</span> this year
          </p>
        </Card>
        
        <Card className="stat-card">
          <h6 className="stat-card-title">Total Orders</h6>
          <div className="stat-card-value">
            18,800
            <span className="stat-card-badge bg-yellow-100 text-yellow-800 border border-yellow-200">
              <TrendingDown className="w-3 h-3" />
              27.4%
            </span>
          </div>
          <p className="stat-card-footer">
            You made an extra <span className="text-yellow-700">1,943</span> this year
          </p>
        </Card>
        
        <Card className="stat-card">
          <h6 className="stat-card-title">Total Sales</h6>
          <div className="stat-card-value">
            $35,078
            <span className="stat-card-badge bg-red-100 text-red-800 border border-red-200">
              <TrendingDown className="w-3 h-3" />
              27.4%
            </span>
          </div>
          <p className="stat-card-footer">
            You made an extra <span className="text-red-700">$20,395</span> this year
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-lg font-semibold">Unique Visitors</h5>
            <Tabs defaultValue="week">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Card className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={visitorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
        
        <div>
          <h5 className="text-lg font-semibold mb-4">Income Overview</h5>
          <Card className="p-4">
            <h6 className="text-sm font-medium text-gray-500 mb-2">This Week Statistics</h6>
            <h3 className="text-2xl font-bold mb-4">$7,650</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={incomeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <h5 className="text-lg font-semibold mb-4">Recent Orders</h5>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">TRACKING NO.</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">PRODUCT NAME</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">QUANTITY</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">STATUS</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ordersData.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <a href="#" className="text-blue-600 hover:underline">{order.id}</a>
                      </td>
                      <td className="px-4 py-3">{order.product}</td>
                      <td className="px-4 py-3">{order.quantity}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">${order.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div>
          <h5 className="text-lg font-semibold mb-4">Analytics Report</h5>
          <Card>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between py-2">
                <span>Company Finance Growth</span>
                <span className="font-semibold text-green-600">+45.14%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Company Expenses Ratio</span>
                <span className="font-semibold">0.58%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Business Risk Cases</span>
                <span className="font-semibold text-green-600">Low</span>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Line 
                    type="natural" 
                    dataKey="value" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: "#f59e0b", stroke: "white", strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h5 className="text-lg font-semibold mb-4">Sales Report</h5>
          <Card className="p-4">
            <h6 className="text-sm font-medium text-gray-500 mb-2">This Week Statistics</h6>
            <h3 className="text-2xl font-bold mb-4">$7,650</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="products" fill="#8884d8" />
                <Bar dataKey="services" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        
        <div>
          <h5 className="text-lg font-semibold mb-4">Transaction History</h5>
          <Card>
            <div className="divide-y">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h6 className="font-medium">Order #002434</h6>
                    <p className="text-xs text-gray-500">Today, 2:00 AM</p>
                  </div>
                  <div className="text-right">
                    <h6 className="font-medium text-green-600">+ $1,430</h6>
                    <p className="text-xs text-gray-500">78%</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                    <PieChartIcon className="w-5 h-5" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h6 className="font-medium">Order #984947</h6>
                    <p className="text-xs text-gray-500">5 August, 1:45 PM</p>
                  </div>
                  <div className="text-right">
                    <h6 className="font-medium text-red-600">- $302</h6>
                    <p className="text-xs text-gray-500">8%</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h6 className="font-medium">Order #988784</h6>
                    <p className="text-xs text-gray-500">7 hours ago</p>
                  </div>
                  <div className="text-right">
                    <h6 className="font-medium text-red-600">- $682</h6>
                    <p className="text-xs text-gray-500">16%</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
