#!/usr/bin/env python3
"""
SmartReturns Prediction and Forecasting Engine
==============================================

This module provides machine learning models and algorithms for:
- Return disposition prediction (resale, repair, recycle, donate)
- Value recovery forecasting
- Demand forecasting
- Hub capacity optimization
- Environmental impact prediction
- Risk assessment and anomaly detection

Author: SmartReturns AI Team
Version: 2.1.0
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional, Union
import joblib
import logging
from dataclasses import dataclass
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ReturnItem:
    """Data structure for return item"""
    sku: str
    product_name: str
    category: str
    condition: str
    return_reason: str
    original_price: float
    customer_age: int
    purchase_channel: str
    location: str
    return_date: datetime
    manufacturing_date: datetime
    warranty_status: str
    material_composition: List[str]
    seasonality: str
    market_demand: str

@dataclass
class PredictionResult:
    """Prediction result structure"""
    recommended_action: str
    confidence: float
    estimated_value: float
    co2_saved: float
    landfill_avoided: float
    processing_time: int
    marketplace: Optional[str]
    reasoning: str

@dataclass
class ForecastResult:
    """Forecast result structure"""
    predictions: List[Dict]
    confidence_intervals: List[Tuple[float, float]]
    trend: str
    seasonality_factor: float
    accuracy_metrics: Dict[str, float]

class FeatureEngineering:
    """Feature engineering utilities for ML models"""
    
    def __init__(self):
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.fitted = False
    
    def create_features(self, return_item: ReturnItem) -> Dict[str, float]:
        """Create engineered features from return item"""
        features = {}
        
        # Basic features
        features['original_price'] = return_item.original_price
        features['customer_age'] = return_item.customer_age
        
        # Categorical encodings
        features['condition_score'] = self._encode_condition(return_item.condition)
        features['category_encoded'] = self._encode_category(return_item.category)
        features['channel_encoded'] = self._encode_channel(return_item.purchase_channel)
        
        # Temporal features
        features['item_age_days'] = (return_item.return_date - return_item.manufacturing_date).days
        features['return_month'] = return_item.return_date.month
        features['return_quarter'] = (return_item.return_date.month - 1) // 3 + 1
        features['is_weekend'] = float(return_item.return_date.weekday() >= 5)
        
        # Price-based features
        features['price_category'] = self._get_price_category(return_item.original_price)
        features['price_per_age'] = return_item.original_price / max(features['item_age_days'], 1)
        
        # Market features
        features['seasonality_score'] = self._encode_seasonality(return_item.seasonality)
        features['demand_score'] = self._encode_demand(return_item.market_demand)
        
        # Warranty features
        features['warranty_active'] = float(return_item.warranty_status == 'active')
        
        # Material composition features
        features['material_count'] = len(return_item.material_composition)
        features['has_electronics'] = float('Electronics' in return_item.material_composition)
        features['has_plastic'] = float('Plastic' in return_item.material_composition)
        features['has_metal'] = float('Metal' in return_item.material_composition)
        
        # Return reason analysis
        features['reason_length'] = len(return_item.return_reason)
        features['reason_sentiment'] = self._analyze_reason_sentiment(return_item.return_reason)
        
        return features
    
    def _encode_condition(self, condition: str) -> float:
        """Encode condition to numerical score"""
        condition_map = {
            'new': 1.0,
            'lightly-used': 0.8,
            'good': 0.6,
            'fair': 0.4,
            'poor': 0.2,
            'defective': 0.0
        }
        return condition_map.get(condition.lower(), 0.5)
    
    def _encode_category(self, category: str) -> float:
        """Encode category to numerical value"""
        category_map = {
            'Electronics': 0.9,
            'Appliances': 0.8,
            'Fashion': 0.6,
            'Home & Kitchen': 0.5,
            'Books': 0.3,
            'Toys': 0.4
        }
        return category_map.get(category, 0.5)
    
    def _encode_channel(self, channel: str) -> float:
        """Encode purchase channel"""
        channel_map = {
            'online': 0.8,
            'mobile-app': 0.9,
            'store': 0.6
        }
        return channel_map.get(channel.lower(), 0.7)
    
    def _get_price_category(self, price: float) -> float:
        """Categorize price into ranges"""
        if price < 500:
            return 0.2
        elif price < 2000:
            return 0.4
        elif price < 10000:
            return 0.6
        elif price < 50000:
            return 0.8
        else:
            return 1.0
    
    def _encode_seasonality(self, seasonality: str) -> float:
        """Encode seasonality factor"""
        seasonality_map = {
            'high': 1.0,
            'medium': 0.6,
            'low': 0.3
        }
        return seasonality_map.get(seasonality.lower(), 0.6)
    
    def _encode_demand(self, demand: str) -> float:
        """Encode market demand"""
        demand_map = {
            'high': 1.0,
            'medium': 0.6,
            'low': 0.3
        }
        return demand_map.get(demand.lower(), 0.6)
    
    def _analyze_reason_sentiment(self, reason: str) -> float:
        """Simple sentiment analysis of return reason"""
        negative_words = ['defective', 'broken', 'damaged', 'poor', 'bad', 'terrible', 'awful']
        neutral_words = ['size', 'color', 'changed mind', 'duplicate', 'wrong']
        
        reason_lower = reason.lower()
        
        negative_count = sum(1 for word in negative_words if word in reason_lower)
        neutral_count = sum(1 for word in neutral_words if word in reason_lower)
        
        if negative_count > 0:
            return 0.2
        elif neutral_count > 0:
            return 0.6
        else:
            return 0.8

class DispositionPredictor:
    """ML model for predicting optimal disposition action"""
    
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        self.feature_engineer = FeatureEngineering()
        self.label_encoder = LabelEncoder()
        self.is_trained = False
        
    def train(self, training_data: List[Tuple[ReturnItem, str]]) -> Dict[str, float]:
        """Train the disposition prediction model"""
        logger.info(f"Training disposition model with {len(training_data)} samples")
        
        # Prepare features and labels
        X = []
        y = []
        
        for return_item, actual_action in training_data:
            features = self.feature_engineer.create_features(return_item)
            X.append(list(features.values()))
            y.append(actual_action)
        
        X = np.array(X)
        y = np.array(y)
        
        # Encode labels
        y_encoded = self.label_encoder.fit_transform(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
        )
        
        # Scale features
        X_train_scaled = self.feature_engineer.scaler.fit_transform(X_train)
        X_test_scaled = self.feature_engineer.scaler.transform(X_test)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=5)
        
        self.is_trained = True
        self.feature_engineer.fitted = True
        
        metrics = {
            'accuracy': accuracy,
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std()
        }
        
        logger.info(f"Model trained. Accuracy: {accuracy:.3f}, CV Score: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
        return metrics
    
    def predict(self, return_item: ReturnItem) -> PredictionResult:
        """Predict optimal disposition for return item"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Extract features
        features = self.feature_engineer.create_features(return_item)
        X = np.array([list(features.values())])
        X_scaled = self.feature_engineer.scaler.transform(X)
        
        # Get prediction and probabilities
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        
        # Decode prediction
        recommended_action = self.label_encoder.inverse_transform([prediction])[0]
        confidence = float(np.max(probabilities))
        
        # Calculate derived metrics
        estimated_value = self._calculate_estimated_value(return_item, recommended_action)
        co2_saved = self._calculate_co2_impact(return_item, recommended_action)
        landfill_avoided = self._calculate_waste_impact(return_item, recommended_action)
        processing_time = self._estimate_processing_time(recommended_action, return_item.category)
        marketplace = self._select_marketplace(recommended_action, return_item.category, estimated_value)
        reasoning = self._generate_reasoning(return_item, recommended_action, confidence)
        
        return PredictionResult(
            recommended_action=recommended_action,
            confidence=confidence,
            estimated_value=estimated_value,
            co2_saved=co2_saved,
            landfill_avoided=landfill_avoided,
            processing_time=processing_time,
            marketplace=marketplace,
            reasoning=reasoning
        )
    
    def _calculate_estimated_value(self, item: ReturnItem, action: str) -> float:
        """Calculate estimated recovery value"""
        condition_multiplier = {
            'new': 0.75,
            'lightly-used': 0.55,
            'good': 0.40,
            'fair': 0.25,
            'poor': 0.10,
            'defective': 0.05
        }
        
        action_multiplier = {
            'resale': 1.0,
            'repair': 0.6,
            'recycle': 0.05,
            'donate': 0.0
        }
        
        base_value = item.original_price
        condition_factor = condition_multiplier.get(item.condition.lower(), 0.3)
        action_factor = action_multiplier.get(action.lower(), 0.3)
        
        # Apply market demand adjustment
        demand_adjustment = {
            'high': 1.2,
            'medium': 1.0,
            'low': 0.8
        }.get(item.market_demand.lower(), 1.0)
        
        return round(base_value * condition_factor * action_factor * demand_adjustment, 2)
    
    def _calculate_co2_impact(self, item: ReturnItem, action: str) -> float:
        """Calculate CO2 savings"""
        base_co2_per_rupee = {
            'resale': 0.003,
            'repair': 0.002,
            'recycle': 0.001,
            'donate': 0.0025
        }
        
        factor = base_co2_per_rupee.get(action.lower(), 0.001)
        return round(item.original_price * factor, 2)
    
    def _calculate_waste_impact(self, item: ReturnItem, action: str) -> float:
        """Calculate landfill waste avoided"""
        category_weight = {
            'Electronics': 0.8,
            'Appliances': 2.5,
            'Fashion': 0.3,
            'Home & Kitchen': 0.6
        }
        
        action_factor = {
            'resale': 0.95,
            'repair': 0.85,
            'recycle': 0.60,
            'donate': 0.90
        }
        
        base_weight = category_weight.get(item.category, 0.5)
        factor = action_factor.get(action.lower(), 0.5)
        
        return round(base_weight * factor, 2)
    
    def _estimate_processing_time(self, action: str, category: str) -> int:
        """Estimate processing time in days"""
        base_times = {
            'resale': 2,
            'repair': 5,
            'recycle': 1,
            'donate': 3
        }
        
        category_multiplier = {
            'Electronics': 1.3,
            'Appliances': 1.5,
            'Fashion': 0.8,
            'Home & Kitchen': 1.0
        }
        
        base_time = base_times.get(action.lower(), 3)
        multiplier = category_multiplier.get(category, 1.0)
        
        return max(1, round(base_time * multiplier))
    
    def _select_marketplace(self, action: str, category: str, value: float) -> Optional[str]:
        """Select optimal marketplace"""
        if action.lower() != 'resale':
            return None
        
        if value > 10000:
            return 'Flipkart'
        elif value > 2000:
            return 'Flipkart 2GUD'
        elif category == 'Fashion':
            return 'Myntra'
        elif category == 'Electronics':
            return 'Amazon Renewed'
        else:
            return 'Walmart Marketplace'
    
    def _generate_reasoning(self, item: ReturnItem, action: str, confidence: float) -> str:
        """Generate human-readable reasoning"""
        condition_desc = {
            'new': 'excellent',
            'lightly-used': 'very good',
            'good': 'good',
            'fair': 'acceptable',
            'poor': 'poor',
            'defective': 'defective'
        }.get(item.condition.lower(), 'unknown')
        
        base_reason = f"Item in {condition_desc} condition"
        
        if action == 'resale':
            return f"{base_reason}, suitable for resale market. {item.category} has good demand."
        elif action == 'repair':
            return f"{base_reason}, economically viable for repair and resale."
        elif action == 'recycle':
            return f"{base_reason}, beyond economical repair. Materials can be responsibly recycled."
        elif action == 'donate':
            return f"{base_reason}, has social value for donation programs."
        
        return f"{base_reason}. Confidence: {confidence:.1%}"

