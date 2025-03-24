'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NotesChartProps {
  notes: Note[];
}

export function NotesChart({ notes }: NotesChartProps) {
  const chartData = notes.map(note => ({
    title: note.title,
    length: note.content?.length || 0
  }));

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Notes Content Length Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="title" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ 
                  value: 'Content Length (characters)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
              />
              <Tooltip />
              <Bar 
                dataKey="length" 
                fill="var(--primary)" 
                name="Content Length"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 