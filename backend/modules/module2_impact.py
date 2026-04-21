from typing import List, Dict, Any
from pydantic import BaseModel
from backend.modules.module1_inputs import WeddingInput

# Per guest per day averages
FOOD_KG_PER_GUEST_PER_MEAL = 0.45       # kg of food served per guest per meal
MEALS_PER_DAY = 3
FOOD_WASTE_RATE = 0.30                   # 30% of food gets wasted at Indian weddings

# Energy
ENERGY_KWH_PER_GUEST_PER_DAY = 1.2     # lighting, AC, sound per guest per day

# Water
WATER_LITRES_PER_GUEST_PER_DAY = 45.0  # drinking, washing, cooking

# Transport — average guest travel
AVG_GUEST_TRAVEL_KM = 25.0              # average round trip distance per guest
CAR_EMISSION_FACTOR = 0.21              # kg CO2 per km per car
GUESTS_PER_CAR = 3.0                    # average car occupancy

# Decoration
DECORATION_WASTE_KG_PER_EVENT = 12.0   # kg of waste per sub-event

# Carbon conversion
ENERGY_CARBON_FACTOR = 0.82            # kg CO2 per kWh (India grid average)

class ImpactReport(BaseModel):
    wedding_id: int
    num_guests: int
    duration_days: int
    
    # Food waste
    total_food_kg: float
    estimated_waste_kg: float
    
    # Energy
    total_energy_kwh: float
    
    # Water
    total_water_litres: float
    
    # Transport
    transport_emissions_kg_co2: float
    
    # Decoration & material waste
    decoration_waste_kg: float
    
    # Overall carbon footprint
    total_carbon_kg_co2: float
    
    # Breakdown by sub-event
    per_event_breakdown: List[Dict[str, Any]]

def calculate_food_impact(num_guests: int, duration_days: int) -> dict:
    """Calculates food kg and estimated waste."""
    total_food_kg = num_guests * FOOD_KG_PER_GUEST_PER_MEAL * MEALS_PER_DAY * duration_days
    estimated_waste_kg = total_food_kg * FOOD_WASTE_RATE
    return {
        "total_food_kg": total_food_kg,
        "estimated_waste_kg": estimated_waste_kg,
        "food_carbon_kg": 0.0
    }

def calculate_energy_impact(num_guests: int, duration_days: int) -> dict:
    """Calculates energy drawn and corresponding carbon."""
    total_energy_kwh = num_guests * ENERGY_KWH_PER_GUEST_PER_DAY * duration_days
    energy_carbon_kg = total_energy_kwh * ENERGY_CARBON_FACTOR
    return {
        "total_energy_kwh": total_energy_kwh,
        "energy_carbon_kg": energy_carbon_kg
    }

def calculate_water_impact(num_guests: int, duration_days: int) -> dict:
    """Calculates water consumption."""
    total_water_litres = num_guests * WATER_LITRES_PER_GUEST_PER_DAY * duration_days
    return {
        "total_water_litres": total_water_litres
    }

def calculate_transport_impact(num_guests: int) -> dict:
    """Calculates carbon transport emissions."""
    num_cars = num_guests / GUESTS_PER_CAR
    transport_emissions_kg_co2 = num_cars * AVG_GUEST_TRAVEL_KM * CAR_EMISSION_FACTOR
    return {
        "transport_emissions_kg_co2": transport_emissions_kg_co2
    }

def calculate_decoration_impact(sub_events: List[str]) -> dict:
    """Calculates material waste from decoration scaling on sub-events."""
    decoration_waste_kg = len(sub_events) * DECORATION_WASTE_KG_PER_EVENT
    return {
        "decoration_waste_kg": float(decoration_waste_kg)
    }

def calculate_per_event_breakdown(sub_events: List[str], num_guests: int) -> List[dict]:
    """Provides impact metrics broken down by event."""
    breakdown = []
    for event in sub_events:
        food_kg = num_guests * FOOD_KG_PER_GUEST_PER_MEAL * MEALS_PER_DAY
        waste_kg = food_kg * FOOD_WASTE_RATE
        energy_kwh = num_guests * ENERGY_KWH_PER_GUEST_PER_DAY
        decoration_waste_kg = DECORATION_WASTE_KG_PER_EVENT
        
        breakdown.append({
            "event": event,
            "food_kg": food_kg,
            "waste_kg": waste_kg,
            "energy_kwh": energy_kwh,
            "decoration_waste_kg": decoration_waste_kg
        })
    return breakdown

def generate_impact_report(wedding_input: WeddingInput, wedding_id: int) -> ImpactReport:
    """Aggregates all values into a single comprehensive ImpactReport."""
    food = calculate_food_impact(wedding_input.num_guests, wedding_input.duration_days)
    energy = calculate_energy_impact(wedding_input.num_guests, wedding_input.duration_days)
    water = calculate_water_impact(wedding_input.num_guests, wedding_input.duration_days)
    transport = calculate_transport_impact(wedding_input.num_guests)
    deco = calculate_decoration_impact(wedding_input.sub_events)
    breakdown = calculate_per_event_breakdown(wedding_input.sub_events, wedding_input.num_guests)
    
    total_carbon = energy['energy_carbon_kg'] + transport['transport_emissions_kg_co2']
    
    return ImpactReport(
        wedding_id=wedding_id,
        num_guests=wedding_input.num_guests,
        duration_days=wedding_input.duration_days,
        total_food_kg=food['total_food_kg'],
        estimated_waste_kg=food['estimated_waste_kg'],
        total_energy_kwh=energy['total_energy_kwh'],
        total_water_litres=water['total_water_litres'],
        transport_emissions_kg_co2=transport['transport_emissions_kg_co2'],
        decoration_waste_kg=deco['decoration_waste_kg'],
        total_carbon_kg_co2=total_carbon,
        per_event_breakdown=breakdown
    )

def print_impact_report(report: ImpactReport) -> None:
    """Prints the impact report identically to specifications."""
    energy_carbon_kg = report.total_energy_kwh * ENERGY_CARBON_FACTOR
    
    print("============================================")
    print(" ECO-VIVAH AI — Baseline Impact Report")
    print("============================================")
    print(f"Guests         : {report.num_guests}")
    print(f"Duration       : {report.duration_days} day(s)")
    print("")
    print("🍽  FOOD")
    print(f"  Total food needed : {report.total_food_kg:.2f} kg")
    print(f"  Estimated waste   : {report.estimated_waste_kg:.2f} kg (30% waste rate)")
    print("")
    print("⚡  ENERGY")
    print(f"  Total consumption : {report.total_energy_kwh:.2f} kWh")
    print(f"  Carbon from energy: {energy_carbon_kg:.2f} kg CO2")
    print("")
    print("💧  WATER")
    print(f"  Total usage       : {report.total_water_litres:.2f} litres")
    print("")
    print("🚗  TRANSPORT")
    print(f"  Guest travel CO2  : {report.transport_emissions_kg_co2:.2f} kg CO2")
    print("")
    print("🌿  DECORATION WASTE")
    print(f"  Material waste    : {report.decoration_waste_kg:.2f} kg")
    print("")
    print("--------------------------------------------")
    print(f"🌍  TOTAL CARBON FOOTPRINT : {report.total_carbon_kg_co2:.2f} kg CO2")
    print("")
    print("📋  PER EVENT BREAKDOWN:")
    for event_data in report.per_event_breakdown:
        print(f"  {event_data['event']} — Food: {event_data['food_kg']:.2f}kg | Waste: {event_data['waste_kg']:.2f}kg | Energy: {event_data['energy_kwh']:.2f}kWh")
    print("============================================")