class ValueForecaster:
    """Time series forecasting for value recovery and demand"""
    
    def __init__(self):
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self, historical_data: pd.DataFrame) -> Dict[str, float]:
        """Train forecasting model on historical data"""
        logger.info(f"Training forecasting model with {len(historical_data)} data points")
        
        # Feature engineering for time series
        features = self._create_time_features(historical_data)
        target = historical_data['value_recovered'].values
        
        # Split data chronologically
        split_idx = int(len(features) * 0.8)
        X_train, X_test = features[:split_idx], features[split_idx:]
        y_train, y_test = target[:split_idx], target[split_idx:]
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        self.is_trained = True
        
        metrics = {
            'mae': mae,
            'r2_score': r2,
            'mape': np.mean(np.abs((y_test - y_pred) / y_test)) * 100
        }
        
        logger.info(f"Forecasting model trained. MAE: {mae:.2f}, R²: {r2:.3f}")
        return metrics
    
    def forecast(self, periods: int, category: str = None) -> ForecastResult:
        """Generate forecast for specified periods"""
        if not self.is_trained:
            raise ValueError("Model must be trained before forecasting")
        
        # Generate future time features
        future_features = self._generate_future_features(periods, category)
        future_scaled = self.scaler.transform(future_features)
        
        # Make predictions
        predictions = self.model.predict(future_scaled)
        
        # Calculate confidence intervals (simplified)
        std_error = np.std(predictions) * 0.1
        confidence_intervals = [
            (pred - 1.96 * std_error, pred + 1.96 * std_error)
            for pred in predictions
        ]
        
        # Analyze trend
        trend = self._analyze_trend(predictions)
        
        # Calculate seasonality
        seasonality_factor = self._calculate_seasonality(predictions)
        
        # Format results
        forecast_data = [
            {
                'period': i + 1,
                'predicted_value': float(pred),
                'lower_bound': float(ci[0]),
                'upper_bound': float(ci[1])
            }
            for i, (pred, ci) in enumerate(zip(predictions, confidence_intervals))
        ]
        
        return ForecastResult(
            predictions=forecast_data,
            confidence_intervals=confidence_intervals,
            trend=trend,
            seasonality_factor=seasonality_factor,
            accuracy_metrics={'mae': 0.0, 'r2': 0.0}  # Would be calculated from validation
        )
    
    def _create_time_features(self, data: pd.DataFrame) -> np.ndarray:
        """Create time-based features"""
        features = []
        
        for idx, row in data.iterrows():
            date = pd.to_datetime(row['date'])
            feature_row = [
                date.month,
                date.quarter,
                date.dayofweek,
                date.day,
                row.get('category_encoded', 0),
                row.get('avg_price', 0),
                row.get('volume', 0),
                row.get('seasonality_score', 0.5)
            ]
            features.append(feature_row)
        
        return np.array(features)
    
    def _generate_future_features(self, periods: int, category: str) -> np.ndarray:
        """Generate features for future periods"""
        features = []
        base_date = datetime.now()
        
        category_encoding = {
            'Electronics': 0.9,
            'Fashion': 0.6,
            'Appliances': 0.8,
            'Home & Kitchen': 0.5
        }.get(category, 0.6)
        
        for i in range(periods):
            future_date = base_date + timedelta(days=30 * i)  # Monthly periods
            feature_row = [
                future_date.month,
                (future_date.month - 1) // 3 + 1,  # quarter
                future_date.weekday(),
                future_date.day,
                category_encoding,
                5000,  # avg_price placeholder
                100,   # volume placeholder
                0.6    # seasonality_score placeholder
            ]
            features.append(feature_row)
        
        return np.array(features)
    
    def _analyze_trend(self, predictions: np.ndarray) -> str:
        """Analyze trend direction"""
        if len(predictions) < 2:
            return 'stable'
        
        # Calculate linear trend
        x = np.arange(len(predictions))
        slope = np.polyfit(x, predictions, 1)[0]
        
        if slope > 0.05:
            return 'increasing'
        elif slope < -0.05:
            return 'decreasing'
        else:
            return 'stable'
    
    def _calculate_seasonality(self, predictions: np.ndarray) -> float:
        """Calculate seasonality factor"""
        if len(predictions) < 4:
            return 0.0
        
        # Simple seasonality calculation
        mean_val = np.mean(predictions)
        variance = np.var(predictions)
        
        return min(variance / (mean_val ** 2), 1.0) if mean_val > 0 else 0.0

