/* components/UserWithdrawList.js */
import { useEffect, useState } from 'react';

const UserWithdrawList = ({ userId }) => {
  const [withdraws, setWithdraws] = useState([]);

  useEffect(() => {
    fetch('/data/withdraws.json')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((w) => w.userId === userId);
        setWithdraws(filtered);
      });
  }, [userId]);

  return (
    <div className="mt-4 space-y-2">
      {withdraws.map((w) => (
        <div key={w.id} className="bg-gray-900 p-3 rounded">
          <p>Miktar: {w.amount}</p>
          <p>Durum: {w.status}</p>
          <p>ID: {w.id}</p>
        </div>
      ))}
    </div>
  );
};

export default UserWithdrawList;