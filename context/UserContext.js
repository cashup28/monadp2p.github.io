// context/UserContext.js
import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '123456',
    wallet: 'UQabc...XYZ',
    monad: 298,
    ton: 3.2,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
