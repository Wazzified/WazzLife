import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
}
