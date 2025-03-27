export default function GlobalStatsCard({ totalMonad, totalTon }) {
  return (
    <div className="bg-[#ffffff22] rounded-lg p-4 backdrop-blur-sm">
      <h2 className="font-semibold text-lg mb-2">Totals</h2>
      <p>{totalMonad} MONAD</p>
      <p>{totalTon} TON</p>
    </div>
  )
}