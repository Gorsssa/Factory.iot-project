import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ThermometerIcon, Waves, Factory, Activity } from 'lucide-react';
import { sensorStore, type SensorData } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function App() {
  const [data, setData] = useState<SensorData[]>([]);
  const [isHighTemp, setIsHighTemp] = useState(false);

  useEffect(() => {
    const unsubscribe = sensorStore.subscribe(() => {
      const newData = sensorStore.getData();
      setData(newData);
      
      // Check temperature and show alert
      const currentTemp = newData[newData.length - 1]?.temperature;
      const wasHighTemp = isHighTemp;
      const newIsHighTemp = currentTemp >= 40;
      
      setIsHighTemp(newIsHighTemp);
      
      if (newIsHighTemp && !wasHighTemp) {
        toast.warning(
          "Temperature Alert!", 
          {
            description: `Temperature has reached ${currentTemp.toFixed(1)}°C - It's too hot outside, please be careful!`,
            duration: Infinity,
            id: `temp-alert-${Date.now()}`, // Unique ID for each toast
          }
        );
      }
    });
    setData(sensorStore.getData());
    return unsubscribe;
  }, [isHighTemp]);

  const currentTemp = data[data.length - 1]?.temperature.toFixed(1) || '0.0';
  const currentHumidity = data[data.length - 1]?.humidity.toFixed(1) || '0.0';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground">
      {/* Rest of the component remains the same */}
      <div className="fixed left-0 top-0 h-full w-16 bg-[#111111] border-r border-[#222222] flex flex-col items-center py-4 gap-4">
        <Factory className="w-8 h-8 text-[#666666]" />
        <div className="w-8 h-[1px] bg-[#222222] my-2" />
        <Activity className="w-6 h-6 text-[#666666]" />
      </div>

      <div className="pl-16">
        <div className="p-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                FactoryIOT Monitor
              </h1>
              <p className="text-[#666666] mt-2">Real-time environmental monitoring system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className={cn(
                "bg-[#111111] border-[#222222] hover:bg-[#151515] transition-all duration-500",
                isHighTemp && "animate-pulse border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-gradient-to-br from-[#1a1111] to-[#111111]"
              )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={cn(
                    "text-sm font-medium text-[#888888]",
                    isHighTemp && "text-red-400"
                  )}>Temperature</CardTitle>
                  <ThermometerIcon className={cn(
                    "h-4 w-4",
                    isHighTemp ? "text-red-500" : "text-blue-500"
                  )} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <div className={cn(
                      "text-3xl font-bold text-white",
                      isHighTemp && "text-red-400"
                    )}>{currentTemp}</div>
                    <div className="text-lg text-[#666666]">°C</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#222222] hover:bg-[#151515] transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#888888]">Humidity</CardTitle>
                  <Waves className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <div className="text-3xl font-bold text-white">{currentHumidity}</div>
                    <div className="text-lg text-[#666666]">%</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#111111] border-[#222222]">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Environmental Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                        stroke="#666666"
                      />
                      <YAxis 
                        stroke="#666666"
                        tickFormatter={(value) => `${value.toFixed(1)}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111111',
                          border: '1px solid #222222',
                          borderRadius: '6px',
                        }}
                        labelStyle={{ color: '#888888' }}
                        itemStyle={{ color: '#ffffff' }}
                      />
                      <Legend 
                        wrapperStyle={{
                          paddingTop: '20px',
                          color: '#888888'
                        }}
                      />
                      <Line 
                        name="Temperature (°C)"
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#3B82F6' }}
                      />
                      <Line 
                        name="Humidity (%)"
                        type="monotone" 
                        dataKey="humidity" 
                        stroke="#06B6D4"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#06B6D4' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;