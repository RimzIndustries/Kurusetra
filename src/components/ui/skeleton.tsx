import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-neuro-bg shadow-neuro-flat",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
