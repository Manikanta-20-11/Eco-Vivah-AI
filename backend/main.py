import sys
import os
from dotenv import load_dotenv
# Load .env variables at the very top
load_dotenv(override=True)
# Ensure the parent directory is in the PYTHONPATH so we can import 'backend'
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))



from backend.database.db_setup import init_db
from backend.modules.module1_inputs import collect_inputs_from_cli, save_inputs
from backend.modules.module2_impact import generate_impact_report, print_impact_report
from backend.modules.module3_ml import predict_food_quantity, print_ml_report, train_model
from backend.modules.module4_optimizer import build_vendor_lp, print_optimizer_report
from backend.modules.module5_llm import get_gemini_recommendations, print_gemini_report, save_recommendations
from backend.api import app

def main() -> None:
    # Initialize the database and table structures
    init_db()

    # Interactively collect user input
    wedding_input = collect_inputs_from_cli()

    # Save details into the database
    wedding_id = save_inputs(wedding_input)

    # Print confirmation summary
    sub_events_str = ", ".join(wedding_input.sub_events)
    preferences_str = ", ".join(wedding_input.cultural_preferences)
    
    print("============================================")
    print(" ECO-VIVAH AI — Wedding Input Summary")
    print("============================================")
    print(f"Guests        : {wedding_input.num_guests}")
    print(f"Duration      : {wedding_input.duration_days} day(s)")
    print(f"Sub-events    : {sub_events_str}")
    print(f"Budget        : INR {wedding_input.budget_inr}")
    print(f"Location      : {wedding_input.venue_location}")
    print(f"Preferences   : {preferences_str}")
    print(f"Vendors loaded: {len(wedding_input.vendor_options)}")
    print("--------------------------------------------")
    print(f"Planning ID   : {wedding_id}")
    print("✅ Data saved successfully. Ready for Phase 1 Step 2.")
    print("============================================")

    # Module 2 Impact Report
    report = generate_impact_report(wedding_input, wedding_id)
    print_impact_report(report)
    
    # Phase 2 Step 1 — ML Prediction
    if not os.path.exists("data/food_model.pkl"):
        print("🔄 No model found. Training now...")
        train_model()
    prediction = predict_food_quantity(wedding_input)
    print_ml_report(prediction)

    # Phase 2 Step 2 — LP Optimizer
    optimizer_result = build_vendor_lp(wedding_input)
    print_optimizer_report(optimizer_result)

    # Phase 3 — Gemini AI Layer
    print("\n🤖 Generating AI recommendations via Gemini...")
    recommendations = get_gemini_recommendations(
        wedding_input, report, prediction, optimizer_result
    )
    print_gemini_report(recommendations, wedding_input)
    save_recommendations(wedding_id, recommendations, report, optimizer_result)

    print("✅ Phase 3 Complete. AI recommendations generated. Ready for dashboard.")

if __name__ == "__main__":
    main()
