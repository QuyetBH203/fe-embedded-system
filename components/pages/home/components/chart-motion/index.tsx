'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
import { useEffect } from 'react';
import { queryClient } from '@/providers/react-query';
import { getMotionCount } from '@/services';

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};
const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2A9D90',
  },
} satisfies ChartConfig;

export function Chart4() {
  const { data: motionCountResponse, isLoading } = useQuery({
    queryKey: ['motion_count'],
    queryFn: getMotionCount,
    refetchInterval: 60000, // Refetch data mỗi phút (60000ms)
  });

  const motionCountResponseData = Array.isArray(motionCountResponse?.data)
    ? motionCountResponse.data
    : motionCountResponse?.data?.data || [];

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['motion_count'],
      queryFn: getMotionCount,
    });
  }, []);
  console.log('Heart Rate Data:', motionCountResponseData);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase">Motion count tracking</CardTitle>
        <CardDescription className="uppercase">Real time monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={motionCountResponseData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatTimestamp}
            />
            {/* <YAxis
              yAxisId="left"
              domain={[1, 3]}
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            /> */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="motion_count" fill="var(--color-desktop)" radius={8} yAxisId="left" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Real time monitoring <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total metrics data</div>
      </CardFooter>
    </Card>
  );
}
