const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');

router.post('/chat', controller.createChat);
router.get('/chats', controller.listChats);
router.get('/chat/:chatId', controller.getMessages);
router.post('/chat/:chatId/message', controller.sendMessage);

router.put('/:chatId', controller.editChatTitle);
router.delete('/:chatId', controller.deleteChat);

module.exports = router;
