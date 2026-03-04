import { useState, useEffect } from 'react';
import { executeCommand } from '../api/terminal';
import './CommitGraph.css';

/**
 * Parse `git log --oneline` output into commit objects.
 * Expected format: "<hash> <message>" per line.
 */
function parseLog(raw) {
    if (!raw || typeof raw !== 'string') return [];

    return raw
        .trim()
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => {
            const spaceIdx = line.indexOf(' ');
            if (spaceIdx === -1) return { hash: line.trim(), message: '' };
            return {
                hash: line.substring(0, spaceIdx).trim(),
                message: line.substring(spaceIdx + 1).trim(),
            };
        });
}

export default function CommitGraph() {
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    const fetchLog = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await executeCommand('git log --oneline');
            const isErrorResult =
                result.startsWith('fatal') ||
                result.startsWith('Fatal') ||
                result.startsWith('error');

            if (isErrorResult) {
                setCommits([]);
                setError(result);
            } else {
                setCommits(parseLog(result));
            }
        } catch (err) {
            setError(`Failed to fetch log: ${err.message}`);
            setCommits([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLog();
    }, []);

    return (
        <div className={`commit-graph ${collapsed ? 'commit-graph--collapsed' : ''}`}>
            <div className="commit-graph-header">
                <button
                    className="commit-graph-toggle"
                    onClick={() => setCollapsed((c) => !c)}
                    title={collapsed ? 'Expand graph' : 'Collapse graph'}
                >
                    <span className={`toggle-arrow ${collapsed ? 'toggle-arrow--collapsed' : ''}`}>
                        ▾
                    </span>
                </button>
                <h2 className="commit-graph-title">Commit Graph</h2>
                <button
                    className="commit-graph-refresh"
                    onClick={fetchLog}
                    disabled={loading}
                    title="Refresh commit history"
                >
                    ↻
                </button>
            </div>

            {!collapsed && (
                <div className="commit-graph-body">
                    {loading && (
                        <div className="commit-graph-status">Loading…</div>
                    )}

                    {!loading && error && (
                        <div className="commit-graph-status commit-graph-status--error">
                            {error}
                        </div>
                    )}

                    {!loading && !error && commits.length === 0 && (
                        <div className="commit-graph-status">
                            No commits yet. Run <code>git commit</code> to get started.
                        </div>
                    )}

                    {!loading && !error && commits.length > 0 && (
                        <ol className="commit-list">
                            {commits.map((commit, idx) => (
                                <li key={commit.hash} className="commit-node">
                                    {/* Vertical rail + dot */}
                                    <div className="commit-rail">
                                        <span className={`commit-dot ${idx === 0 ? 'commit-dot--head' : ''}`} />
                                        {idx < commits.length - 1 && <span className="commit-line" />}
                                    </div>

                                    {/* Commit details */}
                                    <div className="commit-info">
                                        <code className="commit-hash">{commit.hash}</code>
                                        <span className="commit-msg">{commit.message}</span>
                                        {idx === 0 && <span className="commit-badge">HEAD</span>}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            )}
        </div>
    );
}
