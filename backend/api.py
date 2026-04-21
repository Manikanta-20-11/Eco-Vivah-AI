import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(override=True)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database.db_setup import init_db
from backend.modules.module1_inputs import WeddingInput, save_inputs, load_vendors
from backend.modules.module2_impact import generate_impact_report
from backend.modules.module3_ml import predict_food_quantity, train_model, MODEL_PATH
from backend.modules.module4_optimizer import build_vendor_lp
from backend.modules.module5_llm import get_gemini_recommendations, save_recommendations

app = FastAPI(title="Eco-Vivah AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

if not os.path.exists(MODEL_PATH):
    print(f"🔄 Model not found at {MODEL_PATH}. Training ML model on startup...")
    train_model()

class WeddingRequest(BaseModel):
    num_guests: int
    duration_days: int
    sub_events: list[str]
    budget_inr: float
    cultural_preferences: list[str]
    venue_location: str
    user_id: str = "anonymous" 

@app.get("/")
def root():
    return {"status": "ok", "message": "Eco-Vivah AI API is running"}

@app.get("/vendors")
def get_vendors():
    """Returns the static catalogue of eco and non-eco vendors."""
    vendors = load_vendors()
    return {"vendors": vendors}

@app.post("/analyze")
def analyze_wedding(request: WeddingRequest):
    """
    Ingests wedding parameters, queries intelligent subsystems (impact calculus, ML, LP),
    synthesizes an LLM recommendation report and returns the full composite data block.
    """
    try:
        from fastapi.responses import JSONResponse
        vendors = load_vendors()
        wedding_input = WeddingInput(
            num_guests=request.num_guests,
            duration_days=request.duration_days,
            sub_events=request.sub_events,
            budget_inr=request.budget_inr,
            cultural_preferences=request.cultural_preferences,
            venue_location=request.venue_location,
            vendor_options=vendors
        )
        
        wedding_id = save_inputs(wedding_input, request.user_id)
        impact = generate_impact_report(wedding_input, wedding_id)
        prediction = predict_food_quantity(wedding_input)
        optimizer_result = build_vendor_lp(wedding_input)
        recommendations = get_gemini_recommendations(wedding_input, impact, prediction, optimizer_result)
        save_recommendations(wedding_id, recommendations, impact, optimizer_result)
        
        return {
            "wedding_id": wedding_id,
            "impact": {
                "total_food_kg": impact.total_food_kg,
                "estimated_waste_kg": impact.estimated_waste_kg,
                "total_energy_kwh": impact.total_energy_kwh,
                "total_water_litres": impact.total_water_litres,
                "transport_emissions_kg_co2": impact.transport_emissions_kg_co2,
                "decoration_waste_kg": impact.decoration_waste_kg,
                "total_carbon_kg_co2": impact.total_carbon_kg_co2,
                "per_event_breakdown": impact.per_event_breakdown,
            },
            "ml_prediction": prediction,
            "optimizer": optimizer_result,
            "recommendations": recommendations,
        }
    except Exception as e:
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"error": str(e)})

class ChatRequest(BaseModel):
    message: str
    wedding_context: dict

@app.post("/chat")
def chat_with_plan(request: ChatRequest):
    """Chat with Gemini about the wedding eco plan."""
    try:
        from google import genai
        from dotenv import load_dotenv
        import os
        load_dotenv(override=True)

        ctx = request.wedding_context
        system_context = f"""You are Eco-Vivah AI, a friendly sustainability assistant for Indian weddings.

The user has already generated an eco plan with these details:
- Guests: {ctx.get('num_guests', 'N/A')}
- Duration: {ctx.get('duration_days', 'N/A')} days
- Location: {ctx.get('venue_location', 'N/A')}
- Budget: INR {ctx.get('budget_inr', 'N/A')}
- Sub-events: {ctx.get('sub_events', [])}
- Total carbon footprint: {ctx.get('total_carbon_kg_co2', 'N/A')} kg CO2
- Food savings from ML: {ctx.get('savings_kg', 'N/A')} kg ({ctx.get('savings_percent', 'N/A')}%)
- CO2 saved from vendor optimization: {ctx.get('co2_savings_kg', 'N/A')} kg
- Sustainability score: {ctx.get('sustainability_score', 'N/A')} / 100

Answer the user's question helpfully, concisely and in the context of their specific wedding plan.
Keep responses under 150 words. Be friendly and encouraging about eco choices."""

        client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_context}\n\nUser question: {request.message}"
        )
        return {"reply": response.text}
    # AFTER
    except Exception as e:
        error_str = str(e)
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            return {"reply": "⏳ Gemini quota exceeded for today. The chat will be available after 1:30 PM IST tomorrow when the quota resets. All other features are working perfectly!"}
        elif "API_KEY" in error_str or "api_key" in error_str:
            return {"reply": "🔑 API key not configured. Please check your .env file."}
        else:
            return {"reply": f"⚠️ Something went wrong. Please try again in a moment."}

@app.get("/history")
def get_history(user_id: str = "anonymous"):
    try:
        import json
        from backend.database.db_setup import get_connection
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT
                    w.id, w.num_guests, w.duration_days, w.sub_events,
                    w.budget_inr, w.venue_location, w.cultural_preferences,
                    w.created_at, r.sustainability_score, r.carbon_estimate_kg,
                    r.food_quantity_kg, r.sdg_tags, r.waste_reduction_tips
                FROM weddings w
                LEFT JOIN recommendations r ON w.id = r.wedding_id
                WHERE w.user_id = ?
                ORDER BY w.created_at DESC
                LIMIT 20
            ''', (user_id,))
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            results = []
            for row in rows:
                record = dict(zip(columns, row))
                for field in ['sub_events', 'cultural_preferences', 'sdg_tags', 'waste_reduction_tips']:
                    if record.get(field):
                        try:
                            record[field] = json.loads(record[field])
                        except:
                            pass
                results.append(record)
        return {"history": results}
    except Exception as e:
        return {"error": str(e), "history": []}
