# Local ChatGPT using Ollama + Gemma + MERN Stack

This is a local AI chat application that mimics ChatGPT behavior. It uses:
- `Next.js` for the frontend
- `Node.js + Express` for the backend
- `MongoDB` for chat storage
- `Ollama` with `gemma:1b` as the LLM
- Local streaming responses and chat history

---

## 🛠️ Setup Instructions

# Installed and Start Ollama

# Install Ollama
https://ollama.com/download

# Pull the Gemma model
ollama pull gemma:1b

# Run the model
ollama run gemma:1b

---

# Setup DB

# Use MongoDB Atlas
Create a free account: https://www.mongodb.com/cloud/atlas

Create a cluster and database

Copy the connection string and paste in MONGO_URI in database setup : mongodb+srv://<username>:<password>@cluster0.mongodb.net/chatgpt

# Run Backend

cd server
npm install
node server.js or nodemon server.js
# Runs on http://localhost:5000

# Run Frontend

cd client
npm install
npm run dev
# Runs on http://localhost:3000

---

##  Tech Stack

- **Frontend**: React (Next.js)
- **Backend**: Node.js + Express
- **Database**: MongoDB (with Mongoose)
- **LLM**: Ollama + `gemma:1b`
- **Styling**: Tailwind CSS

# Features
New Chat creation

View and select past chats

`Delete` or `rename` chats

Streamed bot responses from Ollama (gemma:1b)

Stores all conversations in MongoDB

# Assumptions & Constraints
Assumes `Ollama` is running locally with gemma:1b model loaded.

No user authentication for simplicity.

Focus is on `local LLM` interaction and chat storage only.
