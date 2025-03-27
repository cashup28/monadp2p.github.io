export default function WithdrawBox() {
  return (
    <div className="bg-[#ffffff22] rounded-lg p-4 backdrop-blur-sm">
      <h3 className="font-semibold text-lg mb-2">Withdraw</h3>
      <p>TON: Bağlı cüzdana ya da adres girilerek gönderilecek</p>
      <p>MONAD: EVM adres istenecek → testnet transfer</p>
    </div>
  )
}