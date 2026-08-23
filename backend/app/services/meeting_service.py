import os
import uuid
import time
import datetime
from sqlalchemy.orm import Session
from app.models.meeting import Meeting
from app.services.audio_service import AudioService
from app.services.whisper_service import WhisperService
from app.services.llm_service import LLMService
from config import settings

class MeetingService:
    @staticmethod
    def create_meeting(db: Session, title: str, participants: str, department: str, audio_filename: str) -> Meeting:
        meeting_id = f"mtg_{uuid.uuid4().hex[:10]}"
        
        meeting = Meeting(
            id=meeting_id,
            meeting_title=title,
            participants=participants,
            department=department,
            audio_filename=audio_filename,
            audio_duration="Pending",
            status="uploaded"
        )
        db.add(meeting)
        db.commit()
        db.refresh(meeting)
        return meeting

    @staticmethod
    def process_meeting(db: Session, meeting_id: str) -> Meeting:
        """
        Full AI Processing Pipeline with Logging:
        Meeting Started -> FFmpeg Found -> Whisper Loaded -> Transcript Generated
        -> Using Provider -> Summary Generated -> Meeting Saved -> Processing Completed.
        """
        print("Meeting Started.")
        start_time = time.time()
        
        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if not meeting:
            raise ValueError(f"Meeting with ID '{meeting_id}' not found.")

        audio_path = os.path.join(settings.UPLOADS_DIR, meeting.audio_filename)
        
        # Step 1: Whisper Transcription
        whisper_svc = WhisperService(model_name="base")
        stt_result = whisper_svc.transcribe_audio(audio_path)
        
        transcript_segments = stt_result.get("transcript", [])
        language = stt_result.get("language", "en")
        audio_duration = stt_result.get("duration_formatted", "30:00")
        duration_seconds = stt_result.get("duration", 1800)

        # Step 2: LLM Provider Router
        llm_svc = LLMService()
        intelligence = llm_svc.generate_meeting_intelligence(transcript_segments)

        provider_used = intelligence.get("_provider", "OpenRouter (qwen3-8b)")
        model_used = intelligence.get("_model", settings.OPENROUTER_MODEL)

        # Step 3: Statistics Calculation
        word_count = sum(len(seg.get("text", "").split()) for seg in transcript_segments)
        transcript_char_len = sum(len(seg.get("text", "")) for seg in transcript_segments)
        summary = intelligence.get("executive_summary", "")
        summary_char_len = len(summary)
        action_items = intelligence.get("action_items", [])
        decisions = intelligence.get("key_decisions", [])
        risks = intelligence.get("risks", [])
        next_steps = intelligence.get("next_steps", [])
        keywords = intelligence.get("keywords", [])
        sentiment = intelligence.get("sentiment", "Positive")

        elapsed_sec = round(time.time() - start_time, 2)
        processing_time_str = f"{elapsed_sec} sec"

        statistics = {
            "duration_seconds": duration_seconds,
            "word_count": word_count,
            "speaking_segments": len(transcript_segments),
            "transcript_length": transcript_char_len,
            "summary_length": summary_char_len,
            "action_item_count": len(action_items),
            "decision_count": len(decisions),
            "risk_count": len(risks),
            "keywords_count": len(keywords),
            "processing_time_sec": elapsed_sec
        }

        # Step 4: Save to Database
        meeting.audio_duration = audio_duration
        meeting.language = language
        meeting.transcript = transcript_segments
        meeting.summary = summary
        meeting.action_items = action_items
        meeting.decisions = decisions
        meeting.risks = risks
        meeting.next_steps = next_steps
        meeting.keywords = keywords
        meeting.sentiment = sentiment
        meeting.processing_time = processing_time_str
        meeting.provider_used = provider_used
        meeting.model_used = model_used
        meeting.statistics = statistics
        meeting.status = "completed"
        meeting.updated_at = datetime.datetime.utcnow()

        db.commit()
        db.refresh(meeting)
        print("Meeting Saved.")
        print(f"Processing Completed. (Time taken: {processing_time_str})")

        return meeting

    @staticmethod
    def get_all_meetings(db: Session):
        return db.query(Meeting).order_by(Meeting.created_at.desc()).all()

    @staticmethod
    def get_meeting_by_id(db: Session, meeting_id: str) -> Meeting:
        return db.query(Meeting).filter(Meeting.id == meeting_id).first()

    @staticmethod
    def delete_meeting(db: Session, meeting_id: str) -> bool:
        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if not meeting:
            return False
        
        AudioService.delete_audio_file(meeting.audio_filename)
        db.delete(meeting)
        db.commit()
        return True
