import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5e0000',
    },
    secondary: {
      main: '#7b7878',
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
  <App />
  </ThemeProvider>,
  document.getElementById('root')
);
