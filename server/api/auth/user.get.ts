export default defineEventHandler(async (event) => {
  // Clear any server-side sessions/cookies here if needed
  // For now, the client will handle clearing tokens

  return {success: true, message: "Logged out successfully"};
});
