"use client";

import { PieChart } from "@mantine/charts";
import { Card, CardSection } from "@mantine/core"; 

const data = [
  { name: 'ADMIN', value: 400, color: 'indigo.6' },
  { name: 'USER', value: 300, color: 'yellow.6' },
];

export default function Page() {
  return (
    <>
      <Card 
        withBorder 
        radius="md" 
        p="xl" 
        shadow="none" 
        h={300} 
        style={{ justifyContent: 'center' }}
      >
        <CardSection>
          <PieChart
            data={data}
            size={200}
            labelsPosition="inside" 
            labelsType="percent" 
            withLabels
            strokeWidth={2}
            h={200}
            withTooltip
            tooltipDataSource="segment" 
            mx="auto"
          />
        </CardSection>
      </Card>
    </>
  );
}
