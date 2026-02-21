

function SalaryRow({
  label,
  amount,
}: {
  label: string;
  amount: number;
}) {
  return (
    <div className="flex justify-between text-base-content/80">
      <span>{label}</span>
      <span>₹ {amount.toLocaleString()}</span>
    </div>
  );
}

export default SalaryRow;