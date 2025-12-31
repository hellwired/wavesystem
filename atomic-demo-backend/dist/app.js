"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./infrastructure/database/data-source");
const UserController_1 = require("./infrastructure/controllers/UserController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*", // Allow Next.js frontend
        methods: ["GET", "POST"]
    }
});
const userController = new UserController_1.UserController();
// --- Simulation State ---
let simulationInterval = null;
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
            event: Object.assign(Object.assign({}, randomEvent), { timestamp: new Date().toISOString() })
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
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected (Atoms DB)");
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Socket.io ready on port ${PORT}`);
    });
})
    .catch((error) => console.log(error));
