'use client';

import {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Button, ErrorText, Modal, TextField} from '@components';
import {AuthContext} from '@providers';
import {SignInValidation} from '@utils';
import {FormControl, Stack} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

export interface LogInDetails {
  username: string;
  password: string;
}

interface LogInFormProps {
  onLoginFailure: (errorMessage: string | null) => void;
}

interface LogInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogInForm = ({ onLoginFailure }: LogInFormProps) => {
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInDetails>({
    resolver: yupResolver(SignInValidation),
  });

  const handleLogin = async (formData: LogInDetails) => {
    try {
      onLoginFailure(null);
      await login(formData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred during login.';
      onLoginFailure(errorMessage);
    }
  };

  return (
    <>
      <form id='login-form' onSubmit={handleSubmit(handleLogin)}>
        <Stack direction='column' spacing={3}>
          <FormControl id='username'>
            <TextField
              label='Username'
              type='text'
              error={Boolean(errors.username)}
              helperText={errors.username?.message}
              {...register('username')}
              required
            />
          </FormControl>
          <FormControl id='password'>
            <TextField
              label='Password'
              type='password'
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register('password')}
              required
            />
          </FormControl>
        </Stack>
      </form>
    </>
  );
};

export const LogInModal = ({ isOpen, onClose }: LogInModalProps) => {
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginFailure = (errorMessage: string | null) => {
    setLoginError(errorMessage);
  };

  const handleClose = () => {
    setLoginError(null);
    onClose();
  };

  return (
    <Modal sx={{ backgroundColor: '#222222' }} open={isOpen} onClose={handleClose}>
      <div className='relative'>
        <div className='mt-4'>
          <button className='absolute top-0 right-0' onClick={handleClose}>
            <CloseIcon />
          </button>
          <Image
            src='https://image.himaa.me/hima-chan-posing.png'
            alt='Hima!'
            height='64'
            width='64'
          />
        </div>
        <h1 className='flex justify-center mb-4 mt-4 text-xl'>Login</h1>
        <LogInForm onLoginFailure={handleLoginFailure} />
        <p className='mt-3'>Forgot password?</p>
        <div className='flex flex-col justify-center mt-6 gap-3 w-full'>
          {loginError && <ErrorText>{loginError}</ErrorText>}
          <Button
            className='w-full'
            // TODO: We should probably set this in the MUI custom palette (sure but ideally not) for this Tori Pink
            // TODO: color or in our Tailwind custom class (best option).
            // TODO: We need to solve the issue of MUI default color overriding Tailwind custom class as well.
            sx={{
              color: 'black',
              backgroundColor: '#FFA5A5',
              '&:hover': {
                backgroundColor: '#cc8484',
                border: 'none',
              },
            }}
            form='login-form'
            type='submit'
          >
            Log In
          </Button>
        </div>
        <p className='mt-3'>Don&apos;t have an account yet? Register here.</p>
      </div>
    </Modal>
  );
};
