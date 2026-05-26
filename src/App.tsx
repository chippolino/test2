import { Layout, Typography } from 'antd';
import { HourlyStatsChart } from '@/components/HourlyStatsChart';
import '@/components/layout/StatsPageLayout.css';

export function App() {
  return (
    <Layout style={{ minHeight: '100vh', padding: 24, overflowX: 'auto' }}>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Статистика по часам
      </Typography.Title>
      <HourlyStatsChart />
    </Layout>
  );
}
