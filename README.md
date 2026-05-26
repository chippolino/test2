# Гистограмма аномалий

React + TypeScript + Redux + D3 + Axios + Ant Design.

## Запуск

```bash
npm install
npm run dev
```

## Структура

- `src/types/stats.ts` — типы API и DTO
- `src/utils/statsMapper.ts` — дополнение часов 00–23 и метки `18-00`
- `src/components/charts/` — D3 гистограмма и линейный график
- `src/store/statsSlice.ts` — Redux state и логарифмическая шкала

## API

Ожидаемый ответ:

```json
{
  "date": "2026-05-18",
  "hourly_stats": [{ "hour": 18, "anomalous_count": 3 }],
  "total": 8
}
```

Сейчас используется mock из `src/api/statsApi.ts`. Для реального API замените `getMockHourlyStats()` на `fetchHourlyStats()` в `statsSlice.ts`.
# test2
