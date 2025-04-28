'use client';
import { Button } from '@/components/ui/button';
import { Chart1 } from './components/chart-heart';
import { Chart2 } from './components/chart-temp';
import { Chart3 } from './components/chart-acceleration';
import { Chart4 } from './components/chart-motion';

export default function HomePage() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full flex-grow">
      <div>
        <Chart1 />
      </div>
      <div>
        <Chart2 />
      </div>
      <div>
        <Chart3 />
      </div>
      <div>
        <Chart4 />
      </div>
    </div>
  );
}
