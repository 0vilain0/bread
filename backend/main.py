"""
BREAD Backend - FastAPI Server for AI-Powered Career Pivot Platform
Handles roadmap generation and quiz creation using Google Gemini or OpenAI
"""

import json
import logging
import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, OpenAIError
from pydantic import BaseModel, Field

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ============================================================================
# ENVIRONMENT & CONFIGURATION
# ============================================================================

BASE_DIR = Path(__file__).resolve().parent
dotenv_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=dotenv_path)

AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini").lower()  # "gemini" or "openai"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Validate API keys
if AI_PROVIDER == "gemini" and not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not set in environment variables")
if AI_PROVIDER == "openai" and not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not set in environment variables")

# Initialize AI clients
if AI_PROVIDER == "gemini":
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
elif AI_PROVIDER == "openai":
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

logger.info(f"Initialized AI provider: {AI_PROVIDER}")

# ============================================================================
# PYDANTIC MODELS - REQUEST/RESPONSE SCHEMAS
# ============================================================================


class GenerateRoadmapRequest(BaseModel):
    """Request model for roadmap generation endpoint"""

    current_job: str = Field(
        ..., min_length=1, max_length=100, description="Current job title"
    )
    target_job: str = Field(
        ..., min_length=1, max_length=100, description="Target career goal"
    )
    hours_per_day: float = Field(
        default=2.0, ge=0.5, le=24, description="Daily learning hours"
    )


class RoadmapResource(BaseModel):
    """Resource recommendation within a roadmap step"""

    source: str = Field(
        ..., description="Resource source (YouTube, Coursera, etc.)"
    )
    keyword: str = Field(
        ..., description="Search keyword for the resource"
    )


class RoadmapStep(BaseModel):
    """Individual step in the career roadmap"""

    step: int = Field(..., ge=1, description="Step number")
    title: str = Field(..., description="Step title")
    duration: str = Field(..., description="Estimated duration (e.g., '4 weeks')")
    skills: list[str] = Field(..., description="Core skills to master")
    resources: list[RoadmapResource] = Field(
        ..., description="Curated learning resources"
    )


class GenerateRoadmapResponse(BaseModel):
    """Response model for roadmap generation endpoint"""

    similarity_score: int = Field(
        ..., ge=0, le=100, description="Skill alignment percentage"
    )
    analysis_summary: str = Field(
        ..., description="AI-generated analysis of the transition"
    )
    roadmap: list[RoadmapStep] = Field(
        ..., min_items=1, description="Career transition steps"
    )


class GenerateQuizRequest(BaseModel):
    """Request model for quiz generation endpoint"""

    topic_name: str = Field(
        ..., min_length=1, max_length=200, description="Topic for quiz questions"
    )


class QuizOption(BaseModel):
    """A single multiple-choice option"""

    text: str = Field(..., description="Option text")


class QuizQuestion(BaseModel):
    """Single quiz question"""

    id: int = Field(..., ge=1, description="Question ID")
    question: str = Field(..., description="Question text")
    options: list[str] = Field(
        ..., min_items=4, max_items=4, description="Four answer options"
    )
    correct_answer: str = Field(
        ..., description="Correct answer (must match one of the options)"
    )
    explanation: str = Field(
        ..., description="Explanation in supportive BREAD mentoring tone"
    )


# ============================================================================
# FASTAPI APP INITIALIZATION
# ============================================================================

app = FastAPI(
    title="BREAD Backend API",
    description="AI-Powered Career Pivot Platform - Roadmap & Quiz Generation",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"CORS configured for: {FRONTEND_URL}")

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================


