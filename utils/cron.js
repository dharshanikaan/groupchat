//util/cron.js
const cron = require("node-cron");
const { Op } = require("sequelize");
const Chat = require("../models/chat");
const ArchivedChat = require("../models/archivedmessage");

cron.schedule("0 0 * * *", async () => {
  // Runs every night at midnight
  console.log("Cron Job Started: Archiving chats...");

  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Fetch chats older than one day
    const chatsToArchive = await Chat.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    if (chatsToArchive.length > 0) {
      const archivedChats = chatsToArchive.map((chat) => ({
        id: chat.id,
        message: chat.message,
        userId: chat.userId,
        groupId: chat.groupId,
        createdAt: chat.createdAt,
      }));

      // Insert the chats into the ArchivedChat table
      await ArchivedChat.bulkCreate(archivedChats);

      const chatIds = chatsToArchive.map((chat) => chat.id);

      // Delete the chats from the Chat table
      await Chat.destroy({
        where: {
          id: chatIds,
        },
      });

      console.log(`Archived and deleted ${chatsToArchive.length} chats.`);
    } else {
      console.log("No chats to archive.");
    }
  } catch (error) {
    console.error("Error archiving chats:", error.message);
  }
});
