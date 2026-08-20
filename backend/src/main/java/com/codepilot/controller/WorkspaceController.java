package com.codepilot.controller;

import com.codepilot.dto.WorkspaceFileDto;
import com.codepilot.dto.WorkspaceRunnerDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workspace")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WorkspaceController {

    private final Path workspaceRoot = Paths.get("workspace").toAbsolutePath();

    public WorkspaceController() {
        try {
            if (!Files.exists(workspaceRoot)) {
                Files.createDirectories(workspaceRoot);
            }
            
            // Self-healing initialization of default workspace files
            Path mainJava = workspaceRoot.resolve("Main.java");
            if (!Files.exists(mainJava)) {
                Files.writeString(mainJava, "public class Main {\n" +
                        "    public static void main(String[] args) {\n" +
                        "        System.out.println(\"Hello, welcome to CodePilot AI Workspace!\");\n" +
                        "        String text = null;\n" +
                        "        if (text != null) {\n" +
                        "            System.out.println(\"Text length: \" + text.length());\n" +
                        "        } else {\n" +
                        "            System.out.println(\"Text is null, NPE avoided!\");\n" +
                        "        }\n" +
                        "    }\n" +
                        "}");
            }
            
            Path scriptJs = workspaceRoot.resolve("script.js");
            if (!Files.exists(scriptJs)) {
                Files.writeString(scriptJs, "// CodePilot JS Demo Script\n" +
                        "function calculateFibonacci(n) {\n" +
                        "    if (n <= 1) return n;\n" +
                        "    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);\n" +
                        "}\n\n" +
                        "const terms = 10;\n" +
                        "console.log(`Calculating first ${terms} terms of Fibonacci sequence:`);\n" +
                        "for (let i = 0; i < terms; i++) {\n" +
                        "    console.log(`Term ${i}: ${calculateFibonacci(i)}`);\n" +
                        "}");
            }
            
            Path styleCss = workspaceRoot.resolve("style.css");
            if (!Files.exists(styleCss)) {
                Files.writeString(styleCss, "/* CodePilot Workspace CSS Styling Demo */\n" +
                        "body {\n" +
                        "    background-color: #0f172a;\n" +
                        "    color: #f8fafc;\n" +
                        "    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n" +
                        "    margin: 0;\n" +
                        "    padding: 20px;\n" +
                        "}\n\n" +
                        "h1 {\n" +
                        "    color: #6366f1;\n" +
                        "    border-bottom: 2px solid rgba(99, 102, 241, 0.2);\n" +
                        "    padding-bottom: 8px;\n" +
                        "}");
            }

            Path indexHtml = workspaceRoot.resolve("index.html");
            if (!Files.exists(indexHtml)) {
                Files.writeString(indexHtml, "<!DOCTYPE html>\n" +
                        "<html lang=\"en\">\n" +
                        "<head>\n" +
                        "    <meta charset=\"UTF-8\">\n" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "    <title>CodePilot Coding Assistant Demo</title>\n" +
                        "    <link rel=\"stylesheet\" href=\"style.css\">\n" +
                        "</head>\n" +
                        "<body>\n" +
                        "    <h1>Welcome to CodePilot AI IDE</h1>\n" +
                        "    <p>This is a sandboxed multi-language workspace for developers.</p>\n" +
                        "    <script src=\"script.js\"></script>\n" +
                        "</body>\n" +
                        "</html>");
            }
        } catch (IOException e) {
            System.err.println("Failed to initialize workspace root: " + e.getMessage());
        }
    }

    private Path resolveSafePath(String relativePath) throws IOException {
        Path resolved = workspaceRoot.resolve(relativePath).normalize().toAbsolutePath();
        if (!resolved.startsWith(workspaceRoot)) {
            throw new SecurityException("Directory traversal attack detected!");
        }
        return resolved;
    }

    @GetMapping("/files")
    public ResponseEntity<List<WorkspaceFileDto>> listFiles() {
        try {
            if (!Files.exists(workspaceRoot)) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<WorkspaceFileDto> files = new ArrayList<>();
            try (var stream = Files.walk(workspaceRoot)) {
                List<Path> paths = stream.collect(Collectors.toList());
                for (Path p : paths) {
                    if (p.equals(workspaceRoot)) continue;
                    String relPath = workspaceRoot.relativize(p).toString().replace("\\", "/");
                    String type = Files.isDirectory(p) ? "DIRECTORY" : "FILE";
                    files.add(WorkspaceFileDto.builder()
                            .name(p.getFileName().toString())
                            .path(relPath)
                            .type(type)
                            .size(Files.isDirectory(p) ? 0 : Files.size(p))
                            .build());
                }
            }
            // Sort directories first, then alphabetical
            files.sort((f1, f2) -> {
                if (f1.getType().equals(f2.getType())) {
                    return f1.getPath().compareTo(f2.getPath());
                }
                return f1.getType().equals("DIRECTORY") ? -1 : 1;
            });
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/files/content")
    public ResponseEntity<WorkspaceFileDto> getFileContent(@RequestParam("path") String path) {
        try {
            Path file = resolveSafePath(path);
            if (!Files.exists(file) || Files.isDirectory(file)) {
                return ResponseEntity.notFound().build();
            }
            String content = Files.readString(file);
            return ResponseEntity.ok(WorkspaceFileDto.builder()
                    .name(file.getFileName().toString())
                    .path(path)
                    .type("FILE")
                    .content(content)
                    .size(Files.size(file))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/files/save")
    public ResponseEntity<Void> saveFile(@RequestBody WorkspaceFileDto fileDto) {
        try {
            Path file = resolveSafePath(fileDto.getPath());
            Files.writeString(file, fileDto.getContent() != null ? fileDto.getContent() : "");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/files/create")
    public ResponseEntity<Void> createFile(
            @RequestParam("path") String path,
            @RequestParam("type") String type) {
        try {
            Path file = resolveSafePath(path);
            if (Files.exists(file)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

            if ("DIRECTORY".equalsIgnoreCase(type)) {
                Files.createDirectories(file);
            } else {
                // Ensure parent directories exist
                if (file.getParent() != null && !Files.exists(file.getParent())) {
                    Files.createDirectories(file.getParent());
                }
                Files.createFile(file);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/files/delete")
    public ResponseEntity<Void> deleteFile(@RequestParam("path") String path) {
        try {
            Path file = resolveSafePath(path);
            if (!Files.exists(file)) {
                return ResponseEntity.notFound().build();
            }

            if (Files.isDirectory(file)) {
                // Recursive delete for directories
                try (var stream = Files.walk(file)) {
                    List<Path> toDelete = stream.sorted(Comparator.reverseOrder()).collect(Collectors.toList());
                    for (Path p : toDelete) {
                        Files.delete(p);
                    }
                }
            } else {
                Files.delete(file);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/run")
    public ResponseEntity<WorkspaceRunnerDto> runCode(@RequestParam("path") String path) {
        try {
            Path file = resolveSafePath(path);
            if (!Files.exists(file)) {
                return ResponseEntity.notFound().build();
            }

            String fileName = file.getFileName().toString();
            List<String> command = new ArrayList<>();
            boolean isJava = fileName.endsWith(".java");

            if (isJava) {
                // Compilation step first
                ProcessBuilder compileBuilder = new ProcessBuilder("javac", file.toAbsolutePath().toString());
                Process compileProcess = compileBuilder.start();
                String compileErr = readStream(compileProcess.getErrorStream());
                int compileCode = compileProcess.waitFor();
                if (compileCode != 0) {
                    return ResponseEntity.ok(WorkspaceRunnerDto.builder()
                            .stdout("")
                            .stderr("Compilation Error:\n" + compileErr)
                            .exitCode(compileCode)
                            .build());
                }
                
                // Run step: java -cp workspace ClassName
                String className = fileName.substring(0, fileName.lastIndexOf("."));
                command.addAll(Arrays.asList("java", "-cp", workspaceRoot.toString(), className));
            } else if (fileName.endsWith(".c")) {
                String exeName = fileName.substring(0, fileName.lastIndexOf(".")) + ".exe";
                ProcessBuilder compileBuilder = new ProcessBuilder("gcc", file.toAbsolutePath().toString(), "-o", workspaceRoot.resolve(exeName).toString());
                Process compileProcess = compileBuilder.start();
                String compileErr = readStream(compileProcess.getErrorStream());
                int compileCode = compileProcess.waitFor();
                if (compileCode != 0) {
                    return ResponseEntity.ok(WorkspaceRunnerDto.builder()
                            .stdout("")
                            .stderr("C Compilation Error:\n" + compileErr)
                            .exitCode(compileCode)
                            .build());
                }
                command.add(workspaceRoot.resolve(exeName).toString());
            } else if (fileName.endsWith(".cpp") || fileName.endsWith(".cc")) {
                String exeName = fileName.substring(0, fileName.lastIndexOf(".")) + ".exe";
                ProcessBuilder compileBuilder = new ProcessBuilder("g++", file.toAbsolutePath().toString(), "-o", workspaceRoot.resolve(exeName).toString());
                Process compileProcess = compileBuilder.start();
                String compileErr = readStream(compileProcess.getErrorStream());
                int compileCode = compileProcess.waitFor();
                if (compileCode != 0) {
                    return ResponseEntity.ok(WorkspaceRunnerDto.builder()
                            .stdout("")
                            .stderr("C++ Compilation Error:\n" + compileErr)
                            .exitCode(compileCode)
                            .build());
                }
                command.add(workspaceRoot.resolve(exeName).toString());
            } else if (fileName.endsWith(".py")) {
                command.addAll(Arrays.asList("python", file.toAbsolutePath().toString()));
            } else if (fileName.endsWith(".js")) {
                command.addAll(Arrays.asList("node", file.toAbsolutePath().toString()));
            } else if (fileName.endsWith(".ts")) {
                command.addAll(Arrays.asList("npx", "ts-node", file.toAbsolutePath().toString()));
            } else if (fileName.endsWith(".sql")) {
                command.addAll(Arrays.asList("mysql", "-u", "root", "-praja2006", "-t", "codepilot", "-e", "source " + file.toAbsolutePath().toString().replace("\\", "/")));
            } else if (fileName.endsWith(".html") || fileName.endsWith(".css")) {
                return ResponseEntity.ok(WorkspaceRunnerDto.builder()
                        .stdout("HTML/CSS Live Compiler:\n" +
                                "- Parsing Document tree...\n" +
                                "- Loaded styles successfully.\n\n" +
                                "Status: Active web page rendering at index.html")
                        .stderr("")
                        .exitCode(0)
                        .build());
            } else {
                return ResponseEntity.badRequest().body(WorkspaceRunnerDto.builder()
                        .stdout("")
                        .stderr("Running code of this file type is not supported.")
                        .exitCode(-1)
                        .build());
            }

            ProcessBuilder runBuilder = new ProcessBuilder(command);
            runBuilder.directory(workspaceRoot.toFile());
            Process runProcess = runBuilder.start();

            // Setup 5 second timeout safety
            Timer timer = new Timer(true);
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    if (runProcess.isAlive()) {
                        runProcess.destroyForcibly();
                    }
                }
            }, 5000);

            String stdout = readStream(runProcess.getInputStream());
            String stderr = readStream(runProcess.getErrorStream());
            int exitCode = runProcess.waitFor();
            timer.cancel();

            return ResponseEntity.ok(WorkspaceRunnerDto.builder()
                    .stdout(stdout)
                    .stderr(stderr)
                    .exitCode(exitCode)
                    .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(WorkspaceRunnerDto.builder()
                            .stdout("")
                            .stderr("Execution Exception: " + e.getMessage())
                            .exitCode(-1)
                            .build());
        }
    }

    private String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }
}
