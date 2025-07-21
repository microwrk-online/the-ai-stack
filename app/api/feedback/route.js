import { NextRequest, NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Initialize database
let db = null;

async function initDB() {
  if (db) return db;

  try {
    db = await open({
      filename: path.join(process.cwd(), "feedback.db"),
      driver: sqlite3.Database,
    });

    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS feedback_items (
        id TEXT PRIMARY KEY,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id TEXT,
        session_id TEXT,
        vote_type TEXT CHECK(vote_type IN ('like', 'dislike')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(item_id, session_id)
      )
    `);

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

// GET - Fetch feedback counts for an item
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId is required" },
        { status: 400 }
      );
    }

    const database = await initDB();

    // Get or create feedback item
    let item = await database.get("SELECT * FROM feedback_items WHERE id = ?", [
      itemId,
    ]);

    if (!item) {
      await database.run(
        "INSERT INTO feedback_items (id, likes, dislikes) VALUES (?, 0, 0)",
        [itemId]
      );
      item = { id: itemId, likes: 0, dislikes: 0 };
    }

    return NextResponse.json({
      likes: item.likes,
      dislikes: item.dislikes,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Submit a vote
export async function POST(request) {
  try {
    const { itemId, sessionId, voteType, previousVote } = await request.json();

    if (!itemId || !sessionId || !voteType) {
      return NextResponse.json(
        {
          error: "itemId, sessionId, and voteType are required",
        },
        { status: 400 }
      );
    }

    if (!["like", "dislike"].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    const database = await initDB();

    // Start transaction
    await database.run("BEGIN TRANSACTION");

    try {
      // Ensure feedback item exists
      let item = await database.get(
        "SELECT * FROM feedback_items WHERE id = ?",
        [itemId]
      );
      if (!item) {
        await database.run(
          "INSERT INTO feedback_items (id, likes, dislikes) VALUES (?, 0, 0)",
          [itemId]
        );
        item = { id: itemId, likes: 0, dislikes: 0 };
      }

      // Get current user vote
      const currentVote = await database.get(
        "SELECT vote_type FROM user_votes WHERE item_id = ? AND session_id = ?",
        [itemId, sessionId]
      );

      let newLikes = item.likes;
      let newDislikes = item.dislikes;
      let newUserVote = null;

      // Remove previous vote if it exists
      if (currentVote) {
        if (currentVote.vote_type === "like") {
          newLikes--;
        } else if (currentVote.vote_type === "dislike") {
          newDislikes--;
        }
      }

      // If clicking the same vote type, just remove it (toggle off)
      if (currentVote && currentVote.vote_type === voteType) {
        // Remove the vote
        await database.run(
          "DELETE FROM user_votes WHERE item_id = ? AND session_id = ?",
          [itemId, sessionId]
        );
        newUserVote = null;
      } else {
        // Add new vote
        if (voteType === "like") {
          newLikes++;
        } else if (voteType === "dislike") {
          newDislikes++;
        }

        // Insert or update user vote
        await database.run(
          `INSERT OR REPLACE INTO user_votes (item_id, session_id, vote_type) 
           VALUES (?, ?, ?)`,
          [itemId, sessionId, voteType]
        );
        newUserVote = voteType;
      }

      // Update feedback counts
      await database.run(
        `UPDATE feedback_items 
         SET likes = ?, dislikes = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [newLikes, newDislikes, itemId]
      );

      await database.run("COMMIT");

      return NextResponse.json({
        likes: newLikes,
        dislikes: newDislikes,
        userVote: newUserVote,
      });
    } catch (error) {
      await database.run("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
