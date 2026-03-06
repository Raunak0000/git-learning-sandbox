import './Sidebar.css';

const COMMAND_CATEGORIES = [
    {
        title: 'Basic Workflow',
        commands: [
            { cmd: 'git init', desc: 'Initialize a new repository' },
            { cmd: 'touch file.txt', desc: 'Create a new file' },
            { cmd: 'git status', desc: 'Show working tree status' },
        ]
    },
    {
        title: 'Staging & Committing',
        commands: [
            { cmd: 'git add .', desc: 'Stage all files' },
            { cmd: 'git commit -m "msg"', desc: 'Record changes' },
            { cmd: 'git log', desc: 'Show commit history' },
        ]
    },
    {
        title: 'Branching & Merging',
        commands: [
            { cmd: 'git branch', desc: 'List branches' },
            { cmd: 'git checkout -b feature', desc: 'Create and switch' },
            { cmd: 'git merge feature', desc: 'Merge branch' },
        ]
    }
];

export default function Sidebar({ onCommandClick }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                {COMMAND_CATEGORIES.map((category) => (
                    <div key={category.title} className="sidebar-category">
                        <h2 className="sidebar-title sidebar-title--subcategory">{category.title}</h2>
                        <ul className="sidebar-list">
                            {category.commands.map((item) => (
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
                ))}
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