def extract_json_from_response(text: str) -> dict:
    """
    Extract JSON from AI response, handling markdown code blocks.
    
    Args:
        text: Raw text response from AI
        
    Returns:
        Parsed JSON dictionary
        
    Raises:
        ValueError: If JSON extraction fails
    """
    text = text.strip()

    # Remove common markdown code fences and language hints
    if "```json" in text:
        start = text.find("```json") + len("```json")
        end = text.find("```", start)
        if end != -1:
            text = text[start:end].strip()
    elif "```" in text:
        start = text.find("```") + len("```")
        end = text.find("```", start)
        if end != -1:
            text = text[start:end].strip()

    # Sometimes the model prefixes with 'json' or other words — find the first '{' or '['
    if not text.startswith("{") and not text.startswith("["):
        brace_positions = [pos for pos in (text.find("{"), text.find("[")) if pos != -1]
        if brace_positions:
            text = text[min(brace_positions):]

    # Try multiple parsing strategies for robustness
    parse_errors: list[str] = []

    # 1) Direct parse
    try:
        return json.loads(text)
    except Exception as e:
        parse_errors.append(f"direct: {e}")

    # 2) Sometimes the response is a quoted JSON string — strip surrounding quotes
    cleaned = text
    if (cleaned.startswith('"') and cleaned.endswith('"')) or (
        cleaned.startswith("'") and cleaned.endswith("'")
    ):
        cleaned = cleaned[1:-1]
    try:
        return json.loads(cleaned)
    except Exception as e:
        parse_errors.append(f"stripped-quotes: {e}")

    # 3) Fallback: extract substring between first { and last }
    try:
        first = text.find("{")
        last = text.rfind("}")
        if first != -1 and last != -1 and last > first:
            candidate = text[first : last + 1]
            return json.loads(candidate)
    except Exception as e:
        parse_errors.append(f"brace-substring: {e}")

    logger.error(f"JSON parsing failed. Attempts: {parse_errors}")
    logger.error(f"Raw response (truncated): {text[:400]}")
    raise ValueError(f"Failed to parse AI response as JSON: attempts={parse_errors}")


def validate_roadmap_json(data: dict) -> GenerateRoadmapResponse:
    """
    Validate and convert dictionary to GenerateRoadmapResponse.
    
    Args:
        data: Dictionary to validate
        
    Returns:
        Valid GenerateRoadmapResponse
        
    Raises:
        ValueError: If validation fails
    """
    try:
        return GenerateRoadmapResponse(**data)
    except Exception as e:
        logger.error(f"Roadmap validation failed: {e}")
        raise ValueError(f"Invalid roadmap structure: {str(e)}")


def validate_quiz_json(data: list) -> list[QuizQuestion]:
    """
    Validate and convert list to QuizQuestion array.
    
    Args:
        data: List of question dictionaries
        
    Returns:
        List of valid QuizQuestion objects
        
    Raises:
        ValueError: If validation fails
    """
    try:
        questions = []
        for q in data:
            questions.append(QuizQuestion(**q))
        return questions
    except Exception as e:
        logger.error(f"Quiz validation failed: {e}")
        raise ValueError(f"Invalid quiz structure: {str(e)}")


# ============================================================================
# AI GENERATION FUNCTIONS - GEMINI
# ============================================================================


def generate_roadmap_with_gemini(
    current_job: str, target_job: str, hours_per_day: float
) -> GenerateRoadmapResponse:
    """
    Generate career roadmap using Google Gemini with structured output.
    
    Args:
        current_job: Current job title
        target_job: Target career goal
        hours_per_day: Daily learning commitment
        
    Returns:
        Structured roadmap response
        
    Raises:
        Exception: If API call fails
    """
    logger.info(
        f"Generating roadmap (Gemini): {current_job} -> {target_job}"
    )

    prompt = f"""
You are an expert career coach. Generate a detailed career transition roadmap.

Current Job: {current_job}
Target Job: {target_job}
Daily Commitment: {hours_per_day} hours

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{{
  "similarity_score": <0-100 integer - percentage of overlapping skills>,
  "analysis_summary": "<2-3 sentence analysis of the transition, highlighting advantages and key obstacles>",
  "roadmap": [
    {{
      "step": 1,
      "title": "<specific phase title>",
      "duration": "<estimated duration e.g. '4 weeks'>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "resources": [
        {{"source": "YouTube", "keyword": "<best search keyword>"}},
        {{"source": "Coursera", "keyword": "<best free course search>"}},
        {{"source": "Documentation", "keyword": "<documentation keyword>"}}
      ]
    }}
  ]
}}

Generate exactly 4 steps. Each step should build upon the previous.
"""

    try:
        response = gemini_model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=2000,
            ),
        )

        if not response.text:
            raise ValueError("Empty response from Gemini API")

        logger.info("Roadmap generated successfully (Gemini)")
        data = extract_json_from_response(response.text)
        return validate_roadmap_json(data)

    except Exception as e:
        logger.error(f"Gemini roadmap generation failed: {e}")
        raise


