import { db } from "../libs/db.js";

/* ===============================
   CREATE PLAYLIST
================================= */
export const createPlayList = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Playlist name is required" });
    }

    const playList = await db.playlist.create({
      data: {
        name,
        description,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playList,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

/* ===============================
   GET ALL PLAYLISTS (USER)
================================= */
export const getPlayAllListDetails = async (req, res) => {
  try {
    const playLists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      playLists,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
};

/* ===============================
   GET SINGLE PLAYLIST
================================= */
export const getPlayListDetails = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const playList = await db.playlist.findFirst({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playList) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      playList,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};

/* ===============================
   ADD PROBLEMS TO PLAYLIST
================================= */
export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid problemIds" });
    }

    // 🔐 Check ownership
    const playlist = await db.playlist.findFirst({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
    });

    if (!playlist) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playListId: playlistId,
        problemId,
      })),
      skipDuplicates: true, // 🚀 Prevent duplicates
    });

    const updatedPlaylist = await db.playlist.findFirst({
      where: { id: playlistId },
      include: {
        problems: {
          include: { problem: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Problems added successfully",
      updatedPlaylist,
    });
  } catch (error) {
    console.error("Error adding problems:", error);
    res.status(500).json({ error: "Failed to add problems" });
  }
};

/* ===============================
   REMOVE PROBLEMS FROM PLAYLIST
================================= */
export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid problemIds" });
    }

    // 🔐 Check ownership
    const playlist = await db.playlist.findFirst({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
    });

    if (!playlist) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await db.problemInPlaylist.deleteMany({
      where: {
        playListId: playlistId, // ⚠️ exact field name
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems removed successfully",
    });
  } catch (error) {
    console.error("Error removing problems:", error);
    res.status(500).json({ error: "Failed to remove problems" });
  }
};

/* ===============================
   DELETE PLAYLIST
================================= */
export const deletePlayList = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const deleted = await db.playlist.deleteMany({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};
