import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  classname?: string;
}

export default function Badge({ children, classname }: BadgeProps) {
  return (
    <span className={cn("w-fit bg-primary px-2 py-1 text-xs text-primary-foreground", classname)}>
      {children}
    </span>
  );
}
