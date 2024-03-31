import { useState } from 'react';

import reactLogo from '../assets/react.svg';
import '../css/app.css';

function Index() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div>
        <a href="https://github.com/refastdev/refast" target="_blank">
          <img src={reactLogo} className="logo" alt="Refast logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Refast + React</h1>
      <div className="card-index">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/pages/index.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default Index;
