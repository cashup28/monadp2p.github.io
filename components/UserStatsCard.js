export default function UserStatsCard({ monad, ton }) {
  return (
    <div className="bg-[#ffffff22] rounded-lg p-4 backdrop-blur-sm">
      <h2 className="font-semibold text-lg mb-2">Wallet</h2>
      <p>{monad} MONAD</p>
      <p>{ton} TON</p>
    </div>
  )
}