package com.gitsandbox.service;

import com.gitsandbox.model.Commit;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GitService {
    private boolean isInitialized = false;
    private Map<String,Commit> commitHistory = new HashMap<>();
    private Map<String,String> branches = new HashMap<>();

    private String currentBranch = "main";

    public String processCommand(String command){
        command = command.trim();

        if(command.equals("git init")){
            if(isInitialized) return "Reinitialized existing Git Repository";
            isInitialized = true;
            branches.put("main","null");
            currentBranch = "main";
            return "Initialized empty Git Repository";
        }
        if(!isInitialized){
            return "Fatal : not a git repository ";
        }
        if(command.equals("git status")){
            return "On branch " + currentBranch + "\n Nothing to commit, working tree clean ";
        }
        if(command.equals("git branch")){
            StringBuilder sb = new StringBuilder();
            for(String  branch : branches.keySet()){
                if(branch.equals(currentBranch)){
                    sb.append("* ").append(branch).append("\n");
                }else {
                    sb.append(" ").append(branch).append("\n");
                }
            }
            return sb.toString().trim();
        }
        if(command.startsWith("git branch")){
            String newBranch = command.substring(11).trim();
            if(branches.containsKey(newBranch)) return "fatal : A branch named '" + newBranch + "'already exists. ";
            //new branch points to same commit as current branch
            branches.put(newBranch,branches.get(currentBranch));
            return "";
        }
        if(command.startsWith("git checkout -b ")){
            String newBranch = command.substring(16).trim();
            if(branches.containsKey(newBranch)) return "fatal : A branch named '" + newBranch + "' already exists. ";

            // --- ADD THESE 3 LINES ---
            branches.put(newBranch, branches.get(currentBranch)); // Copy the commit history
            currentBranch = newBranch;                            // Move the HEAD pointer
            return "Switched to a new branch '" + newBranch + "'"; // Return so it stops reading!
        }
        if (command.startsWith("git checkout ")) {
            String targetBranch = command.substring(13).trim();
            if (!branches.containsKey(targetBranch)) return "error: pathspec '" + targetBranch + "' did not match any file(s) known to git";

            currentBranch = targetBranch;
            return "Switched to branch '" + targetBranch + "'";
        }

        // 7. Git Commit
        if (command.startsWith("git commit -m")) {
            try {
                String message = command.split("\"")[1];

                // The parent is whatever commit the current branch is currently pointing to
                String parentHash = branches.get(currentBranch);

                Commit newCommit = new Commit(message, parentHash);
                commitHistory.put(newCommit.getHash(), newCommit); // Save to history

                // Move the branch pointer forward to the new commit
                branches.put(currentBranch, newCommit.getHash());

                return "[" + currentBranch + " " + newCommit.getHash() + "] " + message + "\n 1 file changed, 1 insertion(+)";
            } catch (Exception e) {
                return "error: switch 'm' requires a value. Try: git commit -m \"your message\"";
            }
        }

        // 8. Git Log (Supports standard and --oneline for your React UI)
        if (command.startsWith("git log")) {
            String currHash = branches.get(currentBranch);

            if (currHash == null || currHash.equals("null")) {
                return "fatal: your current branch '" + currentBranch + "' does not have any commits yet";
            }

            boolean isOneLine = command.contains("--oneline");
            StringBuilder log = new StringBuilder();

            // Traverse backwards through the tree using parent hashes
            while (currHash != null && !currHash.equals("null") && commitHistory.containsKey(currHash)) {
                Commit c = commitHistory.get(currHash);
                if (isOneLine) {
                    log.append(c.getHash()).append(" ").append(c.getMessage()).append("\n");
                } else {
                    log.append("commit ").append(c.getHash()).append("\n")
                            .append("Message: ").append(c.getMessage()).append("\n\n");
                }
                currHash = c.getParentHash(); // Step backward
            }
            return log.toString().trim();
        }

        return "git: '" + command.replace("git ", "") + "' is not a git command. See 'git --help'.";
    }
}
