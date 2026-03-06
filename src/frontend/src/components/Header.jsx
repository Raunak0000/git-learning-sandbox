import './Header.css';

export default function Header({ onClear, onReset }) {
    return (
        <header className="header">
            <div className="header-brand">
                <span className="header-icon">⌥</span>
                <h1>Git Sandbox</h1>
            </div>
            <div className="header-actions">
                <button
                    className="btn-clear"
                    onClick={onReset}
                    title="Completely wipe memory"
                    style={{ color: 'var(--error, #e57373)', borderColor: 'var(--border, #333)' }}
                >
                    Nuclear Reset
                </button>
                <button className="btn-clear" onClick={onClear} title="Clear terminal">
                    Clear
                </button>
            </div>
        </header>
    );
}
