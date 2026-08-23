# 🧠 MeetingMind AI

### AI Meeting Intelligence Platform

Built for **Unthinkable Internship Assignment**

Developed by **Nikhil Murugan D P**

MeetingMind AI transforms meeting recordings into structured business intelligence using Speech-to-Text and Large Language Models.

---

## Features

* 🎙️ Whisper Speech-to-Text with timestamps
* 🧠 AI Executive Summary
* ✅ Action Item Extraction
* 📊 Speaker Participation Analytics
* ⚠️ Risk & Blocker Detection
* 📅 Next Step Checklist
* 📄 PDF / JSON / TXT Export
* 🌗 Light & Dark Theme
* 📱 Responsive Dashboard
* 🗂️ Meeting History

---

## Screenshots

### Landing Page

(Add image here)

### Dashboard

(Add image here)

### Meeting Analytics

(Add image here)

### History Page

(Add image here)

---

## System Architecture

(Add architecture image here)

---

## Tech Stack

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| Frontend       | React 18, Tailwind CSS, Vite               |
| Backend        | FastAPI, Python                            |
| Speech-to-Text | OpenAI Whisper                             |
| LLM            | OpenRouter (Free Models) + Ollama Fallback |
| Database       | SQLite                                     |
| PDF Export     | ReportLab                                  |

---

## Project Structure

backend/

frontend/

screenshots/

architecture/

demo-audio/

README.md

---

## Local Setup

### Backend

pip install -r requirements.txt

python -m uvicorn main:app --reload

### Frontend

npm install

npm run dev

---

## Environment Variables

Copy `.env.example` to `.env` and add your own OpenRouter API key.

---

## Demo Audio

A sample sprint planning meeting audio is included inside `demo-audio/`.

---

## Author

**Nikhil Murugan D P**

Built for the **Unthinkable Internship Assignment**.
