import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components';

let root = document.getElementById('root');
if (!root) {
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

const render = component => {
  ReactDOM.render(
    <AppContainer>
      <component />
    </AppContainer>,
    root
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components', () => {
    render(App);
  });
}
