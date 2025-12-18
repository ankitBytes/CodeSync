import { Server } from "socket.io";
import Session from "../models/session.model.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { SocketAuthMiddleware } from "../middleware/authMiddleware.js";

const activeSessions = {}; // in-memory live state for fast sync
const chatBuffer = {}; // in-memory chat cache (optional)

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ],
      credentials: true,
    },
    transports: ["websocket"],
  });

  io.use(SocketAuthMiddleware);

  io.on("connection", (socket) => {
    logger.info("🔌 Client connected:", socket.id);
    socket.on("session:join", async ({ sessionId, clientId, name }, ack) => {
      const userId = socket.user.id;
      try {
        socket.join(sessionId);

        // Ensure DB session exists
        const session = await Session.findOne({ sessionId });
        if (!session) {
          return ack?.({ ok: false, error: "Session not found" });
        }

        // Add participant to DB (if not in list)
        const exists = session.participants.some(
          (p) => p.userId.toString() === userId
        );
        if (!exists) {
          await session.addParticipant(userId);
        }

        // Prepare in-memory session state
        if (!activeSessions[sessionId]) {
          activeSessions[sessionId] = {
            code: session.codeState.code,
            language: session.codeState.language,
            participants: {},
          };
        }

        activeSessions[sessionId].participants[userId] = {
          userId,
          name: name || "Anonymous",
          socketId: socket.id,
        };

        ack?.({
          ok: true,
          code: activeSessions[sessionId].code,
          language: activeSessions[sessionId].language,
          participants: Object.values(activeSessions[sessionId].participants),
        });

        io.to(sessionId).emit("session:participants", {
          participants: Object.values(activeSessions[sessionId].participants),
        });

        console.log(`📌 ${clientId} joined ${sessionId}`);
      } catch (err) {
        console.error("Join error:", err);
        ack?.({ ok: false, error: err.message });
      }
    });

    socket.on("session:leave", async ({ sessionId }) => {
      const userId = socket.user.id;
      try {
        socket.leave(sessionId);

        const session = await Session.findOne({ sessionId });
        if (!session) return;

        await session.removeParticipant(userId);

        // Send ONLY active participants
        const activeParticipants = session.participants.filter(
          (p) => p.isActive === true
        );

        io.to(sessionId).emit("session:participants", {
          participants: activeParticipants,
        });
      } catch (err) {
        console.error("Leave error:", err);
      }
    });

    socket.on("session:end", async ({ sessionId }) => {
      const userId = socket.user.id;
      try {
        const session = await Session.findOne({ sessionId });
        if (!session) return;

        await session.endSessionByCreator(userId);

        io.to(sessionId).emit("session:ended", {
          sessionId,
          reason: "session ended by creator",
        });

        const sockets = await io.in(sessionId).fetchSockets();
        sockets.forEach((s) => s.leave(sessionId));
      } catch (error) {
        logger.error("End session error:", error.message);
      }
    });

    socket.on(
      "session:code:change",
      async ({ sessionId, userId, code, language }) => {
        try {
          const session = await Session.findOne({ sessionId });
          if (!session) return;

          // logger.info(`Code change: ${code}`);
          // logger.info(`Language change: ${language}`);
          // logger.info(`Active session: ${sessionId}`);

          // Update in database (versioned)
          // await session.updateCode(code, userId);
          // Update live state
          activeSessions[sessionId].code = code;
          activeSessions[sessionId].language = language;

          // Broadcast update to others
          socket.to(sessionId).emit("session:code:update", {
            code,
            language,
            sourceClientId: userId,
          });
          console.log(
            "📤 Broadcasting code update to room",
            sessionId,
            "excluding",
            socket.id
          );
        } catch (err) {
          console.error("Code update error:", err);
        }
      }
    );

    socket.on(
      "session:cursor:update",
      async ({ sessionId, clientId, userId, cursor }) => {
        try {
          const session = await Session.findOne({ sessionId });
          if (!session) return;

          const idx = session.cursors.findIndex(
            (c) => c.userId.toString() === userId
          );

          if (idx === -1) {
            session.cursors.push({
              userId,
              position: { line: cursor.line ?? 0, column: cursor.column ?? 0 },
              isTyping: true,
              lastUpdated: new Date(),
            });
          } else {
            session.cursors[idx].position = cursor;
            session.cursors[idx].lastUpdated = new Date();
          }

          await session.save();

          socket.to(sessionId).emit("session:cursor:update", {
            clientId,
            cursor,
          });
        } catch (err) {
          console.error("Cursor error:", err);
        }
      }
    );

    socket.on("chat:message", async (msg, ack) => {
      const { sessionId, userId, text } = msg;

      try {
        const session = await Session.findOne({ sessionId });
        if (!session) return;

        session.chat.push({
          userId,
          message: text,
          timestamp: new Date(),
        });

        await session.save();

        io.to(sessionId).emit("chat:message", msg);

        ack?.({ ok: true });
      } catch (err) {
        console.error("Chat error:", err);
      }
    });

    socket.on("chat:getHistory", async ({ sessionId }, ack) => {
      try {
        const session = await Session.findOne({ sessionId });
        if (!session) return ack?.({ messages: [] });

        ack?.({ messages: session.chat });
      } catch (err) {
        console.error("Chat history error:", err);
        ack?.({ messages: [] });
      }
    });

    socket.on("disconnect", () => {
      for (const sessionId in activeSessions) {
        const participants = activeSessions[sessionId].participants;

        for (const userId in participants) {
          if (participants[userId].socketId === socket.id) {
            delete participants[userId];
          }
        }

        if (Object.keys(participants).length === 0) {
          delete activeSessions[sessionId];
        }
      }
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
}
