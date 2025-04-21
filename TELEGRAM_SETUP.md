# Telegram Bot Setup Guide for Varikoz Off Klinikasi

This guide explains how to set up a Telegram bot to receive appointment form submissions from your website.

## Step 1: Create a Telegram Bot

1. Open Telegram and search for "@BotFather" (this is Telegram's official bot for creating bots)
2. Start a chat with BotFather by clicking "Start"
3. Send the command `/newbot` to BotFather
4. Follow the instructions to name your bot (e.g., "Varikoz Off Reception")
5. Choose a username for your bot (it must end with "bot", e.g., "varikoz_off_bot")
6. Once created, BotFather will provide a **bot token**. It looks like: `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`
7. **IMPORTANT**: Save this token securely - you will need it later!

## Step 2: Create a Group Chat for Receiving Notifications

1. In Telegram, create a new group (click the pencil icon > "New Group")
2. Name the group (e.g., "Varikoz Off Appointments")
3. Add your newly created bot to this group
4. Add any staff members who should receive notifications

## Step 3: Get the Chat ID

1. Send any message to the group
2. Open a web browser and go to: `https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates` 
   (replace `[YOUR_BOT_TOKEN]` with the token you received from BotFather)
3. Look for `"chat":{"id":-123456789,` in the response (the number after "id" is your **chat ID**)
4. **IMPORTANT**: Save this chat ID - you will need it!

## Step 4: Update Your Website Code

1. Open the file `js/script.js` on your website
2. Look for these lines near the top of the file:
   ```javascript
   // Telegram bot settings - Replace with your actual bot token and chat ID
   const TELEGRAM_BOT_TOKEN = '6853813357:AAH0yTSFVB3gXTGDDZHJYQPqeqgmjrCL_aM'; // Replace with your bot token
   const TELEGRAM_CHAT_ID = '1051923866'; // Replace with your chat ID
   ```
3. Replace these values with your actual bot token and chat ID
4. Save the file and upload it to your website

## Step 5: Test the System

1. Go to your website and fill out the appointment form
2. Submit the form
3. Check your Telegram group - you should receive a formatted message with the appointment details

## Troubleshooting

- If messages aren't coming through, check the browser console for any errors
- Verify that your bot is still a member of the group
- Make sure the bot token and chat ID are correctly entered in the script file
- Ensure the bot has permission to read messages in the group

## Privacy & Security Notes

- The bot token gives control over your bot, so keep it secure
- Only add trusted staff members to the appointment notification group
- Consider creating a privacy policy to inform users that their data will be processed through Telegram
- The current implementation sends data over HTTPS, which provides security in transit

For further assistance, contact your web developer. 