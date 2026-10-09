from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

from classifier import classifier
from recommendation_engine import calculate_recommendation_scores
from clustering import cluster_farm_waste

app = FastAPI(
    title="AgriValue AI - Python AI Microservice",
    description="Dedicated AI microservice for agricultural waste image classification, explainable recommendations, and spatial logistics clustering.",
    version="1.0.0"
)

# Enable CORS for React frontend & Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "AgriValue AI - Python FastAPI Microservice",
        "engine": "MobileNetV3-PyTorch",
        "supported_classes": 7
    }

@app.post("/api/ai/classify")
async def classify_image(
    file: UploadFile = File(...),
    crop_hint: Optional[str] = Form(None)
):
    try:
        image_bytes = await file.read()
        filename = file.filename or "waste_scan.jpg"
        result = classifier.predict(image_bytes, filename=filename)
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image classification error: {str(e)}")

class RecommendationRequest(BaseModel):
    waste_type: str
    quantity_kg: float
    distance_km: Optional[float] = 25.0

@app.post("/api/ai/recommend")
def recommend_pathways(req: RecommendationRequest):
    try:
        ranked_pathways = calculate_recommendation_scores(
            waste_type=req.waste_type,
            quantity_kg=req.quantity_kg,
            distance_km=req.distance_km or 25.0
        )
        return {
            "success": True,
            "waste_type": req.waste_type,
            "quantity_kg": req.quantity_kg,
            "recommendations": ranked_pathways
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation scoring error: {str(e)}")

class FarmPoint(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    quantity: float

class ClusterRequest(BaseModel):
    farms: List[FarmPoint]
    clusters: Optional[int] = 3

@app.post("/api/ai/cluster")
def perform_clustering(req: ClusterRequest):
    farms_list = [f.dict() for f in req.farms]
    res = cluster_farm_waste(farms_list, req.clusters or 3)
    return res

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
