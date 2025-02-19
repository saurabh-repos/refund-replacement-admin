import { useState, useEffect } from 'react';

export const useAccount = () => {
  const [account, setAccount] = useState({
    displayName: '',
    email: '',
    photoURL: '/assets/eurekaforbes-icon.png',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAccount({
        displayName: user.username,
        email: user.email,
        photoURL: '/assets/eurekaforbes-icon.png',
      });
    }
  }, []);

  return account;
};
