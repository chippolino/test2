import { Button, DatePicker, Form } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';

interface DateFilterFormProps {
  value: Dayjs;
  loading: boolean;
  onChange: (date: Dayjs) => void;
  onApply: (date: Dayjs) => void;
}

export function DateFilterForm({ value, loading, onChange, onApply }: DateFilterFormProps) {
  return (
    <Form
      layout="vertical"
      onFinish={() => onApply(value)}
      style={{ marginBottom: 16 }}
    >
      <Form.Item label="Дата" style={{ marginBottom: 12 }}>
        <DatePicker
          value={value}
          onChange={(date) => date && onChange(date)}
          disabledDate={(current) =>
            current ? current.endOf('day').isAfter(dayjs().endOf('day')) : false
          }
          format="YYYY-MM-DD"
          allowClear={false}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        Применить
      </Button>
    </Form>
  );
}
