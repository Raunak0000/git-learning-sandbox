import { useState, useEffect } from 'react';
import { executeCommand } from '../api/terminal';
import './CommitGraph.css';

/**
 * Parse `git log --graph-data` output into commit objects.
 * Expected format: "hash|parent1,parent2|branch1,branch2|message" per line.
 */
function parseLog(raw) {
    if (!raw || typeof raw !== 'string') return [];

    return raw
        .trim()
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => {
            const parts = line.split('|');
            if (parts.length < 4) return { hash: line.trim(), parents: [], branches: [], message: '' };

            return {
                hash: parts[0].trim(),
                parents: parts[1].trim() ? parts[1].trim().split(',') : [],
                branches: parts[2].trim() ? parts[2].trim().split(',') : [],
                message: parts[3].trim(),
            };
        });
}

export default function CommitGraph() {
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLog = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await executeCommand('git log --graph-data');
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

        // Listen to terminal executions to auto-refresh the graph
        const handleRefresh = () => fetchLog();
        const handleClear = () => setCommits([]);

        window.addEventListener('terminal-command-executed', handleRefresh);
        window.addEventListener('terminal-cleared', handleClear);

        return () => {
            window.removeEventListener('terminal-command-executed', handleRefresh);
            window.removeEventListener('terminal-cleared', handleClear);
        };
    }, []);

    return (
        <div className="commit-graph">
            <div className="commit-graph-header">
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
                        {commits.map((commit, idx) => {
                            const isMerge = commit.parents.length > 1;

                            return (
                                <li key={commit.hash} className={`commit-node ${isMerge ? 'commit-node--merge' : ''}`}>
                                    {/* Vertical rail + dot */}
                                    <div className="commit-rail">
                                        <span className={`commit-dot ${idx === 0 ? 'commit-dot--head' : ''} ${isMerge ? 'commit-dot--merge' : ''}`} />
                                        {idx < commits.length - 1 && <span className="commit-line" />}
                                    </div>

                                    {/* Commit details */}
                                    <div className="commit-info">
                                        <code className="commit-hash">{commit.hash}</code>

                                        <div className="commit-badges">
                                            {commit.branches.map(b => (
                                                <span key={b} className={`commit-badge ${b.includes('HEAD') ? 'commit-badge--head' : ''}`}>
                                                    {b}
                                                </span>
                                            ))}
                                            {isMerge && (
                                                <span className="commit-badge commit-badge--merge">
                                                    Merge: {commit.parents[0].substring(0, 4)} + {commit.parents[1].substring(0, 4)}
                                                </span>
                                            )}
                                        </div>

                                        <span className="commit-msg">{commit.message}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                )}
            </div>
        </div>
    );
}
