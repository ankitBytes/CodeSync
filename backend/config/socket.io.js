import { Server } from "socket.io";
import Session from "../models/session.model.js";
import User from "../models/User.js";

const activeSessions = {};   // in-memory live state for fast sync
const chatBuffer = {};       // in-memory chat cache (optional)

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173"
      ],
      credentials: true
    },
    transports: ["websocket"]
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // ------------------------------------------------------
    // JOIN SESSION
    // ------------------------------------------------------
    socket.on("session:join", async ({ sessionId, clientId, userId, name }, ack) => {
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

        activeSessions[sessionId].participants[clientId] = {
          userId,
          name: name || "Anonymous",
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

    // ------------------------------------------------------
    // LEAVE SESSION
    // ------------------------------------------------------
    socket.on("session:leave", async ({ sessionId, clientId, userId }) => {
      try {
        socket.leave(sessionId);

        const session = await Session.findOne({ sessionId });
        if (session) {
          await session.removeParticipant(userId);
        }

        if (activeSessions[sessionId]) {
          delete activeSessions[sessionId].participants[clientId];

          io.to(sessionId).emit("session:participants", {
            participants: Object.values(activeSessions[sessionId].participants),
          });
        }

        console.log(`🚪 ${clientId} left ${sessionId}`);
      } catch (err) {
        console.error("Leave error:", err);
      }
    });

    // ------------------------------------------------------
    // CODE CHANGE (REALTIME + DATABASE)
    // ------------------------------------------------------
    socket.on(
      "session:code:change",
      async ({ sessionId, clientId, userId, code, language }) => {
        try {
          const session = await Session.findOne({ sessionId });
          if (!session) return;

          // Update in database (versioned)
          await session.updateCode(code, userId);

          // Update live state
          activeSessions[sessionId].code = code;
          activeSessions[sessionId].language = language;

          // Broadcast update to others
          socket.to(sessionId).emit("session:code:update", {
            code,
            language,
            sourceClientId: clientId,
          });
        } catch (err) {
          console.error("Code update error:", err);
        }
      }
    );

    // ------------------------------------------------------
    // CURSOR UPDATE (REALTIME + DB)
    // ------------------------------------------------------
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

    // ------------------------------------------------------
    // CHAT STORAGE
    // ------------------------------------------------------
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

    // ------------------------------------------------------
    // LOAD CHAT HISTORY
    // ------------------------------------------------------
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

    // ------------------------------------------------------
    // DISCONNECT
    // ------------------------------------------------------
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
}