def generate_quiz_with_gemini(topic_name: str) -> list[QuizQuestion]:
    """
    Generate quiz questions using Google Gemini with structured output.
    
    Args:
        topic_name: Topic for quiz generation
        
    Returns:
        List of quiz questions
        
    Raises:
        Exception: If API call fails
    """
    logger.info(f"Generating quiz (Gemini): {topic_name}")

    prompt = f"""
You are an expert educator creating a knowledge assessment quiz for career transition learners.

Topic: {topic_name}

Generate exactly 3 multiple-choice questions. Return ONLY a valid JSON array (no markdown, no explanation):
[
  {{
    "id": 1,
    "question": "<the question text>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "correct_answer": "<exact string matching the correct option>",
    "explanation": "<supportive, warm explanation of why this is correct, in BREAD mentoring tone>"
  }}
]

Requirements:
- Each option must be unique and plausible
- The correct_answer must EXACTLY match one of the options
- Explanations should be encouraging and supportive (50-100 words)
- Questions should test practical understanding, not memorization
"""

    try:
        response = gemini_model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=1500,
            ),
        )

        if not response.text:
            raise ValueError("Empty response from Gemini API")

        logger.info("Quiz generated successfully (Gemini)")
        data = extract_json_from_response(response.text)
        if not isinstance(data, list):
            raise ValueError("Quiz response must be a JSON array")
        return validate_quiz_json(data)

    except Exception as e:
        logger.error(f"Gemini quiz generation failed: {e}")
        raise


# ============================================================================
# AI GENERATION FUNCTIONS - OPENAI
# ============================================================================


def generate_roadmap_with_openai(
    current_job: str, target_job: str, hours_per_day: float
) -> GenerateRoadmapResponse:
    """
    Generate career roadmap using OpenAI GPT-4o-Mini with structured output.
    
    Args:
        current_job: Current job title
        target_job: Target career goal
        hours_per_day: Daily learning commitment
        
    Returns:
        Structured roadmap response
        
    Raises:
        Exception: If API call fails
    """
    logger.info(
        f"Generating roadmap (OpenAI): {current_job} -> {target_job}"
    )

    prompt = f"""
You are an expert career coach. Generate a detailed career transition roadmap.

Current Job: {current_job}
Target Job: {target_job}
Daily Commitment: {hours_per_day} hours

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{{
  "similarity_score": <0-100 integer - percentage of overlapping skills>,
  "analysis_summary": "<2-3 sentence analysis of the transition, highlighting advantages and key obstacles>",
  "roadmap": [
    {{
      "step": 1,
      "title": "<specific phase title>",
      "duration": "<estimated duration e.g. '4 weeks'>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "resources": [
        {{"source": "YouTube", "keyword": "<best search keyword>"}},
        {{"source": "Coursera", "keyword": "<best free course search>"}},
        {{"source": "Documentation", "keyword": "<documentation keyword>"}}
      ]
    }}
  ]
}}

Generate exactly 4 steps. Each step should build upon the previous.
"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2000,
        )

        response_text = response.choices[0].message.content
        if not response_text:
            raise ValueError("Empty response from OpenAI API")

        logger.info("Roadmap generated successfully (OpenAI)")
        data = extract_json_from_response(response_text)
        return validate_roadmap_json(data)

    except OpenAIError as e:
        logger.error(f"OpenAI roadmap generation failed: {e}")
        raise
    except Exception as e:
        logger.error(f"OpenAI roadmap generation failed: {e}")
        raise


def generate_quiz_with_openai(topic_name: str) -> list[QuizQuestion]:
    """
    Generate quiz questions using OpenAI GPT-4o-Mini with structured output.
    
    Args:
        topic_name: Topic for quiz generation
        
    Returns:
        List of quiz questions
        
    Raises:
        Exception: If API call fails
    """
    logger.info(f"Generating quiz (OpenAI): {topic_name}")

    prompt = f"""
You are an expert educator creating a knowledge assessment quiz for career transition learners.

Topic: {topic_name}

