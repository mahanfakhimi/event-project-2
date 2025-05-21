import { Hono } from "hono";
import Poll from "../models/Poll.js";
import Vote from "../models/Vote.js";
import {
  authMiddleware,
  requireAuth,
  adminMiddleware,
} from "../middleware/auth.js";

const pollRouter = new Hono();

// Get all polls (public)
pollRouter.get("/", async (c) => {
  try {
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .select("title description isActive endDate totalVotes");
    return c.json({ success: true, data: polls });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get single poll (public)
pollRouter.get("/:id", authMiddleware, requireAuth, async (c) => {
  try {
    const poll = await Poll.findById(c.req.param("id"));
    if (!poll) {
      return c.json({ success: false, error: "Poll not found" }, 404);
    }

    // Check if user is authenticated and has voted
    let hasVoted = false;
    let userVote = null;

    if (c.get("user")) {
      const vote = await Vote.findOne({
        poll: poll._id,
        user: c.get("user").id,
      });

      if (vote) {
        hasVoted = true;
        userVote = vote.selectedOption;
      }
    }

    return c.json({
      success: true,
      data: {
        ...poll.toObject(),
        hasVoted,
        userVote,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 404);
  }
});

// Create new poll (admin only)
pollRouter.post(
  "/",
  authMiddleware,
  requireAuth,
  adminMiddleware,
  async (c) => {
    try {
      const pollData = await c.req.json();
      pollData.createdBy = c.get("user").id;

      const poll = new Poll(pollData);
      await poll.save();

      return c.json({ success: true, data: poll }, 201);
    } catch (error) {
      return c.json({ success: false, error: error.message }, 400);
    }
  }
);

// Submit vote (authenticated users only)
pollRouter.post("/:id/vote", authMiddleware, requireAuth, async (c) => {
  try {
    const pollId = c.req.param("id");
    const userId = c.get("user").id;
    const { optionIndex } = await c.req.json();

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return c.json({ success: false, error: "Poll not found" }, 404);
    }

    if (!poll.isActive || new Date() > poll.endDate) {
      return c.json({ success: false, error: "Poll is no longer active" }, 400);
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({ poll: pollId, user: userId });
    if (existingVote) {
      return c.json(
        { success: false, error: "User has already voted in this poll" },
        400
      );
    }

    // Create vote record
    const vote = new Vote({
      poll: pollId,
      user: userId,
      selectedOption: optionIndex,
    });
    await vote.save();

    // Update poll statistics
    poll.options[optionIndex].votes += 1;
    poll.totalVotes += 1;
    await poll.save();

    return c.json({ success: true, data: poll });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 400);
  }
});

// Get poll results (public)
pollRouter.get("/:id/results", async (c) => {
  try {
    const poll = await Poll.findById(c.req.param("id"));
    if (!poll) {
      return c.json({ success: false, error: "Poll not found" }, 404);
    }

    const results = {
      title: poll.title,
      description: poll.description,
      totalVotes: poll.totalVotes,
      options: poll.options.map((option) => ({
        text: option.text,
        votes: option.votes,
        percentage:
          poll.totalVotes > 0
            ? ((option.votes / poll.totalVotes) * 100).toFixed(1)
            : 0,
      })),
      isActive: poll.isActive && new Date() <= poll.endDate,
    };

    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 404);
  }
});

// Update poll status (internal use)
pollRouter.get("/update-status", async (c) => {
  try {
    const now = new Date();
    await Poll.updateMany(
      { endDate: { $lt: now }, isActive: true },
      { $set: { isActive: false } }
    );
    return c.json({ success: true, message: "Poll status updated" });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get user's voted polls
pollRouter.get("/user/votes", authMiddleware, requireAuth, async (c) => {
  try {
    const userId = c.get("user").id;

    // Get all votes by user
    const votes = await Vote.find({ user: userId })
      .populate({
        path: "poll",
        select: "title description isActive endDate totalVotes options",
      })
      .sort({ createdAt: -1 });

    // Transform the data to include vote information
    const votedPolls = votes.map((vote) => ({
      ...vote.poll.toObject(),
      userVote: vote.selectedOption,
      votedAt: vote.votedAt,
    }));

    return c.json({ success: true, data: votedPolls });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default pollRouter;
