import { useState, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';
import CommitGraph from './components/CommitGraph';
import { resetSandbox } from './api/terminal';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const inputRef = useRef(null);

  const handleClear = () => {
    setEntries([]);
    inputRef.current?.focus();
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to completely wipe the backend memory and reset the sandbox?')) {
      try {
        await resetSandbox();
        setEntries([]);
        window.dispatchEvent(new Event('terminal-cleared'));
      } catch (err) {
        console.error("Failed to reset sandbox:", err);
      }
    }
  };

  const handleCommandClick = (cmd) => {
    if (inputRef.current) {
      // Use native setter so React picks up the change
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeSetter.call(inputRef.current, cmd);
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      inputRef.current.focus();
    }
  };

  return (
    <div className="app">
      <Header onClear={handleClear} onReset={handleReset} />
      <div className="app-body">
        <Sidebar onCommandClick={handleCommandClick} />
        <div className="main-content">
          <Terminal inputRef={inputRef} entries={entries} setEntries={setEntries} />
          <CommitGraph />
        </div>
      </div>
    </div>
  );
}

export default App;
