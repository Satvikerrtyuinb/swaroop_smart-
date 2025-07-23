#!/usr/bin/env python3
"""
SmartReturns Model Training Pipeline
===================================

Automated model training, validation, and deployment pipeline
with hyperparameter optimization and model comparison.

Author: SmartReturns AI Team
Version: 2.1.0
"""

import pandas as pd
import numpy as np
from datetime import datetime
import logging
import yaml
import joblib
import optuna
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
import warnings
warnings.filterwarnings('ignore')

# ML Libraries
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.dummy import DummyClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_absolute_error, mean_squared_error, r2_score,
    classification_report, confusion_matrix
)
from sklearn.feature_selection import RFE, SelectKBest, f_classif

# Advanced ML
import xgboost as xgb
import lightgbm as lgb
from prophet import Prophet

# Monitoring and Tracking
import mlflow
import mlflow.sklearn
from mlflow.tracking import MlflowClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelTrainer:
    """Automated model training and optimization"""
    
    def __init__(self, config_path: str = "ml/config/model_config.yaml"):
        self.config = self._load_config(config_path)
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.feature_selectors = {}
        self.training_history = []
        
        # Initialize MLflow
        mlflow.set_tracking_uri("sqlite:///mlflow.db")
        mlflow.set_experiment("smartreturns_ml")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load training configuration"""
        try:
            with open(config_path, 'r') as f:
                config = yaml.safe_load(f)
            logger.info(f"Configuration loaded from {config_path}")
            return config
        except FileNotFoundError:
            logger.warning(f"Config file {config_path} not found, using defaults")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict:
        """Get default configuration"""
        return {
            'training': {
                'test_size': 0.2,
                'random_state': 42,
                'cv_folds': 5
            },
            'models': {
                'disposition_classifier': {
                    'algorithm': 'random_forest',
                    'parameters': {
                        'n_estimators': 100,
                        'max_depth': 10,
                        'random_state': 42
                    }
                }
            }
        }
    
    def prepare_data(self, df: pd.DataFrame, target_column: str) -> Tuple[np.ndarray, np.ndarray, List[str]]:
        """Prepare data for training"""
        logger.info(f"Preparing data: {len(df)} samples")
        
        # Separate features and target
        feature_columns = [col for col in df.columns if col != target_column and not col.startswith('_')]
        X = df[feature_columns].copy()
        y = df[target_column].copy()
        
        # Handle categorical variables
        categorical_cols = X.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if col not in self.encoders:
                self.encoders[col] = LabelEncoder()
                X[col] = self.encoders[col].fit_transform(X[col].astype(str))
            else:
                X[col] = self.encoders[col].transform(X[col].astype(str))
        
        # Handle missing values
        X = X.fillna(X.median())
        
        # Feature scaling
        if 'scaler' not in self.scalers:
            self.scalers['scaler'] = StandardScaler()
            X_scaled = self.scalers['scaler'].fit_transform(X)
        else:
            X_scaled = self.scalers['scaler'].transform(X)
        
        # Feature selection
        if self.config.get('feature_engineering', {}).get('feature_selection', {}).get('enabled', False):
            n_features = self.config['feature_engineering']['feature_selection'].get('n_features', 20)
            
            if 'feature_selector' not in self.feature_selectors:
                self.feature_selectors['feature_selector'] = SelectKBest(f_classif, k=min(n_features, X_scaled.shape[1]))
                X_selected = self.feature_selectors['feature_selector'].fit_transform(X_scaled, y)
            else:
                X_selected = self.feature_selectors['feature_selector'].transform(X_scaled)
            
            selected_features = X.columns[self.feature_selectors['feature_selector'].get_support()].tolist()
        else:
            X_selected = X_scaled
            selected_features = feature_columns
        
        logger.info(f"Data prepared: {X_selected.shape[1]} features selected")
        return X_selected, y, selected_features
    
    def train_disposition_classifier(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """Train disposition classification model"""
        logger.info("Training disposition classifier")
        
        with mlflow.start_run(run_name="disposition_classifier"):
            # Log parameters
            model_config = self.config['models']['disposition_classifier']
            mlflow.log_params(model_config['parameters'])
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, 
                test_size=self.config['training']['test_size'],
                random_state=self.config['training']['random_state'],
                stratify=y
            )
            
            # Initialize model
            if model_config['algorithm'] == 'random_forest':
                model = RandomForestClassifier(**model_config['parameters'])
            elif model_config['algorithm'] == 'xgboost':
                model = xgb.XGBClassifier(**model_config['parameters'])
            elif model_config['algorithm'] == 'lightgbm':
                model = lgb.LGBMClassifier(**model_config['parameters'])
            else:
                raise ValueError(f"Unsupported algorithm: {model_config['algorithm']}")
            
            # Train model
            model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test)
            
            # Calculate metrics
            metrics = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred, average='weighted'),
                'recall': recall_score(y_test, y_pred, average='weighted'),
                'f1_score': f1_score(y_test, y_pred, average='weighted')
            }
            
            # Cross-validation
            cv_scores = cross_val_score(
                model, X_train, y_train, 
                cv=self.config['training']['cv_folds'],
                scoring='accuracy'
            )
            metrics['cv_accuracy_mean'] = cv_scores.mean()
            metrics['cv_accuracy_std'] = cv_scores.std()
            
            # Log metrics
            mlflow.log_metrics(metrics)
            
            # Log model
            mlflow.sklearn.log_model(model, "model")
            
            # Store model
            self.models['disposition_classifier'] = model
            
            logger.info(f"Disposition classifier trained. Accuracy: {metrics['accuracy']:.3f}")
            return metrics
    
    def train_value_regressor(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """Train value recovery regression model"""
        logger.info("Training value regressor")
        
        with mlflow.start_run(run_name="value_regressor"):
            # Log parameters
            model_config = self.config['models']['value_regressor']
            mlflow.log_params(model_config['parameters'])
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y,
                test_size=self.config['training']['test_size'],
                random_state=self.config['training']['random_state']
            )
            
            # Initialize model
            if model_config['algorithm'] == 'gradient_boosting':
                model = GradientBoostingRegressor(**model_config['parameters'])
            elif model_config['algorithm'] == 'xgboost':
                model = xgb.XGBRegressor(**model_config['parameters'])
            elif model_config['algorithm'] == 'lightgbm':
                model = lgb.LGBMRegressor(**model_config['parameters'])
            else:
                raise ValueError(f"Unsupported algorithm: {model_config['algorithm']}")
            
            # Train model
            model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test)
            
            # Calculate metrics
            metrics = {
                'mae': mean_absolute_error(y_test, y_pred),
                'mse': mean_squared_error(y_test, y_pred),
                'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
                'r2_score': r2_score(y_test, y_pred),
                'mape': np.mean(np.abs((y_test - y_pred) / y_test)) * 100
            }
            
            # Cross-validation
            cv_scores = cross_val_score(
                model, X_train, y_train,
                cv=self.config['training']['cv_folds'],
                scoring='neg_mean_absolute_error'
            )
            metrics['cv_mae_mean'] = -cv_scores.mean()
            metrics['cv_mae_std'] = cv_scores.std()
            
            # Log metrics
            mlflow.log_metrics(metrics)
            
            # Log model
            mlflow.sklearn.log_model(model, "model")
            
            # Store model
            self.models['value_regressor'] = model
            
            logger.info(f"Value regressor trained. R²: {metrics['r2_score']:.3f}, MAE: {metrics['mae']:.2f}")
            return metrics
    
    def optimize_hyperparameters(self, X: np.ndarray, y: np.ndarray, model_type: str) -> Dict[str, Any]:
        """Optimize hyperparameters using Optuna"""
        logger.info(f"Optimizing hyperparameters for {model_type}")
        
        def objective(trial):
            # Get hyperparameter space
            model_config = self.config['models'][model_type]
            param_space = model_config.get('hyperparameter_space', {})
            
            # Sample parameters
            params = {}
            for param, values in param_space.items():
                if isinstance(values, list):
                    if all(isinstance(v, int) for v in values):
                        params[param] = trial.suggest_categorical(param, values)
                    elif all(isinstance(v, float) for v in values):
                        params[param] = trial.suggest_uniform(param, min(values), max(values))
                    else:
                        params[param] = trial.suggest_categorical(param, values)
            
            # Create model with sampled parameters
            base_params = model_config['parameters'].copy()
            base_params.update(params)
            
            if model_config['algorithm'] == 'random_forest':
                model = RandomForestClassifier(**base_params)
                scoring = 'accuracy'
            elif model_config['algorithm'] == 'gradient_boosting':
                model = GradientBoostingRegressor(**base_params)
                scoring = 'neg_mean_absolute_error'
            else:
                raise ValueError(f"Optimization not supported for {model_config['algorithm']}")
            
            # Cross-validation
            scores = cross_val_score(model, X, y, cv=3, scoring=scoring)
            return scores.mean() if scoring == 'accuracy' else -scores.mean()
        
        # Run optimization
        study = optuna.create_study(direction='maximize')
        study.optimize(
            objective,
            n_trials=self.config.get('training', {}).get('hyperparameter_tuning', {}).get('n_trials', 50),
            timeout=self.config.get('training', {}).get('hyperparameter_tuning', {}).get('timeout', 3600)
        )
        
        best_params = study.best_params
        best_score = study.best_value
        
        logger.info(f"Hyperparameter optimization complete. Best score: {best_score:.3f}")
        logger.info(f"Best parameters: {best_params}")
        
        return {
            'best_params': best_params,
            'best_score': best_score,
            'n_trials': len(study.trials)
        }
    
    def compare_models(self, X: np.ndarray, y: np.ndarray, task_type: str = 'classification') -> pd.DataFrame:
        """Compare multiple models"""
        logger.info(f"Comparing models for {task_type}")
        
        if task_type == 'classification':
            models = {
                'Random Forest': RandomForestClassifier(random_state=42),
                'XGBoost': xgb.XGBClassifier(random_state=42),
                'Logistic Regression': LogisticRegression(random_state=42),
                'Decision Tree': DecisionTreeClassifier(random_state=42),
                'Dummy Classifier': DummyClassifier(strategy='most_frequent')
            }
            scoring_metrics = ['accuracy', 'precision_weighted', 'recall_weighted', 'f1_weighted']
        else:
            models = {
                'Gradient Boosting': GradientBoostingRegressor(random_state=42),
                'XGBoost': xgb.XGBRegressor(random_state=42),
                'Random Forest': RandomForestClassifier(random_state=42)
            }
            scoring_metrics = ['neg_mean_absolute_error', 'neg_mean_squared_error', 'r2']
        
        results = []
        
        for name, model in models.items():
            logger.info(f"Evaluating {name}")
            
            model_results = {'Model': name}
            
            for metric in scoring_metrics:
                scores = cross_val_score(X, y, cv=5, scoring=metric)
                model_results[f'{metric}_mean'] = scores.mean()
                model_results[f'{metric}_std'] = scores.std()
            
            results.append(model_results)
        
        comparison_df = pd.DataFrame(results)
        
        # Sort by primary metric
        primary_metric = 'accuracy_mean' if task_type == 'classification' else 'neg_mean_absolute_error_mean'
        comparison_df = comparison_df.sort_values(primary_metric, ascending=False)
        
        logger.info("Model comparison complete")
        return comparison_df
    
    def evaluate_model(self, model, X_test: np.ndarray, y_test: np.ndarray, task_type: str = 'classification') -> Dict:
        """Comprehensive model evaluation"""
        y_pred = model.predict(X_test)
        
        if task_type == 'classification':
            y_pred_proba = model.predict_proba(X_test) if hasattr(model, 'predict_proba') else None
            
            evaluation = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred, average='weighted'),
                'recall': recall_score(y_test, y_pred, average='weighted'),
                'f1_score': f1_score(y_test, y_pred, average='weighted'),
                'classification_report': classification_report(y_test, y_pred),
                'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
            }
            
            if y_pred_proba is not None:
                from sklearn.metrics import roc_auc_score
                evaluation['roc_auc'] = roc_auc_score(y_test, y_pred_proba, multi_class='ovr', average='weighted')
        
        else:  # regression
            evaluation = {
                'mae': mean_absolute_error(y_test, y_pred),
                'mse': mean_squared_error(y_test, y_pred),
                'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
                'r2_score': r2_score(y_test, y_pred),
                'mape': np.mean(np.abs((y_test - y_pred) / y_test)) * 100
            }
        
        return evaluation
    
    def train_all_models(self, data: Dict[str, pd.DataFrame]) -> Dict[str, Dict]:
        """Train all models in the pipeline"""
        logger.info("Starting comprehensive model training")
        
        results = {}
        
        # Train disposition classifier
        if 'returns' in data and 'actual_disposition' in data['returns'].columns:
            X, y, features = self.prepare_data(data['returns'], 'actual_disposition')
            
            # Hyperparameter optimization
            if self.config.get('training', {}).get('hyperparameter_tuning', {}).get('enabled', False):
                opt_results = self.optimize_hyperparameters(X, y, 'disposition_classifier')
                results['disposition_optimization'] = opt_results
            
            # Train final model
            disposition_metrics = self.train_disposition_classifier(X, y)
            results['disposition_classifier'] = disposition_metrics
        
        # Train value regressor
        if 'returns' in data and 'value_recovered' in data['returns'].columns:
            X, y, features = self.prepare_data(data['returns'], 'value_recovered')
            value_metrics = self.train_value_regressor(X, y)
            results['value_regressor'] = value_metrics
        
        # Model comparison
        if 'returns' in data:
            X, y, _ = self.prepare_data(data['returns'], 'actual_disposition')
            comparison = self.compare_models(X, y, 'classification')
            results['model_comparison'] = comparison.to_dict()
        
        # Save models
        self.save_models()
        
        # Log training summary
        training_summary = {
            'timestamp': datetime.now(),
            'models_trained': list(results.keys()),
            'data_size': len(data.get('returns', [])),
            'config_used': self.config
        }
        
        self.training_history.append(training_summary)
        
        logger.info("Model training pipeline complete")
        return results
    
    def save_models(self, output_dir: str = "models"):
        """Save all trained models"""
        Path(output_dir).mkdir(exist_ok=True)
        
        # Save individual models
        for name, model in self.models.items():
            model_path = Path(output_dir) / f"{name}.joblib"
            joblib.dump(model, model_path)
            logger.info(f"Model {name} saved to {model_path}")
        
        # Save preprocessors
        preprocessors = {
            'scalers': self.scalers,
            'encoders': self.encoders,
            'feature_selectors': self.feature_selectors
        }
        
        preprocessor_path = Path(output_dir) / "preprocessors.joblib"
        joblib.dump(preprocessors, preprocessor_path)
        
        # Save training history
        history_path = Path(output_dir) / "training_history.json"
        import json
        with open(history_path, 'w') as f:
            json.dump(self.training_history, f, default=str, indent=2)
        
        logger.info(f"All models and preprocessors saved to {output_dir}")
    
    def load_models(self, model_dir: str = "models"):
        """Load trained models"""
        model_dir = Path(model_dir)
        
        # Load individual models
        for model_file in model_dir.glob("*.joblib"):
            if model_file.name != "preprocessors.joblib":
                model_name = model_file.stem
                self.models[model_name] = joblib.load(model_file)
                logger.info(f"Model {model_name} loaded")
        
        # Load preprocessors
        preprocessor_path = model_dir / "preprocessors.joblib"
        if preprocessor_path.exists():
            preprocessors = joblib.load(preprocessor_path)
            self.scalers = preprocessors.get('scalers', {})
            self.encoders = preprocessors.get('encoders', {})
            self.feature_selectors = preprocessors.get('feature_selectors', {})
        
        logger.info(f"Models loaded from {model_dir}")
    
    def generate_model_report(self) -> Dict:
        """Generate comprehensive model training report"""
        report = {
            'training_summary': {
                'timestamp': datetime.now(),
                'models_trained': list(self.models.keys()),
                'config_used': self.config
            },
            'model_details': {},
            'performance_summary': {},
            'recommendations': []
        }
        
        # Add model details
        for name, model in self.models.items():
            model_info = {
                'algorithm': type(model).__name__,
                'parameters': model.get_params(),
                'feature_count': getattr(model, 'n_features_in_', 'unknown')
            }
            
            if hasattr(model, 'feature_importances_'):
                # Get top 10 most important features
                importances = model.feature_importances_
                top_features = np.argsort(importances)[-10:][::-1]
                model_info['top_features'] = {
                    f'feature_{i}': float(importances[i]) for i in top_features
                }
            
            report['model_details'][name] = model_info
        
        # Add recommendations
        if len(self.training_history) > 1:
            report['recommendations'].append("Multiple training runs detected - consider model versioning")
        
        if not self.models:
            report['recommendations'].append("No models trained - run training pipeline")
        
        return report

# Example usage
async def main():
    """Example model training pipeline"""
    
    # Initialize trainer
    trainer = ModelTrainer()
    
    # Create sample training data
    np.random.seed(42)
    n_samples = 1000
    
    sample_data = pd.DataFrame({
        'sku': [f'SKU{i:04d}' for i in range(n_samples)],
        'category': np.random.choice(['Electronics', 'Fashion', 'Appliances', 'Home & Kitchen'], n_samples),
        'condition': np.random.choice(['new', 'lightly-used', 'good', 'fair', 'poor'], n_samples),
        'original_price': np.random.uniform(100, 50000, n_samples),
        'customer_age': np.random.randint(18, 70, n_samples),
        'item_age_days': np.random.randint(1, 365, n_samples),
        'return_month': np.random.randint(1, 13, n_samples),
        'seasonality_score': np.random.uniform(0, 1, n_samples),
        'actual_disposition': np.random.choice(['resale', 'repair', 'recycle', 'donate'], n_samples),
        'value_recovered': np.random.uniform(50, 30000, n_samples)
    })
    
    print("Starting model training pipeline...")
    
    # Train all models
    training_results = trainer.train_all_models({'returns': sample_data})
    
    print("\nTraining Results:")
    for model_name, metrics in training_results.items():
        if isinstance(metrics, dict) and 'accuracy' in metrics:
            print(f"{model_name}: Accuracy = {metrics['accuracy']:.3f}")
        elif isinstance(metrics, dict) and 'r2_score' in metrics:
            print(f"{model_name}: R² = {metrics['r2_score']:.3f}")
    
    # Generate report
    report = trainer.generate_model_report()
    print(f"\nModels trained: {len(report['model_details'])}")
    print(f"Training timestamp: {report['training_summary']['timestamp']}")
    
    # Save models
    trainer.save_models()
    print("\nModels saved successfully")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())