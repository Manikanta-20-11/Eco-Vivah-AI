import os
import json
from google import genai
from dotenv import load_dotenv
from backend.modules.module1_inputs import WeddingInput
from backend.modules.module2_impact import ImpactReport

load_dotenv(override=True)
MODEL_NAME = "gemini-2.5-flash"

def build_prompt(wedding_input: WeddingInput, impact: ImpactReport, ml_prediction: dict, optimizer_result: dict) -> str:
    """Builds the Gemini prompt string populated with all contextual wedding data constraints."""
    sub_events_str = ", ".join(wedding_input.sub_events)
    prefs_str = ", ".join(wedding_input.cultural_preferences)
    
    vendors_str = ", ".join([v['name'] for v in optimizer_result.get('selected_vendors', [])])
    
    return f"""You are an expert sustainability consultant specializing in eco-friendly Indian wedding planning.

A wedding planner has provided the following data for an upcoming Indian wedding. Analyze it and provide a detailed eco-friendly recommendation report.

--- WEDDING DETAILS ---
Guests         : {wedding_input.num_guests}
Duration       : {wedding_input.duration_days} days
Sub-events     : {sub_events_str}
Budget         : INR {wedding_input.budget_inr}
Location       : {wedding_input.venue_location}
Preferences    : {prefs_str}

--- BASELINE ENVIRONMENTAL IMPACT ---
Total food needed      : {impact.total_food_kg:.2f} kg
Estimated food waste   : {impact.estimated_waste_kg:.2f} kg (30% waste rate)
Total energy usage     : {impact.total_energy_kwh:.2f} kWh
Total carbon footprint : {impact.total_carbon_kg_co2:.2f} kg CO2
Water usage            : {impact.total_water_litres:.2f} litres
Transport emissions    : {impact.transport_emissions_kg_co2:.2f} kg CO2
Decoration waste       : {impact.decoration_waste_kg:.2f} kg

--- ML FOOD OPTIMIZATION ---
Baseline food estimate : {ml_prediction.get('baseline_food_kg', 0):.2f} kg
ML predicted quantity  : {ml_prediction.get('predicted_food_kg', 0):.2f} kg
Potential food savings : {ml_prediction.get('savings_kg', 0):.2f} kg ({ml_prediction.get('savings_percent', 0)}%)

--- VENDOR OPTIMIZATION (LINEAR PROGRAMMING) ---
Selected vendors       : {vendors_str}
Total vendor cost      : INR {optimizer_result.get('total_cost_inr', 0):.2f}
Optimized travel CO2   : {optimizer_result.get('total_co2_kg', 0):.2f} kg
CO2 saved vs baseline  : {optimizer_result.get('co2_savings_kg', 0):.2f} kg

--- YOUR TASK ---
Based on all the above data, provide your response as a valid JSON object with EXACTLY this structure and nothing else — no markdown, no explanation outside the JSON:

{{
  "sustainability_score": <integer 0-100 based on eco choices>,
  "score_explanation": "<2 sentence explanation of the score>",
  "sdg_tags": ["SDG 12", "SDG 13"],
  "waste_reduction_strategies": [
    "<strategy 1 specific to this wedding>",
    "<strategy 2>",
    "<strategy 3>",
    "<strategy 4>",
    "<strategy 5>"
  ],
  "vendor_recommendations": [
    "<specific vendor advice 1>",
    "<specific vendor advice 2>"
  ],
  "energy_recommendations": [
    "<energy saving tip 1 specific to this wedding>",
    "<energy saving tip 2>"
  ],
  "cultural_sustainability_tips": [
    "<tip that respects Indian wedding traditions while being eco-friendly>",
    "<tip 2>"
  ],
  "estimated_impact_summary": "<3 sentence paragraph summarizing the total environmental impact and improvements made>"
}}"""

def get_gemini_recommendations(wedding_input: WeddingInput, impact: ImpactReport, ml_prediction: dict, optimizer_result: dict) -> dict:
    """Invokes Gemini 2.0 Flash API with analytical context to retrieve eco-recommendations."""
    load_dotenv(override=True)
    try:
        prompt = build_prompt(wedding_input, impact, ml_prediction, optimizer_result)

        client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        text = response.text.strip()

        # Clean markdown fences if present
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        return json.loads(text.strip())
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {}

def print_gemini_report(recommendations: dict, wedding_input: WeddingInput) -> None:
    """Formats and prints the parsed Gemini JSON response."""
    if not recommendations:
        print("⚠️  Gemini recommendations unavailable. Check your API key.")
        return

    print("============================================")
    print(" ECO-VIVAH AI — Gemini Recommendations")
    print("============================================")
    print(f"🌱 SUSTAINABILITY SCORE : {recommendations.get('sustainability_score', 'N/A')} / 100")
    print(f"   {recommendations.get('score_explanation', '')}")
    print()

    sdg_tags = recommendations.get('sdg_tags', [])
    print(f"🏷  SDG TAGS : {', '.join(sdg_tags)}")
    print()

    print("🗑  WASTE REDUCTION STRATEGIES:")
    for i, strat in enumerate(recommendations.get('waste_reduction_strategies', []), 1):
        print(f"   {i}. {strat}")
    print()

    print("🏪  VENDOR RECOMMENDATIONS:")
    for rec in recommendations.get('vendor_recommendations', []):
        print(f"   • {rec}")
    print()

    print("⚡  ENERGY RECOMMENDATIONS:")
    for tip in recommendations.get('energy_recommendations', []):
        print(f"   • {tip}")
    print()

    print("🪔  CULTURAL SUSTAINABILITY TIPS:")
    for tip in recommendations.get('cultural_sustainability_tips', []):
        print(f"   • {tip}")
    print()

    print("📊  IMPACT SUMMARY:")
    print(f"   {recommendations.get('estimated_impact_summary', '')}")
    print()
    print("============================================")

def save_recommendations(wedding_id: int, recommendations: dict, impact: ImpactReport, optimizer_result: dict) -> None:
    """Consolidates impact analytics and LLM insights into the SQLite backend."""
    from backend.database.db_setup import get_connection
    import json

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO recommendations (
                wedding_id, food_quantity_kg, waste_reduction_tips, vendor_suggestions,
                carbon_estimate_kg, sustainability_score, sdg_tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            wedding_id,
            impact.total_food_kg,
            json.dumps(recommendations.get("waste_reduction_strategies", [])),
            json.dumps(recommendations.get("vendor_recommendations", [])),
            impact.total_carbon_kg_co2,
            recommendations.get("sustainability_score", 0),
            json.dumps(recommendations.get("sdg_tags", []))
        ))
        conn.commit()
    print("✅ Recommendations saved to database.")