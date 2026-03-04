import './Sidebar.css';

const COMMANDS = [
    { cmd: 'git init', desc: 'Initialize a new repository' },
    { cmd: 'git status', desc: 'Show working tree status' },
    { cmd: 'git commit -m "message"', desc: 'Record changes with a message' },
    { cmd: 'git log', desc: 'Show commit history' },
];

export default function Sidebar({ onCommandClick }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <h2 className="sidebar-title">Commands</h2>
                <ul className="sidebar-list">
                    {COMMANDS.map((item) => (
                        <li key={item.cmd} className="sidebar-item">
                            <button
                                className="sidebar-cmd"
                                onClick={() => onCommandClick(item.cmd)}
                                title={`Insert: ${item.cmd}`}
                            >
                                <code>{item.cmd}</code>
                                <span className="sidebar-desc">{item.desc}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="sidebar-section">
                <h2 className="sidebar-title">Tips</h2>
                <ul className="sidebar-tips">
                    <li>Type <code>clear</code> to reset the terminal</li>
                    <li>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate command history</li>
                    <li>Click any command above to auto-fill</li>
                </ul>
            </div>
        </aside>
    );
}
