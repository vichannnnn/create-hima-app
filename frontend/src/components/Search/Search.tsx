'use client';

import { TextField as TextFieldBase, TextFieldProps, styled, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const TextField = styled(TextFieldBase)(() => ({
  '& .MuiInputBase-input': {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  '& .MuiOutlinedInput-root': {
    borderColor: '#333333',
    borderRadius: '8px',
    paddingRight: 0,

    '&:hover fieldset': {
      borderColor: '#444444',
      borderWidth: '1px',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffff',
      borderWidth: '1px',
    },
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
}));

export const Search = ({ ...props }: TextFieldProps) => {
  return (
    <TextField
      fullWidth
      variant='outlined'
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};
