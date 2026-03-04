import './Header.css';

export default function Header({ onClear }) {
    return (
        <header className="header">
            <div className="header-brand">
                <span className="header-icon">⌥</span>
                <h1>Git Sandbox</h1>
            </div>
            <div className="header-actions">
                <button className="btn-clear" onClick={onClear} title="Clear terminal">
                    Clear
                </button>
            </div>
        </header>
    );
}
