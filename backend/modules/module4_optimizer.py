import pulp
from pulp import LpProblem, LpVariable, LpMinimize, LpStatus, lpSum, value
from backend.modules.module1_inputs import WeddingInput

CO2_PER_KM = 0.21          # kg CO2 per km (vendor vehicle travel)
BUDGET_BUFFER = 1.10       # allow 10% over stated budget as max hard limit

def calculate_baseline_co2(vendor_options: list[dict]) -> float:
    """
    Groups vendors by type, selects the cheapest option for each category (simulating 
    a typical unoptimized budget wedding process), and calculates total baseline CO2.
    """
    vendor_types = {}
    for v in vendor_options:
        t = v.get('type')
        if t not in vendor_types:
            vendor_types[t] = []
        vendor_types[t].append(v)
        
    baseline_co2 = 0.0
    for t, v_list in vendor_types.items():
        cheapest = min(v_list, key=lambda x: x.get('cost_inr', float('inf')))
        baseline_co2 += cheapest.get('distance_km', 0.0) * CO2_PER_KM * 2
        
    return baseline_co2

def build_vendor_lp(wedding_input: WeddingInput) -> dict:
    """
    Configures and solves a Linear Programming minimization problem to find 
    the most carbon-efficient combination of vendors within the buffered budget.
    """
    vendors = wedding_input.vendor_options
    
    vendor_types = {}
    for i, v in enumerate(vendors):
        t = v.get('type')
        if t not in vendor_types:
            vendor_types[t] = []
        vendor_types[t].append(i)
        
    problem = LpProblem("EcoVivah_VendorSelection", LpMinimize)
    
    x_vars = {i: LpVariable(f"x_{i}", cat='Binary') for i in range(len(vendors))}
    
    problem += lpSum([x_vars[i] * vendors[i]['distance_km'] * CO2_PER_KM * 2 for i in range(len(vendors))])
    
    for t, indices in vendor_types.items():
        problem += lpSum([x_vars[i] for i in indices]) == 1
        
    max_budget = wedding_input.budget_inr * BUDGET_BUFFER
    problem += lpSum([x_vars[i] * vendors[i]['cost_inr'] for i in range(len(vendors))]) <= max_budget
    
    problem.solve(pulp.PULP_CBC_CMD(msg=0))
    status = LpStatus[problem.status]
    
    if status != "Optimal":
        return {
            "status": status,
            "selected_vendors": [],
            "total_cost_inr": 0.0,
            "total_co2_kg": 0.0,
            "total_distance_km": 0.0,
            "baseline_co2_kg": 0.0,
            "co2_savings_kg": 0.0
        }
        
    selected_vendors = []
    total_cost_inr = 0.0
    total_co2_kg = 0.0
    total_distance_km = 0.0
    
    for i in range(len(vendors)):
        if value(x_vars[i]) == 1.0:
            v = vendors[i]
            selected_vendors.append(v)
            total_cost_inr += float(v['cost_inr'])
            total_distance_km += float(v['distance_km'])
            total_co2_kg += float(v['distance_km']) * CO2_PER_KM * 2
            
    baseline_co2_kg = calculate_baseline_co2(vendors)
    co2_savings_kg = baseline_co2_kg - total_co2_kg
    
    return {
        "status": status,
        "selected_vendors": selected_vendors,
        "total_cost_inr": total_cost_inr,
        "total_co2_kg": total_co2_kg,
        "total_distance_km": total_distance_km,
        "baseline_co2_kg": baseline_co2_kg,
        "co2_savings_kg": co2_savings_kg
    }

def print_optimizer_report(result: dict) -> None:
    """
    Outputs the LP Vendor optimization breakdown adhering to precise formatting.
    """
    status = result['status']
    print("============================================")
    print(" ECO-VIVAH AI — Vendor Optimization Report")
    print("============================================")
    print(f"Optimizer status : {status}")
    print("")
    
    if status == "Optimal":
        print("✅ Selected Vendors:")
        for v in result['selected_vendors']:
            eco = "Yes" if v.get('eco_certified', False) else "No"
            print(f"  {v['type'].capitalize():<8} : {v['name']} — {v['distance_km']:.2f} km | INR {v['cost_inr']:.2f} | Eco: {eco}")
            
        print("")
        print("--------------------------------------------")
        print(f"  Total cost       : INR {result['total_cost_inr']:.2f}")
        print(f"  Total distance   : {result['total_distance_km']:.2f} km")
        print(f"  Optimized CO2    : {result['total_co2_kg']:.2f} kg")
        print(f"  Baseline CO2     : {result['baseline_co2_kg']:.2f} kg")
        print(f"  CO2 saved        : {result['co2_savings_kg']:.2f} kg")
    print("============================================")
