import React from 'react';

function NotFounf(props) {
  const CLIENT_ID = "87a42765a18adc939d0a";
  console.log('start aouth');
  window.location.href = "https://github.com/login/oauth/authorize?client_id="+CLIENT_ID+"&scope=user:email&redirect_uri=http://localhost:3000/login";
}
