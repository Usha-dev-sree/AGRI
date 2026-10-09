def calculate_recommendation_scores(waste_type: str, quantity_kg: float, distance_km: float = 25.0) -> list:
    """
    Computes explainable multi-factor Waste-to-Value recommendation scores
    Equation:
    Score = (0.30 * Compatibility) + (0.20 * Demand) + (0.15 * Quantity) + (0.15 * Value) + (0.10 * Distance) + (0.10 * Carbon)
    """
    pathways = [
        {
            "name": "Commercial Composting & Bio-Fertilizer",
            "category": "Organic Fertilizer",
            "suitable_types": ["Tomato Residue", "Vegetable Residue", "Maize Residue", "Wheat Straw"],
            "base_demand": 85,
            "min_qty": 100,
            "avg_price_per_ton": 2800,
            "carbon_factor": 1.15
        },
        {
            "name": "Biomass Fuel & Briquetting",
            "category": "Renewable Bio-Energy",
            "suitable_types": ["Rice Straw", "Cotton Stalk", "Wheat Straw", "Maize Residue", "Sugarcane Bagasse", "Groundnut Residue"],
            "base_demand": 94,
            "min_qty": 300,
            "avg_price_per_ton": 5400,
            "carbon_factor": 1.55
        },
        {
            "name": "Biochar & Soil Carbon Sequestration",
            "category": "Carbon Removal & Soil Conditioner",
            "suitable_types": ["Cotton Stalk", "Rice Straw", "Sugarcane Bagasse", "Groundnut Residue"],
            "base_demand": 90,
            "min_qty": 250,
            "avg_price_per_ton": 8500,
            "carbon_factor": 2.10
        },
        {
            "name": "Bio-CNG & Compressed Biogas (CBG)",
            "category": "Green Gas Fuel",
            "suitable_types": ["Rice Straw", "Sugarcane Bagasse", "Maize Residue", "Tomato Residue"],
            "base_demand": 88,
            "min_qty": 500,
            "avg_price_per_ton": 4000,
            "carbon_factor": 1.70
        },
        {
            "name": "Animal Feed & Fodder Pelletizing",
            "category": "Livestock Feed",
            "suitable_types": ["Wheat Straw", "Groundnut Residue", "Maize Residue"],
            "base_demand": 82,
            "min_qty": 150,
            "avg_price_per_ton": 6000,
            "carbon_factor": 1.25
        }
    ]

    results = []
    for p in pathways:
        # Compatibility (30%)
        is_direct = any(waste_type.lower() in t.lower() or t.lower() in waste_type.lower() for t in p["suitable_types"])
        compat = 96.0 if is_direct else 42.0
        
        # Demand (20%)
        demand = float(p["base_demand"])
        
        # Quantity Suitability (15%)
        qty_score = 92.0 if quantity_kg >= p["min_qty"] else max(30.0, (quantity_kg / p["min_qty"]) * 85.0)
        
        # Economic Value Score (15%)
        value_score = min(98.0, (p["avg_price_per_ton"] / 9000.0) * 100.0)
        
        # Distance Proximity (10%)
        dist_score = max(20.0, 100.0 - (distance_km * 0.8))
        
        # Environmental Carbon Score (10%)
        carbon_score = min(99.0, p["carbon_factor"] * 46.0)
        
        total = (
            (0.30 * compat) +
            (0.20 * demand) +
            (0.15 * qty_score) +
            (0.15 * value_score) +
            (0.10 * dist_score) +
            (0.10 * carbon_score)
        )
        
        est_total_val = round((quantity_kg / 1000.0) * p["avg_price_per_ton"])
        carbon_offset_kg = round(quantity_kg * p["carbon_factor"])
        
        results.append({
            "pathwayName": p["name"],
            "category": p["category"],
            "score": round(total),
            "estimatedValueTotal": est_total_val,
            "estimatedValuePerTon": p["avg_price_per_ton"],
            "carbonOffsetKg": carbon_offset_kg,
            "scoreFactors": {
                "wasteCompatibility": round(compat),
                "processorDemand": round(demand),
                "quantitySuitability": round(qty_score),
                "estimatedValue": round(value_score),
                "distanceSuitability": round(dist_score),
                "environmentalScore": round(carbon_score)
            }
        })
        
    results.sort(key=lambda x: x["score"], reverse=True)
    return results
