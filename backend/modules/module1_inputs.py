import json
import os
from typing import List, Dict, Any
from pydantic import BaseModel, Field

# Assuming this module runs in the larger project context
import backend.database.db_setup as db_setup

VENDORS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'sample_vendors.json')

class WeddingInput(BaseModel):
    num_guests: int = Field(..., ge=10, le=10000)
    duration_days: int = Field(..., ge=1, le=7)
    sub_events: List[str]
    budget_inr: float = Field(..., gt=0)
    cultural_preferences: List[str]
    venue_location: str
    vendor_options: List[Dict[str, Any]]

def load_vendors() -> List[Dict[str, Any]]:
    """
    Reads and returns vendor data from the sample_vendors.json file.
    
    Returns:
        list[dict]: A list of vendor dictionaries.
    """
    if not os.path.exists(VENDORS_FILE):
        return []
    with open(VENDORS_FILE, 'r', encoding='utf-8') as f:
         return json.load(f)

def collect_inputs_from_cli() -> WeddingInput:
    """
    Interactively collects wedding details from the user via the CLI,
    validates the inputs, and returns a WeddingInput Pydantic model instance.
    
    Returns:
        WeddingInput: The validated user input including loaded vendor options.
    """
    num_guests = None
    while num_guests is None:
        try:
            val = int(input("Enter number of guests (10–10000): "))
            if 10 <= val <= 10000:
                num_guests = val
            else:
                print("Invalid input: Number of guests must be between 10 and 10000.")
        except ValueError:
            print("Invalid input: Please enter an integer.")

    duration_days = None
    while duration_days is None:
        try:
            val = int(input("Enter wedding duration in days (1–7): "))
            if 1 <= val <= 7:
                duration_days = val
            else:
                print("Invalid input: Duration must be between 1 and 7 days.")
        except ValueError:
            print("Invalid input: Please enter an integer.")

    sub_events = None
    while sub_events is None:
        val = input("Enter sub-events separated by commas (e.g. Haldi,Sangeet,Reception): ")
        if val.strip():
            sub_events = [e.strip() for e in val.split(',') if e.strip()]
        else:
            print("Invalid input: Sub-events cannot be empty.")

    budget_inr = None
    while budget_inr is None:
        try:
            val = float(input("Enter total budget in INR: "))
            if val > 0:
                budget_inr = val
            else:
                print("Invalid input: Budget must be greater than 0.")
        except ValueError:
            print("Invalid input: Please enter a numeric value.")

    cultural_preferences = None
    while cultural_preferences is None:
        val = input("Enter cultural preferences separated by commas (e.g. vegetarian,no plastic): ")
        if val.strip():
            cultural_preferences = [p.strip() for p in val.split(',') if p.strip()]
        else:
            print("Invalid input: Cultural preferences cannot be empty.")

    venue_location = None
    while venue_location is None:
        val = input("Enter venue location (city name): ")
        if val.strip():
            venue_location = val.strip()
        else:
            print("Invalid input: Venue location cannot be empty.")

    vendors = load_vendors()

    wedding_input = WeddingInput(
        num_guests=num_guests,
        duration_days=duration_days,
        sub_events=sub_events,
        budget_inr=budget_inr,
        cultural_preferences=cultural_preferences,
        venue_location=venue_location,
        vendor_options=vendors
    )
    return wedding_input

def save_inputs(wedding_input: WeddingInput, user_id: str = "anonymous") -> int:
    """
    Converts the validated WeddingInput model to a dictionary and saves it to the database.
    
    Args:
        wedding_input (WeddingInput): The user provided wedding data.
        
    Returns:
        int: The auto-generated database ID of the saved wedding setup.
    """
    data = wedding_input.model_dump()
    data['user_id'] = user_id
    return db_setup.save_wedding(data)
