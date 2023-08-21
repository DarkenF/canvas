import React, {useRef} from 'react';
import './App.module.scss';

import styles from './App.module.scss'
import {Canvas} from "./components/Canvas";

function App() {
	const ref = useRef<HTMLTextAreaElement | null>(null);


  return (
    <div className={styles.wrapper}>
	    <Canvas />
    </div>
  );
}

export default App;
