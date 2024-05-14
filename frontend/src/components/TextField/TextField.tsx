'use client';

import { forwardRef } from 'react';
import { TextField as TextFieldBase, TextFieldProps, styled } from '@mui/material';

const CustomTextFieldStyled = styled(TextFieldBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
  },

  '& label': {
    color: '#949494',
  },

  '& label.Mui-focused': {
    color: '#949494',
  },

  '& .MuiOutlinedInput-root': {
    borderColor: '#333333',
    borderRadius: '8px',
    paddingRight: 0,

    '&.Mui-focused fieldset': {
      color: '#949494',
      borderColor: '#ffffff',
      borderWidth: '1px',
    },

    '&:hover fieldset': {
      color: '#949494',
      borderColor: '#444444',
      borderWidth: '1px',
    },

    '& .MuiOutlinedInput-notchedOutline': {
      backgroundColor: 'transparent',
    },
  },

  '&.Mui-focused .MuiOutlinedInput-root.Mui-error fieldset': {
    borderColor: theme.palette.error.main,
  },

  '&.Mui-focused .MuiFormLabel-root.Mui-error': {
    color: theme.palette.error.main,
  },

  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.error.main,
  },

  '& .MuiFormLabel-root.Mui-error': {
    color: theme.palette.error.main,
  },
}));

const CustomTextField = forwardRef((props: TextFieldProps, ref) => {
  return <CustomTextFieldStyled {...props} inputRef={ref} />;
});

CustomTextField.displayName = 'CustomTextField';

export const TextField = forwardRef((props: TextFieldProps, ref) => {
  return <CustomTextField fullWidth variant='outlined' {...props} ref={ref} />;
});

TextField.displayName = 'TextField';
