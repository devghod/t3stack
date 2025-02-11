'use client'

import { LineChart } from "@mantine/charts";
import { 
  Card, 
  Text, 
  Paper, 
  Stack, 
  ActionIcon, 
  Flex, 
  Tooltip, 
  Box, 
  LoadingOverlay,
  Alert
} from "@mantine/core";
import { IconRefresh, IconAlertCircle } from "@tabler/icons-react";
import { useUserStore } from "@/stores/userStore";
import { memo, useEffect, useMemo, useCallback } from "react";
import classes from '@/components/statistics/statistics.module.css';
import '@mantine/charts/styles.css';

interface ChartData {
  date: string;
  Credentials: number;
  Google: number;
  Github: number;
}

const chartConfig = {
  height: 200,
  series: [
    { name: 'Credentials', color: 'green.6' },
    { name: 'Google', color: 'blue.6' },
    { name: 'Github', color: 'pink.6' },
  ],
  legendProps: { 
    verticalAlign: 'bottom' as const,
    height: 30,
  }
};

function AccountChartByRegisterType() {
  const { 
    report, 
    getReports, 
    loadingReport, 
    loading,
    errorReport
  } = useUserStore();

  useEffect(() => {
    getReports();
  }, [getReports]);

  const handleRefresh = useCallback(() => {
    getReports();
  }, [getReports]);

  const data = useMemo<ChartData[]>(() => report.map((item) => ({
    date: item.date,
    Credentials: item.Credentials,
    Google: item.Google,
    Github: item.Github,
  })), [report]);

  if (errorReport) {
    return (
      <Alert 
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
      >
        <Stack>
          {errorReport}
          <Tooltip label="Refresh Report">
            <ActionIcon 
              variant="filled" 
              color="grape"
              onClick={handleRefresh}
              disabled={loading}
              loading={loadingReport}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>
        </Stack>
      </Alert>
    );
  }

  return (
    <Card 
      withBorder 
      radius="md" 
      p="lg" 
      shadow="none" 
      h={350}
    >
      <Stack gap="md">
        <Flex justify="space-between" align="center">
          <Flex gap="xs" direction="column">
            <Text size='md' fw={700}>
              Account Chart by Register Type
            </Text>
            <Text size='xs' c="dimmed" fw={400}>
              Report for the last 5 months
            </Text>
          </Flex>

          <Tooltip label="Refresh Report">
            <ActionIcon 
              variant="filled" 
              color="grape"
              onClick={handleRefresh}
              disabled={loading}
              loading={loadingReport}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>
        </Flex>

        <Box pos="relative">
          <LoadingOverlay
            visible={loadingReport}
            loaderProps={{ 
              type: 'bars', 
              color: 'indigo', 
              size: 'sm' 
            }}
          />

          <Paper 
            withBorder 
            radius="md" 
            p="lg"
          >
            <LineChart
              h={chartConfig.height}
              data={data}
              dataKey="date"
              withLegend
              legendProps={chartConfig.legendProps}
              classNames={{
                legend: classes.legend,
                legendItemName: classes.legendItemName
              }}
              series={chartConfig.series}
              curveType="linear"
            />
          </Paper>
        </Box>
      </Stack>
    </Card>
  );
}

export default memo(AccountChartByRegisterType);