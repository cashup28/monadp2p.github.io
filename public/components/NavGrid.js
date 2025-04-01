export default function NavGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <button className="bg-purple-600 py-3 rounded">Orders</button>
      <button className="bg-purple-600 py-3 rounded">Create</button>
      <button className="bg-purple-600 py-3 rounded">Monad</button>
      <button className="bg-purple-600 py-3 rounded">Support</button>
    </div>
  )
}