import Session from "../models/session.model.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

export const createSession = async (req, res) => {
  try {
    const {
      title,
      description = "",
      tags = [],
      language = "javascript",
      difficulty = "easy",
    } = req.body;

    const creatorId = req.user?.id || req.user?._id;

    const user = await User.findById(creatorId).select("username");
    const username = user?.username;

    if (!creatorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const sessionId = uuidv4().slice(0, 8);

    const session = await Session.create({
      sessionId,
      title,
      description,
      tags,
      difficulty,
      creator: creatorId,

      participants: [
        {
          userId: creatorId,
          username,
          role: "owner",
          isActive: true,
          permissions: {
            canEdit: true,
            canInvite: true,
            canDelete: true,
            canManageParticipants: true,
          },
        },
      ],

      codeState: {
        language,
        code: "",
      },

      status: "active",
      startedAt: new Date(),
      collaborationState: {
        isActive: true,
      },
    });

    return res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create session",
      error: error.message,
    });
  }
};

export const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params; // /session/:sessionId/join
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find active session
    const session = await Session.findOne({ sessionId, status: "active" });
    if (!session) {
      return res.status(404).json({ message: "Session not found or inactive" });
    }

    // Check if user already in participants list
    const alreadyJoined = session.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!alreadyJoined) {
      // Add new participant
      session.participants.push({
        userId,
        role: "participant",
        permissions: {
          canEdit: true,
          canInvite: false,
          canDelete: false,
          canManageParticipants: false,
        },
      });

      await session.save();
    }

    return res.status(200).json({
      message: alreadyJoined
        ? "Already in session"
        : "Joined session successfully",
      session,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to join session",
      error: error.message,
    });
  }
};

export const VerifySession = async (req, res) => {
  try {
    logger.info(
      { log: "Hi i am at the Verify session function" },
      "Loaded JWT secret for VerifySession"
    );

    const sessionId = req.params["sessionId"];

    const userId = req.user.id || req.user._id;

    const session = await Session.findOne({
      sessionId,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found or inactive",
      });
    }

    const isCreator = session.creator.toString() === userId.toString();

    const isParticipant = session.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!isCreator && !isParticipant) {
      await Session.updateOne(
        { _id: session._id },
        {
          $addToSet: {
            participants: {
              userId,
              role: "collaborator",
              joinedAt: new Date(),
              lastActive: new Date(),
              permissions: {
                canEdit: true,
                canInvite: false,
                canDelete: false,
                canManageParticipants: false,
              },
            },
          },
        }
      );
    }

    const updatedSession = await Session.findById(session._id);

    return res.status(200).json({
      message: "Session verified successfully",
      role: isCreator ? "creator" : "participant",
      session: updatedSession,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify session",
      error: error.message,
    });
  }
};
