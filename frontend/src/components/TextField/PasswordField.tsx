'use client';

import { useState, forwardRef, MouseEvent } from 'react';
import { TextField } from '@components/TextField/TextField';
import { InputAdornment, styled, TextFieldProps } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CustomPasswordTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    backgroundColor: '#2d2d2d',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
  },
  '& .MuiFormHelperText-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiInputAdornment-root': {
    backgroundColor: '#2d2d2d',
    padding: '28px 14px',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    margin: 0,
    '&:hover': {
      backgroundColor: '#333333',
      cursor: 'pointer',
    },
  },
  '& .MuiSvgIcon-root': {
    color: '#e5e5e5',
  },
});

export const PasswordField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const AdornmentWrapper = ({
    onMouseDown,
    onClick,
  }: {
    onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
    onClick: () => void;
  }) => (
    <div onMouseDown={onMouseDown} onClick={onClick} style={{ cursor: 'pointer' }}>
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </div>
  );

  return (
    <CustomPasswordTextField
      fullWidth
      variant='outlined'
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <AdornmentWrapper
              onMouseDown={handleMouseDownPassword}
              onClick={handleClickShowPassword}
            />
          </InputAdornment>
        ),
      }}
      ref={ref}
      {...props}
    />
  );
});

PasswordField.displayName = 'PasswordField';
