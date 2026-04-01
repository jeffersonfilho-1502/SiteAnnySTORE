package org.example;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class Main {
    private static final String STATIC_ROOT = "static";

    public static void main(String[] args) throws IOException {
        int port = resolvePort();
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", Main::handleRequest);
        server.setExecutor(null);
        server.start();
        System.out.println("USE ANNY STORE rodando em http://localhost:" + port);
    }

    private static int resolvePort() {
        String envPort = System.getenv("PORT");
        if (envPort == null || envPort.isBlank()) {
            return 8080;
        }
        try {
            return Integer.parseInt(envPort);
        } catch (NumberFormatException ignored) {
            return 8080;
        }
    }

    private static void handleRequest(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if (!"GET".equalsIgnoreCase(method)) {
            sendText(exchange, 405, "Metodo nao permitido");
            return;
        }

        String requestedPath = exchange.getRequestURI().getPath();
        String normalizedPath = normalizePath(requestedPath);
        String resourcePath = STATIC_ROOT + normalizedPath;

        try (InputStream resourceStream = Main.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (resourceStream == null) {
                sendNotFoundPage(exchange);
                return;
            }

            byte[] body = resourceStream.readAllBytes();
            exchange.getResponseHeaders().set("Content-Type", contentType(normalizedPath));
            exchange.sendResponseHeaders(200, body.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(body);
            }
        }
    }

    private static String normalizePath(String path) {
        if (path == null || path.isBlank() || "/".equals(path)) {
            return "/index.html";
        }
        String candidate = path;
        if (candidate.endsWith("/")) {
            candidate = candidate + "index.html";
        }
        if (candidate.contains("..")) {
            return "/index.html";
        }
        return candidate;
    }

    private static String contentType(String path) {
        Map<String, String> types = new HashMap<>();
        types.put(".html", "text/html; charset=utf-8");
        types.put(".css", "text/css; charset=utf-8");
        types.put(".js", "application/javascript; charset=utf-8");
        types.put(".json", "application/json; charset=utf-8");
        types.put(".svg", "image/svg+xml");
        types.put(".png", "image/png");
        types.put(".jpg", "image/jpeg");
        types.put(".jpeg", "image/jpeg");
        types.put(".webp", "image/webp");

        for (Map.Entry<String, String> entry : types.entrySet()) {
            if (path.endsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "text/plain; charset=utf-8";
    }

    private static void sendText(HttpExchange exchange, int status, String message) throws IOException {
        byte[] body = message.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(status, body.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(body);
        }
    }

    private static void sendNotFoundPage(HttpExchange exchange) throws IOException {
        String notFoundResource = STATIC_ROOT + "/404.html";
        try (InputStream resourceStream = Main.class.getClassLoader().getResourceAsStream(notFoundResource)) {
            if (resourceStream == null) {
                sendText(exchange, 404, "Pagina nao encontrada");
                return;
            }

            byte[] body = resourceStream.readAllBytes();
            exchange.getResponseHeaders().set("Content-Type", "text/html; charset=utf-8");
            exchange.sendResponseHeaders(404, body.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(body);
            }
        }
    }
}
