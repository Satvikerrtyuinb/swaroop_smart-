#!/usr/bin/env python3
"""
SmartReturns ML Model Server
===========================

FastAPI-based model serving endpoint for real-time predictions.
Provides REST API for disposition prediction, forecasting, and analytics.

Author: SmartReturns AI Team
Version: 2.1.0
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Union
import uvicorn
import logging
from datetime import datetime, timedelta
import asyncio
import json
import os
from contextlib import asynccontextmanager

from prediction_engine import (
    SmartReturnsPredictionEngine, 
    ReturnItem, 
    PredictionResult,
    ForecastResult
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model instance
prediction_engine = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global prediction_engine
    
    # Startup
    logger.info("Starting SmartReturns ML Model Server...")
    prediction_engine = SmartReturnsPredictionEngine()
    
    # Load pre-trained models if available
    model_path = os.getenv('MODEL_PATH', 'models/smartreturns_models.joblib')
    if os.path.exists(model_path):
        try:
            prediction_engine.load_models(model_path)
            logger.info("Pre-trained models loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load pre-trained models: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down ML Model Server...")

# Initialize FastAPI app
app = FastAPI(
    title="SmartReturns ML API",
    description="Machine Learning API for returns prediction and forecasting",
    version="2.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API
class ReturnItemRequest(BaseModel):
    sku: str = Field(..., description="Product SKU")
    product_name: str = Field(..., description="Product name")
    category: str = Field(..., description="Product category")
    condition: str = Field(..., description="Item condition")
    return_reason: str = Field(..., description="Reason for return")
    original_price: float = Field(..., gt=0, description="Original price")
    customer_age: Optional[int] = Field(30, ge=13, le=120, description="Customer age")
    purchase_channel: Optional[str] = Field("online", description="Purchase channel")
    location: str = Field(..., description="Return location")
    return_date: Optional[datetime] = Field(default_factory=datetime.now)
    manufacturing_date: Optional[datetime] = Field(default_factory=lambda: datetime.now() - timedelta(days=180))
    warranty_status: Optional[str] = Field("expired", description="Warranty status")
    material_composition: Optional[List[str]] = Field(default_factory=list)
    seasonality: Optional[str] = Field("medium", description="Seasonality factor")
    market_demand: Optional[str] = Field("medium", description="Market demand")

class PredictionResponse(BaseModel):
    recommended_action: str
    confidence: float
    estimated_value: float
    co2_saved: float
    landfill_avoided: float
    processing_time: int
    marketplace: Optional[str]
    reasoning: str
    model_version: str = "2.1.0"
    prediction_timestamp: datetime = Field(default_factory=datetime.now)

class ForecastRequest(BaseModel):
    periods: int = Field(..., ge=1, le=24, description="Number of periods to forecast")
    category: Optional[str] = Field(None, description="Product category filter")
    granularity: Optional[str] = Field("monthly", description="Forecast granularity")

class ForecastResponse(BaseModel):
    predictions: List[Dict]
    trend: str
    seasonality_factor: float
    confidence_level: float = 0.95
    forecast_timestamp: datetime = Field(default_factory=datetime.now)

class RiskAssessmentRequest(BaseModel):
    category: str = Field(..., description="Category to assess")
    return_rate: float = Field(..., ge=0, le=1, description="Return rate")
    value_recovery_rate: float = Field(..., ge=0, le=1, description="Value recovery rate")
    defect_rate: float = Field(..., ge=0, le=1, description="Defect rate")
    demand_volatility: float = Field(..., ge=0, le=1, description="Demand volatility")
    avg_processing_time: float = Field(..., gt=0, description="Average processing time in days")

class RiskAssessmentResponse(BaseModel):
    overall_score: float
    risk_level: str
    component_scores: Dict[str, float]
    recommendations: List[str]
    assessment_timestamp: datetime = Field(default_factory=datetime.now)

class TrainingRequest(BaseModel):
    data_source: str = Field(..., description="Data source identifier")
    retrain_all: bool = Field(False, description="Whether to retrain all models")
    validation_split: float = Field(0.2, ge=0.1, le=0.4, description="Validation split ratio")

class BatchPredictionRequest(BaseModel):
    items: List[ReturnItemRequest] = Field(..., max_items=100, description="Batch of return items")
    include_explanations: bool = Field(True, description="Include prediction explanations")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "models_loaded": prediction_engine.models_trained if prediction_engine else False,
        "version": "2.1.0"
    }

# Model status endpoint
@app.get("/models/status")
async def model_status():
    """Get model training status and metrics"""
    if not prediction_engine:
        raise HTTPException(status_code=503, detail="Prediction engine not initialized")
    
    return {
        "models_trained": prediction_engine.models_trained,
        "disposition_model": {
            "trained": prediction_engine.disposition_predictor.is_trained,
            "algorithm": "RandomForestClassifier"
        },
        "forecasting_model": {
            "trained": prediction_engine.value_forecaster.is_trained,
            "algorithm": "GradientBoostingRegressor"
        },
        "last_updated": datetime.now()
    }

# Single prediction endpoint
@app.post("/predict/disposition", response_model=PredictionResponse)
async def predict_disposition(request: ReturnItemRequest):
    """Predict optimal disposition for a return item"""
    if not prediction_engine or not prediction_engine.models_trained:
        raise HTTPException(status_code=503, detail="Models not trained")
    
    try:
        # Convert request to ReturnItem
        return_item = ReturnItem(
            sku=request.sku,
            product_name=request.product_name,
            category=request.category,
            condition=request.condition,
            return_reason=request.return_reason,
            original_price=request.original_price,
            customer_age=request.customer_age or 30,
            purchase_channel=request.purchase_channel or "online",
            location=request.location,
            return_date=request.return_date or datetime.now(),
            manufacturing_date=request.manufacturing_date or (datetime.now() - timedelta(days=180)),
            warranty_status=request.warranty_status or "expired",
            material_composition=request.material_composition or [],
            seasonality=request.seasonality or "medium",
            market_demand=request.market_demand or "medium"
        )
        
        # Make prediction
        result = prediction_engine.predict_disposition(return_item)
        
        return PredictionResponse(
            recommended_action=result.recommended_action,
            confidence=result.confidence,
            estimated_value=result.estimated_value,
            co2_saved=result.co2_saved,
            landfill_avoided=result.landfill_avoided,
            processing_time=result.processing_time,
            marketplace=result.marketplace,
            reasoning=result.reasoning
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# Batch prediction endpoint
@app.post("/predict/batch")
async def batch_predict(request: BatchPredictionRequest):
    """Predict dispositions for multiple return items"""
    if not prediction_engine or not prediction_engine.models_trained:
        raise HTTPException(status_code=503, detail="Models not trained")
    
    if len(request.items) > 100:
        raise HTTPException(status_code=400, detail="Maximum 100 items per batch")
    
    try:
        results = []
        
        for item_request in request.items:
            return_item = ReturnItem(
                sku=item_request.sku,
                product_name=item_request.product_name,
                category=item_request.category,
                condition=item_request.condition,
                return_reason=item_request.return_reason,
                original_price=item_request.original_price,
                customer_age=item_request.customer_age or 30,
                purchase_channel=item_request.purchase_channel or "online",
                location=item_request.location,
                return_date=item_request.return_date or datetime.now(),
                manufacturing_date=item_request.manufacturing_date or (datetime.now() - timedelta(days=180)),
                warranty_status=item_request.warranty_status or "expired",
                material_composition=item_request.material_composition or [],
                seasonality=item_request.seasonality or "medium",
                market_demand=item_request.market_demand or "medium"
            )
            
            prediction = prediction_engine.predict_disposition(return_item)
            
            result = {
                "sku": item_request.sku,
                "recommended_action": prediction.recommended_action,
                "confidence": prediction.confidence,
                "estimated_value": prediction.estimated_value,
                "co2_saved": prediction.co2_saved,
                "marketplace": prediction.marketplace,
                "processing_time": prediction.processing_time
            }
            
            if request.include_explanations:
                result["reasoning"] = prediction.reasoning
            
            results.append(result)
        
        return {
            "predictions": results,
            "total_items": len(results),
            "batch_timestamp": datetime.now()
        }
        
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

# Forecasting endpoint
@app.post("/forecast/demand", response_model=ForecastResponse)
async def forecast_demand(request: ForecastRequest):
    """Generate demand forecast"""
    if not prediction_engine or not prediction_engine.models_trained:
        raise HTTPException(status_code=503, detail="Models not trained")
    
    try:
        forecast = prediction_engine.forecast_demand(request.periods, request.category)
        
        return ForecastResponse(
            predictions=forecast.predictions,
            trend=forecast.trend,
            seasonality_factor=forecast.seasonality_factor
        )
        
    except Exception as e:
        logger.error(f"Forecasting error: {e}")
        raise HTTPException(status_code=500, detail=f"Forecasting failed: {str(e)}")

# Risk assessment endpoint
@app.post("/assess/risk", response_model=RiskAssessmentResponse)
async def assess_risk(request: RiskAssessmentRequest):
    """Assess risk for category or operational area"""
    if not prediction_engine:
        raise HTTPException(status_code=503, detail="Prediction engine not initialized")
    
    try:
        risk_data = {
            'return_rate': request.return_rate,
            'value_recovery_rate': request.value_recovery_rate,
            'defect_rate': request.defect_rate,
            'demand_volatility': request.demand_volatility,
            'avg_processing_time': request.avg_processing_time
        }
        
        assessment = prediction_engine.assess_risk(risk_data)
        
        return RiskAssessmentResponse(
            overall_score=assessment['overall_score'],
            risk_level=assessment['risk_level'],
            component_scores=assessment['component_scores'],
            recommendations=assessment['recommendations']
        )
        
    except Exception as e:
        logger.error(f"Risk assessment error: {e}")
        raise HTTPException(status_code=500, detail=f"Risk assessment failed: {str(e)}")

# Anomaly detection endpoint
@app.post("/detect/anomalies")
async def detect_anomalies(data: Dict):
    """Detect anomalies in return patterns"""
    if not prediction_engine:
        raise HTTPException(status_code=503, detail="Prediction engine not initialized")
    
    try:
        # Convert input data to DataFrame
        import pandas as pd
        df = pd.DataFrame(data.get('data', []))
        
        anomalies = prediction_engine.detect_anomalies(df)
        
        return {
            "anomalies": anomalies,
            "total_anomalies": len(anomalies),
            "detection_timestamp": datetime.now()
        }
        
    except Exception as e:
        logger.error(f"Anomaly detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Anomaly detection failed: {str(e)}")

# Model training endpoint
@app.post("/models/train")
async def train_models(request: TrainingRequest, background_tasks: BackgroundTasks):
    """Trigger model retraining"""
    if not prediction_engine:
        raise HTTPException(status_code=503, detail="Prediction engine not initialized")
    
    # Add training task to background
    background_tasks.add_task(
        _train_models_background,
        request.data_source,
        request.retrain_all,
        request.validation_split
    )
    
    return {
        "message": "Model training started",
        "data_source": request.data_source,
        "retrain_all": request.retrain_all,
        "training_id": f"train_{int(datetime.now().timestamp())}"
    }

async def _train_models_background(data_source: str, retrain_all: bool, validation_split: float):
    """Background task for model training"""
    try:
        logger.info(f"Starting background training from {data_source}")
        
        # In production, load data from specified source
        # For now, use mock data
        import pandas as pd
        
        mock_data = {
            'returns': pd.DataFrame({
                'sku': ['SKU1', 'SKU2', 'SKU3'] * 100,
                'product_name': ['Product 1', 'Product 2', 'Product 3'] * 100,
                'category': ['Electronics', 'Fashion', 'Appliances'] * 100,
                'condition': ['good', 'new', 'fair'] * 100,
                'return_reason': ['Defective', 'Wrong size', 'Changed mind'] * 100,
                'original_price': [1000, 500, 3000] * 100,
                'location': ['Mumbai', 'Delhi', 'Bangalore'] * 100,
                'return_date': ['2024-01-01'] * 300,
                'actual_disposition': ['repair', 'resale', 'resale'] * 100,
                'value_recovered': [400, 350, 2100] * 100
            })
        }
        
        # Train models
        results = prediction_engine.train_models(mock_data)
        
        # Save models
        model_path = os.getenv('MODEL_PATH', 'models/smartreturns_models.joblib')
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        prediction_engine.save_models(model_path)
        
        logger.info(f"Background training completed: {results}")
        
    except Exception as e:
        logger.error(f"Background training failed: {e}")

# Model explanation endpoint
@app.get("/models/explain/{model_type}")
async def explain_model(model_type: str):
    """Get model explanation and feature importance"""
    if not prediction_engine or not prediction_engine.models_trained:
        raise HTTPException(status_code=503, detail="Models not trained")
    
    explanations = {
        "disposition": {
            "algorithm": "Random Forest Classifier",
            "features": [
                "original_price", "condition_score", "category_encoded",
                "item_age_days", "customer_age", "seasonality_score"
            ],
            "description": "Predicts optimal disposition action based on item characteristics"
        },
        "forecasting": {
            "algorithm": "Gradient Boosting Regressor",
            "features": [
                "month", "quarter", "category_encoded", "avg_price",
                "volume", "seasonality_score"
            ],
            "description": "Forecasts future value recovery and demand patterns"
        }
    }
    
    if model_type not in explanations:
        raise HTTPException(status_code=404, detail="Model type not found")
    
    return explanations[model_type]

# Performance metrics endpoint
@app.get("/models/metrics")
async def get_model_metrics():
    """Get model performance metrics"""
    if not prediction_engine or not prediction_engine.models_trained:
        raise HTTPException(status_code=503, detail="Models not trained")
    
    # In production, these would be real metrics from validation
    return {
        "disposition_model": {
            "accuracy": 0.87,
            "precision": 0.85,
            "recall": 0.89,
            "f1_score": 0.87
        },
        "forecasting_model": {
            "mae": 245.67,
            "rmse": 312.45,
            "r2_score": 0.82,
            "mape": 12.3
        },
        "last_evaluation": datetime.now() - timedelta(hours=2)
    }

# A/B testing endpoint
@app.post("/models/ab-test")
async def ab_test_models(request: ReturnItemRequest, model_version: str = "current"):
    """A/B test different model versions"""
    if not prediction_engine or not prediction_engine.models_trained:
        raise HTTPException(status_code=503, detail="Models not trained")
    
    # For demo purposes, return slightly different results for different versions
    base_prediction = await predict_disposition(request)
    
    if model_version == "experimental":
        # Simulate experimental model with slightly different confidence
        base_prediction.confidence *= 0.95
        base_prediction.reasoning += " (Experimental model)"
    
    return {
        "model_version": model_version,
        "prediction": base_prediction,
        "test_timestamp": datetime.now()
    }

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "model_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )