import { useEffect, useCallback } from 'react';
import { useStatsStore } from '@/stores/statsStore';
import { useSessionStore } from '@/stores/sessionStore';
import Layout from '../components/Layout';
import StatCard from '../components/dashboard/StatCard';
import ChartsSection from '../components/dashboard/ChartsSection';
import RecentActivity from '../components/dashboard/RecentActivity';
import { 
  Camera, 
  Users, 
  Activity, 
  Image as ImageIcon,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function DashboardPage() {
  const {
    systemStats,
    realtimeStats,
    sessionsChartData,
    utilizationData,
    loading,
    error,
    fetchSystemStats,
    fetchRealtimeStats,
    fetchSessionsChartData,
    fetchUtilizationData,
    cleanupExpiredSessions,
    clearError
  } = useStatsStore();

  const {
    sessions,
    fetchSessions
  } = useSessionStore();

  const loadDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        fetchSystemStats(),
        fetchRealtimeStats(),
        fetchSessionsChartData(7),
        fetchUtilizationData(),
        fetchSessions({ limit: 10, page: 1 })
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }, [fetchSystemStats, fetchRealtimeStats, fetchSessionsChartData, fetchUtilizationData, fetchSessions]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleRefresh = () => {
    loadDashboardData();
    toast.success('Dashboard refreshed');
  };

  const handleCleanup = async () => {
    try {
      const cleanedCount = await cleanupExpiredSessions();
      toast.success(`Cleaned up ${cleanedCount} expired sessions`);
      loadDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to cleanup expired sessions');
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-600">
                  Overview of your PhotoBooth system
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCleanup}
                  disabled={loading}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Cleanup Expired
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard
              title="Total Photobooths"
              value={systemStats?.photobooths.total || 0}
              icon={Camera}
              color="info"
              subtitle={`${systemStats?.photobooths.available || 0} available`}
            />
            <StatCard
              title="Active Sessions"
              value={systemStats?.sessions.active || 0}
              icon={Activity}
              color="warning"
              subtitle={`${systemStats?.sessions.completed || 0} completed today`}
            />
            <StatCard
              title="Total Photos"
              value={systemStats?.photos.total || 0}
              icon={ImageIcon}
              color="success"
              subtitle={`${systemStats?.photos.processed || 0} processed`}
            />
            <StatCard
              title="System Uptime"
              value={realtimeStats?.systemUptime ? `${Math.floor(realtimeStats.systemUptime / 3600)}h` : '0h'}
              icon={Users}
              color="default"
              subtitle={realtimeStats?.lastUpdated ? `Updated ${new Date(realtimeStats.lastUpdated).toLocaleTimeString()}` : ''}
            />
          </div>

          {/* Charts Section */}
          <div className="mb-6">
            <ChartsSection
              sessionsChartData={sessionsChartData}
              utilizationData={utilizationData}
              loading={loading}
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity
                sessions={sessions}
                loading={loading}
              />
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available Photobooths</span>
                    <span className="text-sm font-medium">{systemStats?.photobooths.available || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Busy Photobooths</span>
                    <span className="text-sm font-medium">{systemStats?.photobooths.busy || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Maintenance</span>
                    <span className="text-sm font-medium">{systemStats?.photobooths.maintenance || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Offline</span>
                    <span className="text-sm font-medium">{systemStats?.photobooths.offline || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Session Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-medium">{systemStats?.sessions.pending || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="text-sm font-medium">{systemStats?.sessions.active || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-medium">{systemStats?.sessions.completed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cancelled</span>
                    <span className="text-sm font-medium">{systemStats?.sessions.cancelled || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;