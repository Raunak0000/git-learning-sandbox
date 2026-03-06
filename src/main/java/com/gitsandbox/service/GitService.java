package com.gitsandbox.service;

import com.gitsandbox.model.Commit;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class GitService {
    private boolean isInitialized = false;
    private Map<String, Commit> commitHistory = new HashMap<>();
    private Map<String, String> branches = new HashMap<>();

    // Staging area simulated states
    private Set<String> untrackedFiles = new HashSet<>();
    private Set<String> stagedFiles = new HashSet<>();

    private String currentBranch = "main";

    public String processCommand(String command) {
        command = command.trim();

        if (command.equals("git init")) {
            if (isInitialized)
                return "Reinitialized existing Git Repository";
            isInitialized = true;
            branches.put("main", "null");
            currentBranch = "main";
            untrackedFiles.clear();
            stagedFiles.clear();
            return "Initialized empty Git Repository";
        }
        if (!isInitialized) {
            return "fatal: not a git repository";
        }

        // Touch (create file)
        if (command.startsWith("touch ")) {
            String file = command.substring(6).trim();
            if (file.isEmpty())
                return "touch: missing file operand";
            if (!stagedFiles.contains(file)) {
                untrackedFiles.add(file);
            }
            return "";
        }

        // Git Status
        if (command.equals("git status")) {
            StringBuilder sb = new StringBuilder();
            sb.append("On branch ").append(currentBranch).append("\n");

            if (stagedFiles.isEmpty() && untrackedFiles.isEmpty()) {
                sb.append("nothing to commit, working tree clean");
            } else {
                if (!stagedFiles.isEmpty()) {
                    sb.append("Changes to be committed:\n");
                    sb.append("  (use \"git restore --staged <file>...\" to unstage)\n");
                    for (String file : stagedFiles) {
                        sb.append("\tnew file:   ").append(file).append("\n");
                    }
                    sb.append("\n");
                }
                if (!untrackedFiles.isEmpty()) {
                    sb.append("Untracked files:\n");
                    sb.append("  (use \"git add <file>...\" to include in what will be committed)\n");
                    for (String file : untrackedFiles) {
                        sb.append("\t").append(file).append("\n");
                    }
                    sb.append("\n");
                }
            }
            return sb.toString().trim();
        }

        // Git Add
        if (command.startsWith("git add ")) {
            String file = command.substring(8).trim();
            if (file.equals(".")) {
                stagedFiles.addAll(untrackedFiles);
                untrackedFiles.clear();
            } else if (untrackedFiles.contains(file)) {
                untrackedFiles.remove(file);
                stagedFiles.add(file);
            } else if (!stagedFiles.contains(file)) {
                return "fatal: pathspec '" + file + "' did not match any files";
            }
            return "";
        }

        if (command.equals("git branch")) {
            StringBuilder sb = new StringBuilder();
            for (String branch : branches.keySet()) {
                if (branch.equals(currentBranch)) {
                    sb.append("* ").append(branch).append("\n");
                } else {
                    sb.append("  ").append(branch).append("\n");
                }
            }
            return sb.toString().trim();
        }

        if (command.startsWith("git branch ")) {
            String newBranch = command.split("\\s+")[2].trim().replaceAll("^\"|\"$|^'|'$", "");
            if (branches.containsKey(newBranch))
                return "fatal: A branch named '" + newBranch + "' already exists.";
            branches.put(newBranch, branches.get(currentBranch));
            return "";
        }

        if (command.startsWith("git checkout -b ")) {
            String newBranch = command.split("\\s+")[3].trim().replaceAll("^\"|\"$|^'|'$", "");
            if (branches.containsKey(newBranch))
                return "fatal: A branch named '" + newBranch + "' already exists.";

            branches.put(newBranch, branches.get(currentBranch));
            currentBranch = newBranch;
            return "Switched to a new branch '" + newBranch + "'";
        }

        if (command.startsWith("git checkout ")) {
            String targetBranch = command.split("\\s+")[2].trim().replaceAll("^\"|\"$|^'|'$", "");
            if (!branches.containsKey(targetBranch))
                return "error: pathspec '" + targetBranch + "' did not match any file(s) known to git";

            currentBranch = targetBranch;
            return "Switched to branch '" + targetBranch + "'";
        }

        // Git Merge
        if (command.startsWith("git merge ")) {
            String targetBranch = command.split("\\s+")[2].trim().replaceAll("^\"|\"$|^'|'$", "");
            if (!branches.containsKey(targetBranch))
                return "merge: " + targetBranch + " - not something we can merge";
            if (targetBranch.equals(currentBranch))
                return "Already up to date.";

            String targetHash = branches.get(targetBranch);
            String currHash = branches.get(currentBranch);

            // Simplified true merge: create a new merge commit
            String message = "Merge branch '" + targetBranch + "' into " + currentBranch;
            Commit mergeCommit = new Commit(message, currHash, targetHash);
            commitHistory.put(mergeCommit.getHash(), mergeCommit);
            branches.put(currentBranch, mergeCommit.getHash());

            return "Merge made by the 'recursive' strategy.\n 1 file changed, 1 insertion(+)";
        }

        // Git Commit
        if (command.startsWith("git commit -m")) {
            if (stagedFiles.isEmpty()) {
                return "nothing to commit, working tree clean";
            }
            try {
                String message = command.split("\"")[1];
                String parentHash = branches.get(currentBranch);

                Commit newCommit = new Commit(message, parentHash);
                commitHistory.put(newCommit.getHash(), newCommit);
                branches.put(currentBranch, newCommit.getHash());

                int filesChanged = stagedFiles.size();
                stagedFiles.clear(); // Empty staging after commit

                return "[" + currentBranch + " " + newCommit.getHash() + "] " + message + "\n " + filesChanged
                        + " file(s) changed, insertions(+)";
            } catch (Exception e) {
                return "error: switch 'm' requires a value. Try: git commit -m \"your message\"";
            }
        }

        // Git Log
        if (command.startsWith("git log")) {
            String currHash = branches.get(currentBranch);

            if (currHash == null || currHash.equals("null")) {
                return "fatal: your current branch '" + currentBranch + "' does not have any commits yet";
            }

            boolean isGraphData = command.contains("--graph-data");
            boolean isOneLine = command.contains("--oneline");
            StringBuilder log = new StringBuilder();

            Set<String> visited = new HashSet<>();
            List<String> queue = new ArrayList<>();

            // Start traversal from ALL branch heads so we see the full graph
            for (String headHash : branches.values()) {
                if (headHash != null && !headHash.equals("null")) {
                    queue.add(headHash);
                }
            }

            while (!queue.isEmpty()) {
                String cHash = queue.remove(0);
                if (cHash == null || cHash.equals("null") || !commitHistory.containsKey(cHash))
                    continue;
                if (visited.contains(cHash))
                    continue;
                visited.add(cHash);

                Commit c = commitHistory.get(cHash);

                if (isGraphData) {
                    String parents = c.getParentHash();
                    if (c.getSecondParentHash() != null)
                        parents += "," + c.getSecondParentHash();
                    if (parents == null || parents.equals("null"))
                        parents = "";

                    List<String> branchLabels = new ArrayList<>();
                    for (Map.Entry<String, String> entry : branches.entrySet()) {
                        if (entry.getValue().equals(c.getHash())) {
                            if (entry.getKey().equals(currentBranch)) {
                                branchLabels.add("HEAD -> " + entry.getKey());
                            } else {
                                branchLabels.add(entry.getKey());
                            }
                        }
                    }
                    String branchesStr = String.join(",", branchLabels);

                    log.append(c.getHash()).append("|").append(parents).append("|").append(branchesStr).append("|")
                            .append(c.getMessage()).append("\n");
                } else if (isOneLine) {
                    log.append(c.getHash()).append(" ").append(c.getMessage()).append("\n");
                } else {
                    log.append("commit ").append(c.getHash()).append("\n")
                            .append("Message: ").append(c.getMessage()).append("\n\n");
                }

                if (c.getParentHash() != null && !c.getParentHash().equals("null")) {
                    queue.add(c.getParentHash());
                }
                if (c.getSecondParentHash() != null && !c.getSecondParentHash().equals("null")) {
                    queue.add(c.getSecondParentHash());
                }
            }
            return log.toString().trim();
        }

        return "git: '" + command.replace("git ", "") + "' is not a git command. See 'git --help'.";
    }
}
