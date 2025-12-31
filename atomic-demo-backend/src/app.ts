import "reflect-metadata";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { AppDataSource } from "./infrastructure/database/data-source";
import { UserController } from "./infrastructure/controllers/UserController";

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow Next.js frontend
        methods: ["GET", "POST"]
    }
});

const userController = new UserController();

// --- Simulation State ---
let simulationInterval: NodeJS.Timeout | null = null;
let activeUsers = 0;

// --- Routes ---
app.get("/", (req, res) => {
    res.json({ message: "Atomic Architecture Demo Backend is Running ⚛️", endpoints: ["POST /users/register", "POST /simulation/start", "POST /simulation/stop"] });
});

app.post("/users/register", userController.register);

// Simulation Endpoints
app.post("/simulation/start", (req, res) => {
    if (simulationInterval) {
        return res.json({ message: "Simulation already running" });
    }

    activeUsers = 50; // Initial spike
    simulationInterval = setInterval(() => {
        // Fluctuate users
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        activeUsers = Math.max(0, activeUsers + change);

        // Generate Random Event
        const eventTypes = [
            { type: 'page_view', detail: 'Homepage' },
            { type: 'click', detail: 'Pricing Button' },
            { type: 'api_call', detail: '/api/v1/data (200 OK)' },
            { type: 'new_session', detail: 'User #992' }
        ];
        const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        // Emit Data
        io.emit("analytics_update", {
            activeUsers,
            latency: Math.floor(Math.random() * 50) + 10, // 10-60ms
            event: { ...randomEvent, timestamp: new Date().toISOString() }
        });

    }, 2000); // Update every 2 seconds

    res.json({ message: "Simulation started" });
});

app.post("/simulation/stop", (req, res) => {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    activeUsers = 0;
    io.emit("analytics_update", { activeUsers: 0, latency: 0, event: null });
    res.json({ message: "Simulation stopped" });
});

const PORT = 3001;

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected (Atoms DB)");
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Socket.io ready on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
