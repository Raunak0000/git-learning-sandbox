const API_BASE = 'http://localhost:8080/api/terminal';

export async function executeCommand(command) {
  const res = await fetch(`${API_BASE}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return res.text();
}

export async function resetSandbox() {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return res.text();
}
