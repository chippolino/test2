import { Checkbox, Spin, Tabs, Typography } from 'antd';
import { useEffect } from 'react';
import { HistogramChart } from '@/components/charts/HistogramChart';
import { LineChart } from '@/components/charts/LineChart';
import { StatsPageLayout } from '@/components/layout/StatsPageLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadHourlyStats, setLogScale } from '@/store/statsSlice';

export function HourlyStatsChart() {
  const dispatch = useAppDispatch();
  const { data, loading, error, logScale } = useAppSelector((state) => state.stats);

  useEffect(() => {
    void dispatch(loadHourlyStats());
  }, [dispatch]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Typography.Text type="danger">{error}</Typography.Text>;
  }

  if (!data) {
    return null;
  }

  const chartProps = { data: data.hourly_stats, logScale };

  const items = [
    {
      key: 'histogram',
      label: 'Гистограмма',
      children: <HistogramChart {...chartProps} />,
    },
    {
      key: 'line',
      label: 'Линейный график',
      children: <LineChart {...chartProps} />,
    },
  ];

  return (
    <StatsPageLayout
      aside={
        <>
          <Typography.Title level={4} style={{ marginTop: 0 }}>
            Аномалии за {data.date}
          </Typography.Title>
          <Typography.Text type="secondary">Всего: {data.total}</Typography.Text>

          <div style={{ marginTop: 24 }}>
            <Checkbox
              checked={logScale}
              onChange={(e) => dispatch(setLogScale(e.target.checked))}
            >
              Логарифмическая шкала
            </Checkbox>
          </div>
        </>
      }
    >
      <Tabs items={items} style={{ width: '100%' }} />
    </StatsPageLayout>
  );
}
