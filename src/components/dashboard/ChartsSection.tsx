import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TimeSeriesData } from "@/types/stats";

interface ChartsSectionProps {
  sessionsChartData: TimeSeriesData[];
  utilizationData: Array<{ photoboothId: string; name: string; utilization: number }>;
  loading?: boolean;
}

function ChartsSection({ sessionsChartData, utilizationData, loading = false }: ChartsSectionProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sessions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Photobooth Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sessions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            {sessionsChartData.length > 0 ? (
              <div className="w-full">
                <div className="text-sm text-gray-500 mb-4">Last 7 days</div>
                <div className="space-y-2">
                  {sessionsChartData.slice(-7).map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{data.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(data.value / Math.max(...sessionsChartData.map(d => d.value))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{data.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Utilization Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Photobooth Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            {utilizationData.length > 0 ? (
              <div className="w-full">
                <div className="space-y-3">
                  {utilizationData.map((item) => (
                    <div key={item.photoboothId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">{item.utilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.utilization > 80 ? 'bg-green-500' :
                            item.utilization > 60 ? 'bg-yellow-500' :
                            item.utilization > 40 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChartsSection;
