import { useState, useRef, useEffect } from 'react';
import { executeCommand } from '../api/terminal';
import './Terminal.css';

const highlightText = (text) => {
    if (!text || typeof text !== 'string') return { __html: text };

    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 1. Highlight standard messages and branches FIRST
    html = html.replace(/On branch ([A-Za-z0-9\-_]+)/g, 'On branch <span class="highlight-branch">$1</span>');
    html = html.replace(/\[([A-Za-z0-9\-_]+)\s/g, '[<span class="highlight-branch">$1</span> ');

    // 2. Highlight quoted strings SECOND
    html = html.replace(/("[^"]*")/g, '<span class="highlight-string">$1</span>');
    html = html.replace(/('[^']*')/g, '<span class="highlight-string">$1</span>');

    // 3. Highlight commit hashes LAST (so it doesn't break the HTML attributes above)
    html = html.replace(/\b([a-f0-9]{7})\b/g, '<span class="highlight-hash">$1</span>');

    return { __html: html };
};

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
            window.dispatchEvent(new Event('terminal-cleared'));
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

            window.dispatchEvent(new Event('terminal-command-executed'));
        } catch (err) {
            setEntries((prev) => [
                ...prev,
                { type: 'error', text: `Connection error: ${err.message}` },
            ]);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
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
                        {entry.type === 'output' ? (
                            <span className="terminal-text" dangerouslySetInnerHTML={highlightText(entry.text)} />
                        ) : (
                            <span className="terminal-text">{entry.text}</span>
                        )}
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
