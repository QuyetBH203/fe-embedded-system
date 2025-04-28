'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryClient } from '@/providers/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { getHearRate } from '@/services';
import { IHeartRate } from '@/types/device';

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const chartConfig = {
  heart: {
    label: 'heart',
    color: '#FF5555',
  },
  spo2: {
    label: 'spo2',
    color: '#2563EB',
  },
} satisfies ChartConfig;

export function Chart1() {
  // Sử dụng TanStack Query để fetch dữ liệu
  const { data: heartRateResponse, isLoading } = useQuery({
    queryKey: ['heartRate'],
    queryFn: getHearRate,
    refetchInterval: 60000, // Refetch data mỗi phút (60000ms)
  });

  // Extract the array from the response
  const heartRateData = Array.isArray(heartRateResponse?.data)
    ? heartRateResponse.data
    : heartRateResponse?.data?.data || [];

  // Đảm bảo có dữ liệu ban đầu khi component được mount
  useEffect(() => {
    // Prefetch dữ liệu khi component được mount
    queryClient.prefetchQuery({
      queryKey: ['heartRate'],
      queryFn: getHearRate,
    });
  }, []);
  console.log('Heart Rate Data:', heartRateData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SPO2 AND HEART RATE</CardTitle>
        <CardDescription className="uppercase">Real-time monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">Loading...</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={heartRateData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
              height={300}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatTimestamp}
              />
              <YAxis
                yAxisId="left"
                domain={[0, 200]}
                orientation="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  chartConfig[name as keyof typeof chartConfig].label,
                ]}
                labelFormatter={formatTimestamp}
              />
              <Line
                dataKey="heart"
                type="monotone"
                stroke={chartConfig.heart.color}
                strokeWidth={2}
                dot={true}
                yAxisId="left"
                name="heart"
              />
              <Line
                dataKey="spo2"
                type="monotone"
                stroke={chartConfig.spo2.color}
                strokeWidth={2}
                dot={true}
                yAxisId="left"
                name="spo2"
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {heartRateData && heartRateData.length > 0 ? (
                <>
                  Latest Heart Rate: {heartRateData[heartRateData.length - 1].heart} BPM
                  <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                'No data available'
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {heartRateData && heartRateData.length > 0 ? (
                <>Latest SpO2: {heartRateData[heartRateData.length - 1].spo2}%</>
              ) : (
                'No data available'
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
