interface Props {
  count: number;
  loading: boolean;
}

export function ResultCounter({ count, loading }: Props) {
  return (
    <div className="result-counter">
      <span className="count">{loading ? "…" : count}</span>
      <span className="label">results</span>
      <span className="by">by OMD-123</span>
    </div>
  );
}