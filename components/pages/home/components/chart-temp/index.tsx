'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
import { useQuery } from '@tanstack/react-query';
import { getTemp } from '@/services';
import { useEffect } from 'react';
import { queryClient } from '@/providers/react-query';

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const chartConfig = {
  desktop: {
    label: 'temp',
    color: '#A8C1F7',
  },
} satisfies ChartConfig;

export function Chart2() {
  const { data: temperatureResponse, isLoading } = useQuery({
    queryKey: ['temperature'],
    queryFn: getTemp,
    refetchInterval: 5000,
  });
  const tempRateData = Array.isArray(temperatureResponse?.data)
    ? temperatureResponse.data
    : temperatureResponse?.data?.data || [];

  // Đảm bảo có dữ liệu ban đầu khi component được mount
  useEffect(() => {
    // Prefetch dữ liệu khi component được mount
    queryClient.prefetchQuery({
      queryKey: ['temperature'],
      queryFn: getTemp,
    });
  }, []);
  console.log('Temp Rate Data:', tempRateData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>TEMPERATURE</CardTitle>
        <CardDescription>REAL TIME MONITORING</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={tempRateData}
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
              domain={[0, 40]}
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="temp"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              yAxisId="left"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Latest temperature : {tempRateData[0]?.temp}°C
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
