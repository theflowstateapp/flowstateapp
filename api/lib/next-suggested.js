// Simplified next-suggested without external dependencies
function getNextSuggestedWithProposal(workspaceId) {
  // Return mock next suggested task
  return {
    task: {
      title: "Finish landing hero",
      priority: "HIGH",
      context: "Deep Work",
      estimateMins: 45
    },
    proposedTime: "10:30 AM",
    rationale: "High priority task with deep work context, perfect for morning focus time"
  };
}

module.exports = { getNextSuggestedWithProposal };