#!/usr/bin/env python3
"""
Test script for BREAD Backend API
Run this to verify both endpoints are working correctly
"""

import json
import subprocess
import time
from typing import Any

import requests

# Configuration
BASE_URL = "http://localhost:8000"
TIMEOUT = 30

# Test data
ROADMAP_REQUEST = {
    "current_job": "Accountant",
    "target_job": "Data Analyst",
    "hours_per_day": 2.5,
}

QUIZ_REQUEST = {"topic_name": "SQL Fundamentals"}


def print_header(text: str) -> None:
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f"🍞 {text}")
    print("=" * 60)


def print_success(text: str) -> None:
    """Print success message"""
    print(f"✅ {text}")


def print_error(text: str) -> None:
    """Print error message"""
    print(f"❌ {text}")


def print_json(data: Any) -> None:
    """Pretty print JSON"""
    print(json.dumps(data, indent=2))


def test_health() -> bool:
    """Test health check endpoint"""
    print_header("Testing Health Check")

    try:
        response = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        response.raise_for_status()

        data = response.json()
        print_json(data)
        print_success(f"Health check passed - AI Provider: {data.get('ai_provider')}")
        return True

    except requests.exceptions.RequestException as e:
        print_error(f"Health check failed: {e}")
        return False


def test_roadmap() -> bool:
    """Test roadmap generation endpoint"""
    print_header("Testing Roadmap Generation")

    print(f"Request: {json.dumps(ROADMAP_REQUEST, indent=2)}")

    try:
        response = requests.post(
            f"{BASE_URL}/api/generate-roadmap",
            json=ROADMAP_REQUEST,
            timeout=TIMEOUT,
        )
        response.raise_for_status()

        data = response.json()

        # Validate response structure
        required_fields = ["similarity_score", "analysis_summary", "roadmap"]
        for field in required_fields:
            if field not in data:
                print_error(f"Missing field: {field}")
                return False

        # Check roadmap structure
        if len(data["roadmap"]) != 4:
            print_error(
                f"Expected 4 steps, got {len(data['roadmap'])}"
            )
            return False

        for step in data["roadmap"]:
            if "step" not in step or "title" not in step or "skills" not in step:
                print_error("Invalid step structure")
                return False

        # Display results
        print("\nResponse:")
        print(f"Similarity Score: {data['similarity_score']}%")
        print(f"Analysis Summary: {data['analysis_summary'][:100]}...")
        print(f"Roadmap Steps: {len(data['roadmap'])}")

        for i, step in enumerate(data["roadmap"], 1):
            print(f"\n  Step {i}: {step['title']}")
            print(f"    Duration: {step['duration']}")
            print(f"    Skills: {', '.join(step['skills'][:2])}...")

        print_success("Roadmap generation successful")
        return True

    except requests.exceptions.RequestException as e:
        print_error(f"Roadmap request failed: {e}")
        return False
    except Exception as e:
        print_error(f"Roadmap validation failed: {e}")
        return False


def test_quiz() -> bool:
    """Test quiz generation endpoint"""
    print_header("Testing Quiz Generation")

    print(f"Request: {json.dumps(QUIZ_REQUEST, indent=2)}")

    try:
        response = requests.post(
            f"{BASE_URL}/api/generate-quiz",
            json=QUIZ_REQUEST,
            timeout=TIMEOUT,
        )
        response.raise_for_status()

        data = response.json()

        # Validate response structure
        if not isinstance(data, list):
            print_error("Response must be a JSON array")
            return False

        if len(data) != 3:
            print_error(f"Expected 3 questions, got {len(data)}")
            return False

        # Check question structure
        for q in data:
            required_q_fields = [
                "id",
                "question",
                "options",
                "correct_answer",
                "explanation",
            ]
            for field in required_q_fields:
                if field not in q:
                    print_error(f"Missing field in question: {field}")
                    return False

            if len(q["options"]) != 4:
                print_error(
                    f"Expected 4 options, got {len(q['options'])}"
                )
                return False

            if q["correct_answer"] not in q["options"]:
                print_error(
                    f"correct_answer must match one of the options"
                )
                return False

        # Display results
        print("\nResponse:")
        for i, q in enumerate(data, 1):
            print(f"\nQuestion {i}:")
            print(f"  {q['question']}")
            for j, opt in enumerate(q["options"], 1):
                marker = "✓" if opt == q["correct_answer"] else " "
                print(f"    {marker} {chr(64+j)}) {opt}")

        print_success("Quiz generation successful")
        return True

    except requests.exceptions.RequestException as e:
        print_error(f"Quiz request failed: {e}")
        return False
    except Exception as e:
        print_error(f"Quiz validation failed: {e}")
        return False


def main():
    """Run all tests"""
    print_header("BREAD Backend Test Suite")
    print(f"Testing: {BASE_URL}")

    # Check if server is running
    print("\nWaiting for server to be ready...")
    for attempt in range(5):
        try:
            requests.get(f"{BASE_URL}/health", timeout=5)
            break
        except requests.exceptions.RequestException:
            if attempt < 4:
                print(f"Attempt {attempt + 1}/5... retrying in 2 seconds")
                time.sleep(2)
            else:
                print_error(
                    f"Cannot connect to server at {BASE_URL}"
                )
                print("Make sure the backend is running: python main.py")
                return False

    # Run tests
    tests = [
        ("Health Check", test_health),
        ("Roadmap Generation", test_roadmap),
        ("Quiz Generation", test_quiz),
    ]

    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print_error(f"Test {name} crashed: {e}")
            results.append((name, False))

    # Summary
    print_header("Test Summary")
    passed = sum(1 for _, result in results if result)
    total = len(results)

    for name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {name}")

    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print_success("All tests passed! Backend is ready.")
        return True
    else:
        print_error("Some tests failed. Check the output above.")
        return False


if __name__ == "__main__":
    import sys

    success = main()
    sys.exit(0 if success else 1)
