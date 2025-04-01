export default function OpenOrders() {
  return (
    <div className="bg-[#ffffff22] rounded-lg p-4 backdrop-blur-sm my-6">
      <h3 className="font-semibold text-lg mb-4">Open Orders</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center bg-black bg-opacity-30 p-2 rounded">
          <span>5 TON → 40 MONAD</span>
          <div className="space-x-2">
            <button className="text-red-400">İptal Et</button>
            <button className="text-blue-400">Düzenle</button>
          </div>
        </div>
      </div>
    </div>
  )
}