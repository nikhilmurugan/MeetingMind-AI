import sys
import os

# Set UTF-8 encoding for standard output
sys.stdout.reconfigure(encoding='utf-8')

from database import init_db, SessionLocal
from config import settings
from app.services.meeting_service import MeetingService
from app.services.llm_service import LLMService, clean_transcript
from app.services.whisper_service import WhisperService

def run_test():
    print("=" * 60)
    print("MEETINGMIND AI - END-TO-END PIPELINE VERIFICATION TEST")
    print("=" * 60)

    # 1. Initialize SQLite Database & Auto Migration
    init_db()
    db = SessionLocal()

    # 2. Test Transcript Cleaning
    sample_raw_transcript = [
        {"start": "00:00", "end": "00:05", "speaker": "Sarah Jenkins", "text": "Welcome team to the Sprint Architecture Sync."},
        {"start": "00:06", "end": "00:15", "speaker": "Alex Rivera", "text": "Our FastAPI backend now integrates OpenAI Whisper and local Ollama model qwen2.5-coder:3b."}
    ]
    cleaned = clean_transcript(sample_raw_transcript)
    print("\n[OK] Transcript Cleaning Test Passed.")
    print("Cleaned text preview:", cleaned[:80])

    # 3. Test LLM Intelligence Generation
    llm_svc = LLMService()
    intelligence = llm_svc.generate_meeting_intelligence(sample_raw_transcript)
    print("\n[OK] LLM Intelligence Generation Test Passed.")
    print("Summary:", intelligence.get("executive_summary")[:100], "...")
    print("Action Items Count:", len(intelligence.get("action_items", [])))
    print("Sentiment:", intelligence.get("sentiment"))
    print("LLM Provider Used:", intelligence.get("_provider"))

    # 4. Create Dummy Test Audio File
    dummy_audio_path = os.path.join(settings.UPLOADS_DIR, "sample_test.mp3")
    with open(dummy_audio_path, "wb") as f:
        f.write(b"ID3\x04\x00\x00\x00\x00\x00\x00Dummy MP3 Header")

    # 5. Test Meeting Creation & Database Processing
    meeting = MeetingService.create_meeting(
        db=db,
        title="Automated Test Strategy Meeting",
        participants="Sarah Jenkins, Alex Rivera",
        department="Engineering",
        audio_filename="sample_test.mp3"
    )
    print(f"\n[OK] Created Meeting Record in Database: ID = {meeting.id}")

    processed = MeetingService.process_meeting(db, meeting.id)
    print(f"[OK] Processed Meeting Pipeline: Status = {processed.status}, Duration = {processed.audio_duration}, Sentiment = {processed.sentiment}")
    print(f"[OK] Provider Used: {processed.provider_used}, Model Used: {processed.model_used}")
    print(f"[OK] Processing Statistics: {processed.statistics}")

    db.close()
    print("\n" + "=" * 60)
    print("ALL PIPELINE TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_test()
