import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock Data for API Class
let users = [
  { id: 1, name: "Juan Perez", email: "juan@uteq.edu.ec", role: "Student" },
  { id: 2, name: "Maria Garcia", email: "maria@uteq.edu.ec", role: "Professor" },
  { id: 3, name: "Carlos Lopez", email: "carlos@uteq.edu.ec", role: "Admin" },
];

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mock API Endpoints
app.get("/api/users", (req, res) => {
    res.json(users);
});

app.get("/api/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

app.post("/api/users", (req, res) => {
    const newUser = {
        id: users.length + 1,
        ...req.body
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.put("/api/users/:id", (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "User not found" });
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
});

app.delete("/api/users/:id", (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.status(204).send();
});

async function startServer() {
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static(path.join(__dirname, "dist")));
        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "dist", "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
}

startServer();
