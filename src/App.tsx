import React from 'react';
import './App.module.scss';

import styles from './App.module.scss';
import { Canvas, CanvasProvider } from './components/Canvas';

function App() {
  return (
    <div className={styles.wrapper}>
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    </div>
  );
}

export default App;
