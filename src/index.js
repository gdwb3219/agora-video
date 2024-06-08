import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AgoraRTCProvider } from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const root = ReactDOM.createRoot(document.getElementById('root'));
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8"});

root.render(
  <React.StrictMode>
    <AgoraRTCProvider client={client}>
      <App />
    </AgoraRTCProvider>
  </React.StrictMode>
);

