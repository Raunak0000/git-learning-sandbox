package com.gitsandbox.service;

import com.gitsandbox.model.Commit;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GitService {
    private boolean isInitialized = false;
    private List<Commit> commitHistory = new ArrayList<>();

    public String processCommand(String command){
        command = command.trim();

        if(command.equals("git init")){
            if(isInitialized) return "Reinitialized existing Git Repository";
            isInitialized = true;
            return "Initialized empty Git Repository";
        }
        if(!isInitialized){
            return "Fatal : not a git repository ";
        }
        if(command.equals("git status")){
            return "On branch main \n Nothing to commit, working tree clean ";
        }
        if(command.startsWith("git commit -m")){
            try{
            String message = command.split("\"")[1];
            String parentHash = commitHistory.isEmpty() ? "null" : commitHistory.get(commitHistory.size() - 1).getHash();
            Commit newCommit = new Commit(message, parentHash);
            commitHistory.add(newCommit);
            return "[main" + newCommit.getHash() + "] " + message + "\n 1 file changed, 1 insertion(+)";
            }catch (Exception e){
                return "error: switch 'm' requires a value. Try: git commit -m \"your message\"";
            }
        }
        if(command.equals("git log")){
            if(commitHistory.isEmpty()) return "fatal : your current branch 'main' does not have any comits yet. ";

            StringBuilder log = new StringBuilder();
            for(int i = commitHistory.size() - 1; i >= 0; i--){
                Commit c = commitHistory.get(i);
                log.append("commit").append(c.getHash()).append("\n")
                        .append("Message: ").append(c.getMessage()).append("\n\n");
            }
            return log.toString().trim();
        }
        return "git: '" + command.replace("git","") + "' is not a git command. See 'git --help'.";
    }
}
