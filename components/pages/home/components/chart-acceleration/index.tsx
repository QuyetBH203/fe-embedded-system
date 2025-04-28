'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

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
import { useEffect } from 'react';
import { queryClient } from '@/providers/react-query';
import { useQuery } from '@tanstack/react-query';
import { getMotion } from '@/services';
const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const chartConfig = {
  accel_x: {
    label: 'accel_x',
    color: '#FF5733',
  },
  accel_y: {
    label: 'accel_y',
    color: '#33FF57',
  },
  accel_z: {
    label: 'accel_z',
    color: '#3357FF',
  },
  gyro_x: {
    label: 'gyro_x',
    color: '#FF33A8',
  },
  gyro_y: {
    label: 'gyro_y',
    color: '#FFC300',
  },
  gyro_z: {
    label: 'gyro_z',
    color: '#9D33FF',
  },
} satisfies ChartConfig;

export function Chart3() {
  const { data: motionResponse, isLoading } = useQuery({
    queryKey: ['motion'],
    queryFn: getMotion,
    refetchInterval: 60000, // Refetch data mỗi phút (60000ms)
  });

  const motionResponseData = Array.isArray(motionResponse?.data)
    ? motionResponse.data
    : motionResponse?.data?.data || [];

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['motion'],
      queryFn: getMotion,
    });
  }, []);
  console.log('Heart Rate Data:', motionResponseData);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase">motion rate</CardTitle>
        <CardDescription className="uppercase">real time monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={motionResponseData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatTimestamp}
            />
            <YAxis
              yAxisId="left"
              domain={[-2, 11]}
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
              dataKey="accel_x"
              type="monotone"
              stroke={chartConfig.accel_x.color}
              strokeWidth={2}
              name="accel_x"
              yAxisId="left"
              dot={false}
            />
            <Line
              dataKey="accel_y"
              name="accel_y"
              yAxisId={'left'}
              type="monotone"
              stroke={chartConfig.accel_y.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="accel_z"
              name="accel_z"
              yAxisId={'left'}
              type="monotone"
              stroke={chartConfig.accel_z.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="gyro_x"
              name="gyro_x"
              yAxisId={'left'}
              type="monotone"
              stroke={chartConfig.gyro_x.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="gyro_y"
              name="gyro_y"
              yAxisId={'left'}
              type="monotone"
              stroke={chartConfig.gyro_y.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="gyro_z"
              name="gyro_z"
              yAxisId={'left'}
              type="monotone"
              stroke={chartConfig.gyro_z.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
