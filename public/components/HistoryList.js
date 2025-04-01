export default function HistoryList() {
  return (
    <div className="bg-[#ffffff22] rounded-lg p-4 backdrop-blur-sm mb-10">
      <h3 className="font-semibold text-lg mb-4">History</h3>
      <div className="text-sm space-y-2">
        <div className="bg-black bg-opacity-30 p-2 rounded">
          <p><b>Deposit</b> – 20 MONAD – Başarılı – ID: TX8347</p>
        </div>
        <div className="bg-black bg-opacity-30 p-2 rounded">
          <p><b>Withdraw</b> – 5 TON – Bekliyor – ID: TX8348</p>
        </div>
      </div>
    </div>
  )
}