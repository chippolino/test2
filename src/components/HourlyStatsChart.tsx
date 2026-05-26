import { Checkbox, Spin, Tabs, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { DateFilterForm } from '@/components/DateFilterForm';
import { HistogramChart } from '@/components/charts/HistogramChart';
import { LineChart } from '@/components/charts/LineChart';
import { StatsPageLayout } from '@/components/layout/StatsPageLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DATE_FORMAT, getDateTagLabel } from '@/utils/dateUtils';
import { loadHourlyStats, setLogScale } from '@/store/statsSlice';

export function HourlyStatsChart() {
  const dispatch = useAppDispatch();
  const { data, loading, error, logScale } = useAppSelector((state) => state.stats);
  const [formDate, setFormDate] = useState(() => dayjs());

  const applyDate = (date: dayjs.Dayjs) => {
    void dispatch(loadHourlyStats(date.format(DATE_FORMAT)));
  };

  useEffect(() => {
    applyDate(dayjs());
  }, [dispatch]);

  const chartProps = data ? { data: data.hourly_stats, logScale } : null;

  const items = chartProps
    ? [
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
      ]
    : [];

  return (
    <StatsPageLayout
      aside={
        <>
          <DateFilterForm
            value={formDate}
            loading={loading}
            onChange={setFormDate}
            onApply={applyDate}
          />

          {data && (
            <Tag style={{ marginBottom: 16 }}>{getDateTagLabel(data.date)}</Tag>
          )}

          {data && (
            <>
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
          )}

          {error && (
            <Typography.Text type="danger" style={{ display: 'block', marginTop: 16 }}>
              {error}
            </Typography.Text>
          )}
        </>
      }
    >
      {loading && !data ? (
        <Spin size="large" />
      ) : (
        data && <Tabs items={items} style={{ width: '100%' }} />
      )}
    </StatsPageLayout>
  );
}
