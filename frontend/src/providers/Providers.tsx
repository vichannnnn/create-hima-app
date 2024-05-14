'use client';

import {ReactNode} from 'react';
import {AuthProvider, MediaQueryProvider} from '@providers';
import {createTheme, ThemeProvider} from '@mui/material';

export const customMuiTheme = {
  palette: {
    text: {
      primary: '#949494',
    },
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          color: '#9c9c9c',
          textTransform: 'none',
          fontFamily: '"Poppins", sans-serif',
          '&.Mui-selected': {
            color: '#FFA5A5',
          },
          '&:hover': {
            backgroundColor: '#2d2d2d',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#FFA5A5',
          height: '4px',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          cursor: 'pointer',
          ':hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#aed1ca',
            border: 'none',
          },
          '&:focus': {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#2d2d2d',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { fontFamily: '"Poppins", sans-serif' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontFamily: '"Poppins", sans-serif' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontFamily: '"Poppins", sans-serif' },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: { fontFamily: '"Poppins", sans-serif' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { fontSize: '18px' },
      },
    },
  },
};

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const muiTheme = createTheme(customMuiTheme);

  return (
    <ThemeProvider theme={muiTheme}>
      <MediaQueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </MediaQueryProvider>
    </ThemeProvider>
  );
}
