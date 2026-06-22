import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  isInteractive?: boolean;
  isCompact?: boolean;
  isAccent?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = "", 
  isInteractive = false, 
  isCompact = false,
  isAccent = false,
  onClick
}: CardProps) {
  const baseClasses = "card";
  const interactiveClasses = isInteractive ? "card-interactive" : "";
  const compactClasses = isCompact ? "card-compact" : "";
  const accentClasses = isAccent ? "card-accent" : "";
  
  const finalClassName = `${baseClasses} ${interactiveClasses} ${compactClasses} ${accentClasses} ${className}`.trim();

  if (onClick) {
    return (
      <div className={finalClassName} onClick={onClick} role="button" tabIndex={0}>
        {children}
      </div>
    );
  }

  return (
    <div className={finalClassName}>
      {children}
    </div>
  );
}