class AnomalyDetector:
    """Detect anomalies in return patterns"""
    
    def __init__(self, threshold: float = 2.5):
        self.threshold = threshold
        self.baseline_stats = {}
    
    def fit(self, historical_data: pd.DataFrame):
        """Fit anomaly detector on historical data"""
        self.baseline_stats = {
            'daily_mean': historical_data.groupby('date')['count'].mean().mean(),
            'daily_std': historical_data.groupby('date')['count'].mean().std(),
            'category_means': historical_data.groupby('category')['count'].mean().to_dict(),
            'seasonal_patterns': self._calculate_seasonal_patterns(historical_data)
        }
    
    def detect_anomalies(self, current_data: pd.DataFrame) -> List[Dict]:
        """Detect anomalies in current data"""
        anomalies = []
        
        # Volume anomalies
        daily_counts = current_data.groupby('date')['count'].sum()
        for date, count in daily_counts.items():
            z_score = abs(count - self.baseline_stats['daily_mean']) / self.baseline_stats['daily_std']
            
            if z_score > self.threshold:
                anomalies.append({
                    'type': 'volume_anomaly',
                    'date': date,
                    'value': count,
                    'expected': self.baseline_stats['daily_mean'],
                    'severity': 'high' if z_score > 3 else 'medium',
                    'description': f"Unusual return volume: {count} vs expected {self.baseline_stats['daily_mean']:.0f}"
                })
        
        # Category anomalies
        category_counts = current_data.groupby('category')['count'].sum()
        for category, count in category_counts.items():
            expected = self.baseline_stats['category_means'].get(category, 0)
            if expected > 0:
                deviation = abs(count - expected) / expected
                
                if deviation > 0.5:  # 50% deviation threshold
                    anomalies.append({
                        'type': 'category_anomaly',
                        'category': category,
                        'value': count,
                        'expected': expected,
                        'severity': 'high' if deviation > 1.0 else 'medium',
                        'description': f"Unusual {category} returns: {count} vs expected {expected:.0f}"
                    })
        
        return anomalies
    
    def _calculate_seasonal_patterns(self, data: pd.DataFrame) -> Dict:
        """Calculate seasonal patterns"""
        data['month'] = pd.to_datetime(data['date']).dt.month
        monthly_means = data.groupby('month')['count'].mean()
        
        return {
            'monthly_patterns': monthly_means.to_dict(),
            'peak_months': monthly_means.nlargest(3).index.tolist(),
            'low_months': monthly_means.nsmallest(3).index.tolist()
        }

