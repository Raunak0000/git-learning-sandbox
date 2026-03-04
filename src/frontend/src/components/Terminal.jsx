import { useState, useRef, useEffect } from 'react';
import { executeCommand } from '../api/terminal';
import './Terminal.css';

export default function Terminal({ inputRef, entries, setEntries }) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [entries]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cmd = input.trim();
        if (!cmd) return;

        // Save to history
        setHistory((prev) => [cmd, ...prev]);
        setHistoryIndex(-1);

        if (cmd === 'clear') {
            setEntries([]);
            setInput('');
            return;
        }

        // Add the user's command
        setEntries((prev) => [...prev, { type: 'input', text: cmd }]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await executeCommand(cmd);
            const isError =
                result.startsWith('Fatal') ||
                result.startsWith('fatal') ||
                result.startsWith('error') ||
                result.startsWith("git: '");

            setEntries((prev) => [
                ...prev,
                { type: isError ? 'error' : 'output', text: result },
            ]);
        } catch (err) {
            setEntries((prev) => [
                ...prev,
                { type: 'error', text: `Connection error: ${err.message}` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const next = Math.min(historyIndex + 1, history.length - 1);
            setHistoryIndex(next);
            setInput(history[next]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex <= 0) {
                setHistoryIndex(-1);
                setInput('');
            } else {
                const next = historyIndex - 1;
                setHistoryIndex(next);
                setInput(history[next]);
            }
        }
    };

    return (
        <div className="terminal" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-output">
                {entries.length === 0 && (
                    <div className="terminal-welcome">
                        <span className="welcome-text">
                            Welcome to Git Sandbox. Type{' '}
                            <code>git init</code> to get started.
                        </span>
                    </div>
                )}

                {entries.map((entry, i) => (
                    <div key={i} className={`terminal-line terminal-line--${entry.type}`}>
                        {entry.type === 'input' && (
                            <span className="terminal-prompt">$ </span>
                        )}
                        <span className="terminal-text">{entry.text}</span>
                    </div>
                ))}

                {isLoading && (
                    <div className="terminal-line terminal-line--loading">
                        <span className="terminal-spinner" />
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <form className="terminal-input-row" onSubmit={handleSubmit}>
                <span className="terminal-prompt">$ </span>
                <input
                    ref={inputRef}
                    className="terminal-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a git command..."
                    autoFocus
                    disabled={isLoading}
                    spellCheck={false}
                    autoComplete="off"
                />
            </form>
        </div>
    );
}
