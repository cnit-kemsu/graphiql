import React from 'react';
import ReactDOM from 'react-dom';
import { GraphiQL } from '../src/comps/GraphiQL';

function App() {

  console.log('render App');

  return (
    <GraphiQL url="/api" />
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);