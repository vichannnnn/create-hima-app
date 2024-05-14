'use client';

import {useContext} from 'react';
import {AuthContext} from '@providers';
import {LogInButton} from "@components/Header/Button/LoginButton";
import {UserButton} from './UserButton';

export const HeaderButton = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {!user && <LogInButton user={user} />}
      {user && <UserButton user={user} logout={logout} />}
    </>
  );
};
