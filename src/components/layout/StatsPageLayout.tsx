import type { ReactNode } from 'react';
import './StatsPageLayout.css';

interface StatsPageLayoutProps {
  aside: ReactNode;
  children: ReactNode;
}

export function StatsPageLayout({ aside, children }: StatsPageLayoutProps) {
  return (
    <div className="stats-page">
      <aside className="stats-aside">{aside}</aside>
      <section className="stats-chart-area">{children}</section>
    </div>
  );
}