Generate exactly 3 multiple-choice questions. Return ONLY a valid JSON array (no markdown, no explanation):
[
  {{
    "id": 1,
    "question": "<the question text>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "correct_answer": "<exact string matching the correct option>",
    "explanation": "<supportive, warm explanation of why this is correct, in BREAD mentoring tone>"
  }}
]

Requirements:
- Each option must be unique and plausible
- The correct_answer must EXACTLY match one of the options
- Explanations should be encouraging and supportive (50-100 words)
- Questions should test practical understanding, not memorization
"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500,
        )

        response_text = response.choices[0].message.content
        if not response_text:
            raise ValueError("Empty response from OpenAI API")

        logger.info("Quiz generated successfully (OpenAI)")
        data = extract_json_from_response(response_text)
        if not isinstance(data, list):
            raise ValueError("Quiz response must be a JSON array")
        return validate_quiz_json(data)

    except OpenAIError as e:
        logger.error(f"OpenAI quiz generation failed: {e}")
        raise
    except Exception as e:
        logger.error(f"OpenAI quiz generation failed: {e}")
        raise


# ============================================================================
# WRAPPER FUNCTIONS - SELECT AI PROVIDER
# ============================================================================


def generate_roadmap(
    current_job: str, target_job: str, hours_per_day: float
) -> GenerateRoadmapResponse:
    """
    Generate roadmap using configured AI provider.
    
    Args:
        current_job: Current job title
        target_job: Target career goal
        hours_per_day: Daily learning hours
        
    Returns:
        Structured roadmap response
    """
    if AI_PROVIDER == "gemini":
        return generate_roadmap_with_gemini(current_job, target_job, hours_per_day)
    else:
        return generate_roadmap_with_openai(current_job, target_job, hours_per_day)


def generate_quiz(topic_name: str) -> list[QuizQuestion]:
    """
    Generate quiz using configured AI provider.
    
    Args:
        topic_name: Topic for quiz questions
        
    Returns:
        List of quiz questions
    """
    if AI_PROVIDER == "gemini":
        return generate_quiz_with_gemini(topic_name)
    else:
        return generate_quiz_with_openai(topic_name)


# ============================================================================
# API ENDPOINTS
# ============================================================================


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "ai_provider": AI_PROVIDER,
        "message": "BREAD Backend is running",
    }


@app.post("/api/generate-roadmap", response_model=GenerateRoadmapResponse)
async def endpoint_generate_roadmap(request: GenerateRoadmapRequest):
    """
    Generate personalized career transition roadmap.
    
    Args:
        request: Roadmap generation request with current job, target job, and commitment hours
        
    Returns:
        GenerateRoadmapResponse with skill alignment score, analysis, and 4-step roadmap
        
    Raises:
        HTTPException: If generation fails
    """
    try:
        logger.info(f"Roadmap request: {request.current_job} -> {request.target_job}")

        roadmap = generate_roadmap(
            current_job=request.current_job,
            target_job=request.target_job,
            hours_per_day=request.hours_per_day,
        )

        logger.info(f"Roadmap generated with score: {roadmap.similarity_score}")
        return roadmap

    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Roadmap generation error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate roadmap. Please try again.",
        )


@app.post("/api/generate-quiz", response_model=list[QuizQuestion])
async def endpoint_generate_quiz(request: GenerateQuizRequest):
    """
    Generate interactive quiz questions for a specific topic.
    
    Args:
        request: Quiz generation request with topic name
        
    Returns:
        List of 3 QuizQuestion objects with options, answers, and explanations
        
    Raises:
        HTTPException: If generation fails
    """
    try:
        logger.info(f"Quiz request for topic: {request.topic_name}")

        questions = generate_quiz(topic_name=request.topic_name)

        logger.info(f"Quiz generated with {len(questions)} questions")
        return questions

    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate quiz. Please try again.",
        )


# ============================================================================
# STARTUP & SHUTDOWN EVENTS
# ============================================================================


@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("=" * 60)
    logger.info("BREAD Backend Starting")
    logger.info(f"AI Provider: {AI_PROVIDER}")
    logger.info(f"Frontend URL: {FRONTEND_URL}")
    logger.info("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Log shutdown information"""
    logger.info("BREAD Backend Shutdown")


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
