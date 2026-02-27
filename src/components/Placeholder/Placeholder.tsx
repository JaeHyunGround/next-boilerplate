export default function Placeholder({
  text = 'Placeholder',
}: {
  text?: string;
}) {
  return (
    <div className="flex items-center justify-center rounded-md border border-dashed border-gray-300 p-8">
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
}
