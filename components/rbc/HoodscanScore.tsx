interface Props {
  score: number;
}

export function HoodscanScore({ score }: Props) {
  let color = 'text-green-400 bg-green-400/10 border-green-400/20';
  if (score < 50) color = 'text-red-400 bg-red-400/10 border-red-400/20';
  else if (score < 70) color = 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';

  return (
    <div className={`inline-flex items-center justify-center px-2 py-1 rounded border text-xs font-bold ${color}`}>
      {score}
    </div>
  );
}