class RiskAssessment:
    """Risk assessment and scoring for returns"""
    
    def __init__(self):
        self.risk_factors = {
            'volume_risk': 0.3,
            'value_risk': 0.25,
            'quality_risk': 0.2,
            'market_risk': 0.15,
            'operational_risk': 0.1
        }
    
    def calculate_risk_score(self, category_data: Dict) -> Dict[str, Union[float, str]]:
        """Calculate comprehensive risk score"""
        scores = {}
        
        # Volume risk (high return rates)
        return_rate = category_data.get('return_rate', 0)
        scores['volume_risk'] = min(return_rate / 0.15, 1.0) * 100  # 15% is high risk threshold
        
        # Value risk (low recovery rates)
        recovery_rate = category_data.get('value_recovery_rate', 0)
        scores['value_risk'] = max(0, (0.6 - recovery_rate) / 0.6) * 100  # 60% is target
        
        # Quality risk (high defect rates)
        defect_rate = category_data.get('defect_rate', 0)
        scores['quality_risk'] = min(defect_rate / 0.1, 1.0) * 100  # 10% is high risk
        
        # Market risk (demand volatility)
        demand_volatility = category_data.get('demand_volatility', 0)
        scores['market_risk'] = min(demand_volatility / 0.3, 1.0) * 100  # 30% volatility is high
        
        # Operational risk (processing delays)
        avg_processing_time = category_data.get('avg_processing_time', 0)
        scores['operational_risk'] = min(avg_processing_time / 7, 1.0) * 100  # 7 days is high
        
        # Calculate weighted overall score
        overall_score = sum(
            scores[factor] * weight 
            for factor, weight in self.risk_factors.items()
        )
        
        # Determine risk level
        if overall_score >= 80:
            risk_level = 'Critical'
        elif overall_score >= 60:
            risk_level = 'High'
        elif overall_score >= 40:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'
        
        return {
            'overall_score': round(overall_score, 1),
            'risk_level': risk_level,
            'component_scores': scores,
            'recommendations': self._generate_risk_recommendations(scores, overall_score)
        }
    
    def _generate_risk_recommendations(self, scores: Dict, overall_score: float) -> List[str]:
        """Generate risk mitigation recommendations"""
        recommendations = []
        
        if scores['volume_risk'] > 70:
            recommendations.append("Implement return prevention strategies and improve product descriptions")
        
        if scores['value_risk'] > 70:
            recommendations.append("Optimize pricing strategies and explore new marketplaces")
        
        if scores['quality_risk'] > 70:
            recommendations.append("Enhance quality control processes and supplier management")
        
        if scores['market_risk'] > 70:
            recommendations.append("Diversify market channels and improve demand forecasting")
        
        if scores['operational_risk'] > 70:
            recommendations.append("Streamline processing workflows and increase capacity")
        
        if overall_score > 80:
            recommendations.append("URGENT: Immediate intervention required across all risk areas")
        
        return recommendations

class SmartReturnsPredictionEngine:
    """Main prediction engine orchestrating all models"""
    
    def __init__(self):
        self.disposition_predictor = DispositionPredictor()
        self.value_forecaster = ValueForecaster()
        self.anomaly_detector = AnomalyDetector()
        self.risk_assessor = RiskAssessment()
        self.models_trained = False
    
    def train_models(self, training_data: Dict[str, pd.DataFrame]) -> Dict[str, Dict]:
        """Train all models with provided data"""
        logger.info("Training SmartReturns prediction models...")
        
        results = {}
        
        # Train disposition predictor
        if 'returns' in training_data:
            disposition_data = self._prepare_disposition_data(training_data['returns'])
            results['disposition'] = self.disposition_predictor.train(disposition_data)
        
        # Train value forecaster
        if 'time_series' in training_data:
            results['forecasting'] = self.value_forecaster.train(training_data['time_series'])
        
        # Fit anomaly detector
        if 'historical' in training_data:
            self.anomaly_detector.fit(training_data['historical'])
            results['anomaly_detection'] = {'status': 'fitted'}
        
        self.models_trained = True
        logger.info("All models trained successfully")
        
        return results
    
    def predict_disposition(self, return_item: ReturnItem) -> PredictionResult:
        """Predict optimal disposition for return item"""
        return self.disposition_predictor.predict(return_item)
    
    def forecast_demand(self, periods: int, category: str = None) -> ForecastResult:
        """Forecast future demand"""
        return self.value_forecaster.forecast(periods, category)
    
    def detect_anomalies(self, current_data: pd.DataFrame) -> List[Dict]:
        """Detect anomalies in current data"""
        return self.anomaly_detector.detect_anomalies(current_data)
    
    def assess_risk(self, category_data: Dict) -> Dict:
        """Assess risk for category or hub"""
        return self.risk_assessor.calculate_risk_score(category_data)
    
    def generate_insights(self, data: pd.DataFrame) -> Dict[str, Union[str, float, List]]:
        """Generate comprehensive insights from data"""
        insights = {
            'total_items': len(data),
            'avg_value': data['value_recovered'].mean() if 'value_recovered' in data.columns else 0,
            'top_categories': data['category'].value_counts().head(3).to_dict() if 'category' in data.columns else {},
            'trend_analysis': self._analyze_trends(data),
            'recommendations': self._generate_recommendations(data)
        }
        
        return insights
    
    def optimize_hub_assignment(self, return_items: List[ReturnItem], hub_capacities: Dict) -> Dict[str, List[str]]:
        """Optimize hub assignments for return items"""
        assignments = {}
        
        for hub_id in hub_capacities.keys():
            assignments[hub_id] = []
        
        # Simple optimization based on capacity and specialization
        for item in return_items:
            best_hub = self._find_optimal_hub(item, hub_capacities)
            assignments[best_hub].append(item.sku)
        
        return assignments
    
    def _prepare_disposition_data(self, returns_df: pd.DataFrame) -> List[Tuple[ReturnItem, str]]:
        """Convert DataFrame to ReturnItem objects"""
        training_data = []
        
        for _, row in returns_df.iterrows():
            return_item = ReturnItem(
                sku=row['sku'],
                product_name=row['product_name'],
                category=row['category'],
                condition=row['condition'],
                return_reason=row['return_reason'],
                original_price=row['original_price'],
                customer_age=row.get('customer_age', 30),
                purchase_channel=row.get('purchase_channel', 'online'),
                location=row['location'],
                return_date=pd.to_datetime(row['return_date']),
                manufacturing_date=pd.to_datetime(row.get('manufacturing_date', row['return_date'])),
                warranty_status=row.get('warranty_status', 'expired'),
                material_composition=row.get('material_composition', '').split(','),
                seasonality=row.get('seasonality', 'medium'),
                market_demand=row.get('market_demand', 'medium')
            )
            
            actual_action = row['actual_disposition']
            training_data.append((return_item, actual_action))
        
        return training_data
    
    def _analyze_trends(self, data: pd.DataFrame) -> Dict[str, str]:
        """Analyze trends in the data"""
        trends = {}
        
        if 'date' in data.columns and 'value_recovered' in data.columns:
            data['date'] = pd.to_datetime(data['date'])
            monthly_values = data.groupby(data['date'].dt.to_period('M'))['value_recovered'].sum()
            
            if len(monthly_values) >= 2:
                recent_trend = monthly_values.iloc[-2:].pct_change().iloc[-1]
                if recent_trend > 0.1:
                    trends['value_trend'] = 'increasing'
                elif recent_trend < -0.1:
                    trends['value_trend'] = 'decreasing'
                else:
                    trends['value_trend'] = 'stable'
        
        return trends
    
    def _generate_recommendations(self, data: pd.DataFrame) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if 'category' in data.columns:
            category_performance = data.groupby('category')['value_recovered'].mean()
            worst_category = category_performance.idxmin()
            recommendations.append(f"Focus improvement efforts on {worst_category} category")
        
        if 'condition' in data.columns:
            condition_counts = data['condition'].value_counts()
            if condition_counts.get('defective', 0) > len(data) * 0.2:
                recommendations.append("High defective rate detected - review quality control processes")
        
        return recommendations
    
    def _find_optimal_hub(self, item: ReturnItem, hub_capacities: Dict) -> str:
        """Find optimal hub for item processing"""
        # Simplified hub assignment logic
        # In production, this would consider distance, specialization, capacity, etc.
        
        available_hubs = [hub_id for hub_id, capacity in hub_capacities.items() if capacity > 0]
        
        if not available_hubs:
            return list(hub_capacities.keys())[0]  # Fallback to first hub
        
        # Prefer hubs with higher capacity
        return max(available_hubs, key=lambda h: hub_capacities[h])
    
    def save_models(self, filepath: str):
        """Save trained models to disk"""
        model_data = {
            'disposition_predictor': self.disposition_predictor,
            'value_forecaster': self.value_forecaster,
            'anomaly_detector': self.anomaly_detector,
            'risk_assessor': self.risk_assessor,
            'models_trained': self.models_trained
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Models saved to {filepath}")
    
    def load_models(self, filepath: str):
        """Load trained models from disk"""
        model_data = joblib.load(filepath)
        
        self.disposition_predictor = model_data['disposition_predictor']
        self.value_forecaster = model_data['value_forecaster']
        self.anomaly_detector = model_data['anomaly_detector']
        self.risk_assessor = model_data['risk_assessor']
        self.models_trained = model_data['models_trained']
        
        logger.info(f"Models loaded from {filepath}")

# Example usage and testing
def main():
    """Example usage of the prediction engine"""
    
    # Initialize prediction engine
    engine = SmartReturnsPredictionEngine()
    
    # Create sample data for testing
    sample_return = ReturnItem(
        sku="SAMPLE-123",
        product_name="Bluetooth Headphones",
        category="Electronics",
        condition="lightly-used",
        return_reason="Sound quality not as expected",
        original_price=2500.0,
        customer_age=28,
        purchase_channel="online",
        location="Mumbai",
        return_date=datetime.now(),
        manufacturing_date=datetime.now() - timedelta(days=180),
        warranty_status="active",
        material_composition=["Plastic", "Electronics", "Metal"],
        seasonality="medium",
        market_demand="high"
    )
    
    # Create sample training data
    training_data = pd.DataFrame({
        'sku': ['SKU1', 'SKU2', 'SKU3'],
        'product_name': ['Product 1', 'Product 2', 'Product 3'],
        'category': ['Electronics', 'Fashion', 'Appliances'],
        'condition': ['good', 'new', 'fair'],
        'return_reason': ['Defective', 'Wrong size', 'Changed mind'],
        'original_price': [1000, 500, 3000],
        'location': ['Mumbai', 'Delhi', 'Bangalore'],
        'return_date': ['2024-01-01', '2024-01-02', '2024-01-03'],
        'actual_disposition': ['repair', 'resale', 'resale'],
        'value_recovered': [400, 350, 2100]
    })
    
    # Train models (in production, use real data)
    print("Training models with sample data...")
    training_results = engine.train_models({
        'returns': training_data,
        'time_series': training_data,
        'historical': training_data
    })
    
    print("Training Results:", training_results)
    
    # Make prediction
    print("\nMaking prediction for sample return...")
    prediction = engine.predict_disposition(sample_return)
    
    print(f"Recommended Action: {prediction.recommended_action}")
    print(f"Confidence: {prediction.confidence:.2%}")
    print(f"Estimated Value: ₹{prediction.estimated_value:,.2f}")
    print(f"CO₂ Saved: {prediction.co2_saved:.2f} kg")
    print(f"Processing Time: {prediction.processing_time} days")
    print(f"Marketplace: {prediction.marketplace}")
    print(f"Reasoning: {prediction.reasoning}")
    
    # Generate forecast
    print("\nGenerating 6-month forecast...")
    forecast = engine.forecast_demand(6, "Electronics")
    
    print("Forecast Results:")
    for pred in forecast.predictions[:3]:  # Show first 3 periods
        print(f"Period {pred['period']}: ₹{pred['predicted_value']:,.2f} "
              f"(Range: ₹{pred['lower_bound']:,.2f} - ₹{pred['upper_bound']:,.2f})")
    
    print(f"Trend: {forecast.trend}")
    print(f"Seasonality Factor: {forecast.seasonality_factor:.3f}")
    
    # Risk assessment
    print("\nPerforming risk assessment...")
    risk_data = {
        'return_rate': 0.12,
        'value_recovery_rate': 0.65,
        'defect_rate': 0.08,
        'demand_volatility': 0.25,
        'avg_processing_time': 3.5
    }
    
    risk_assessment = engine.assess_risk(risk_data)
    print(f"Overall Risk Score: {risk_assessment['overall_score']}/100")
    print(f"Risk Level: {risk_assessment['risk_level']}")
    print("Recommendations:")
    for rec in risk_assessment['recommendations']:
        print(f"  - {rec}")

if __name__ == "__main__":
    main()