#!/usr/bin/env python3
"""
SmartReturns Data Pipeline
=========================

ETL pipeline for processing returns data, feature engineering,
and preparing datasets for machine learning models.

Author: SmartReturns Data Team
Version: 2.1.0
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import logging
import json
import os
from pathlib import Path
import sqlite3
from dataclasses import dataclass
import asyncio
import aiohttp

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DataSource:
    """Configuration for data sources"""
    name: str
    type: str  # 'database', 'api', 'file'
    connection_string: str
    query: Optional[str] = None
    refresh_interval: int = 3600  # seconds

class DataValidator:
    """Data quality validation and cleaning"""
    
    def __init__(self):
        self.validation_rules = {
            'sku': {'required': True, 'pattern': r'^[A-Z0-9-_]+$'},
            'original_price': {'required': True, 'min': 0, 'max': 1000000},
            'condition': {'required': True, 'values': ['new', 'lightly-used', 'good', 'fair', 'poor', 'defective']},
            'category': {'required': True, 'values': ['Electronics', 'Fashion', 'Home & Kitchen', 'Appliances']},
            'return_date': {'required': True, 'type': 'datetime'},
            'customer_age': {'required': False, 'min': 13, 'max': 120}
        }
    
    def validate_dataframe(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Validate and clean DataFrame"""
        errors = []
        cleaned_df = df.copy()
        
        # Check required columns
        required_cols = [col for col, rules in self.validation_rules.items() if rules.get('required')]
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            errors.append(f"Missing required columns: {missing_cols}")
            return df, errors
        
        # Validate each column
        for col, rules in self.validation_rules.items():
            if col not in df.columns:
                continue
            
            # Check data types
            if rules.get('type') == 'datetime':
                try:
                    cleaned_df[col] = pd.to_datetime(cleaned_df[col])
                except Exception as e:
                    errors.append(f"Invalid datetime format in {col}: {e}")
            
            # Check value ranges
            if 'min' in rules:
                invalid_rows = cleaned_df[col] < rules['min']
                if invalid_rows.any():
                    errors.append(f"{invalid_rows.sum()} rows in {col} below minimum {rules['min']}")
                    cleaned_df.loc[invalid_rows, col] = rules['min']
            
            if 'max' in rules:
                invalid_rows = cleaned_df[col] > rules['max']
                if invalid_rows.any():
                    errors.append(f"{invalid_rows.sum()} rows in {col} above maximum {rules['max']}")
                    cleaned_df.loc[invalid_rows, col] = rules['max']
            
            # Check allowed values
            if 'values' in rules:
                invalid_rows = ~cleaned_df[col].isin(rules['values'])
                if invalid_rows.any():
                    errors.append(f"{invalid_rows.sum()} rows in {col} have invalid values")
                    # Set invalid values to most common valid value
                    most_common = cleaned_df[col][~invalid_rows].mode()[0] if not cleaned_df[col][~invalid_rows].empty else rules['values'][0]
                    cleaned_df.loc[invalid_rows, col] = most_common
            
            # Check patterns
            if 'pattern' in rules:
                import re
                pattern = re.compile(rules['pattern'])
                invalid_rows = ~cleaned_df[col].astype(str).str.match(pattern)
                if invalid_rows.any():
                    errors.append(f"{invalid_rows.sum()} rows in {col} don't match required pattern")
        
        # Remove duplicates
        initial_count = len(cleaned_df)
        cleaned_df = cleaned_df.drop_duplicates(subset=['sku', 'return_date'])
        duplicates_removed = initial_count - len(cleaned_df)
        
        if duplicates_removed > 0:
            errors.append(f"Removed {duplicates_removed} duplicate records")
        
        # Handle missing values
        cleaned_df = self._handle_missing_values(cleaned_df)
        
        return cleaned_df, errors
    
    def _handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values with appropriate strategies"""
        # Fill missing customer ages with median
        if 'customer_age' in df.columns:
            df['customer_age'].fillna(df['customer_age'].median(), inplace=True)
        
        # Fill missing purchase channels with 'online'
        if 'purchase_channel' in df.columns:
            df['purchase_channel'].fillna('online', inplace=True)
        
        # Fill missing warranty status with 'expired'
        if 'warranty_status' in df.columns:
            df['warranty_status'].fillna('expired', inplace=True)
        
        # Fill missing seasonality and demand with 'medium'
        for col in ['seasonality', 'market_demand']:
            if col in df.columns:
                df[col].fillna('medium', inplace=True)
        
        return df

class FeatureEngineer:
    """Advanced feature engineering for ML models"""
    
    def __init__(self):
        self.encoders = {}
        self.scalers = {}
    
    def create_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create engineered features"""
        feature_df = df.copy()
        
        # Temporal features
        feature_df = self._create_temporal_features(feature_df)
        
        # Price-based features
        feature_df = self._create_price_features(feature_df)
        
        # Text features
        feature_df = self._create_text_features(feature_df)
        
        # Categorical encodings
        feature_df = self._create_categorical_features(feature_df)
        
        # Interaction features
        feature_df = self._create_interaction_features(feature_df)
        
        # Aggregated features
        feature_df = self._create_aggregated_features(feature_df)
        
        return feature_df
    
    def _create_temporal_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create time-based features"""
        if 'return_date' in df.columns:
            df['return_date'] = pd.to_datetime(df['return_date'])
            
            # Basic temporal features
            df['return_year'] = df['return_date'].dt.year
            df['return_month'] = df['return_date'].dt.month
            df['return_quarter'] = df['return_date'].dt.quarter
            df['return_dayofweek'] = df['return_date'].dt.dayofweek
            df['return_dayofyear'] = df['return_date'].dt.dayofyear
            df['is_weekend'] = (df['return_dayofweek'] >= 5).astype(int)
            df['is_month_end'] = df['return_date'].dt.is_month_end.astype(int)
            
            # Seasonal features
            df['season'] = df['return_month'].map({
                12: 'winter', 1: 'winter', 2: 'winter',
                3: 'spring', 4: 'spring', 5: 'spring',
                6: 'summer', 7: 'summer', 8: 'summer',
                9: 'autumn', 10: 'autumn', 11: 'autumn'
            })
            
            # Festival/holiday proximity (Indian context)
            df['is_festival_season'] = df['return_month'].isin([10, 11, 12]).astype(int)
            
            # Item age calculation
            if 'manufacturing_date' in df.columns:
                df['manufacturing_date'] = pd.to_datetime(df['manufacturing_date'])
                df['item_age_days'] = (df['return_date'] - df['manufacturing_date']).dt.days
                df['item_age_months'] = df['item_age_days'] / 30.44
                df['item_age_category'] = pd.cut(
                    df['item_age_days'],
                    bins=[0, 30, 90, 180, 365, float('inf')],
                    labels=['very_new', 'new', 'recent', 'old', 'very_old']
                )
        
        return df
    
    def _create_price_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create price-based features"""
        if 'original_price' in df.columns:
            # Price categories
            df['price_log'] = np.log1p(df['original_price'])
            df['price_sqrt'] = np.sqrt(df['original_price'])
            
            # Price percentiles within category
            if 'category' in df.columns:
                df['price_percentile_in_category'] = df.groupby('category')['original_price'].rank(pct=True)
            
            # Price bins
            df['price_bin'] = pd.cut(
                df['original_price'],
                bins=[0, 500, 2000, 10000, 50000, float('inf')],
                labels=['budget', 'economy', 'mid_range', 'premium', 'luxury']
            )
            
            # Price per age ratio
            if 'item_age_days' in df.columns:
                df['price_per_day'] = df['original_price'] / np.maximum(df['item_age_days'], 1)
        
        return df
    
    def _create_text_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create features from text fields"""
        if 'return_reason' in df.columns:
            # Basic text statistics
            df['reason_length'] = df['return_reason'].str.len()
            df['reason_word_count'] = df['return_reason'].str.split().str.len()
            
            # Sentiment analysis (simplified)
            negative_words = ['defective', 'broken', 'damaged', 'poor', 'bad', 'terrible', 'awful', 'horrible']
            neutral_words = ['size', 'color', 'changed mind', 'duplicate', 'wrong', 'different']
            quality_words = ['quality', 'performance', 'functionality', 'working', 'function']
            
            df['reason_negative_words'] = df['return_reason'].str.lower().str.count('|'.join(negative_words))
            df['reason_neutral_words'] = df['return_reason'].str.lower().str.count('|'.join(neutral_words))
            df['reason_quality_words'] = df['return_reason'].str.lower().str.count('|'.join(quality_words))
            
            # Reason categories
            df['reason_category'] = 'other'
            df.loc[df['return_reason'].str.contains('size|fit', case=False, na=False), 'reason_category'] = 'sizing'
            df.loc[df['return_reason'].str.contains('defective|broken|damaged', case=False, na=False), 'reason_category'] = 'defective'
            df.loc[df['return_reason'].str.contains('color|appearance|look', case=False, na=False), 'reason_category'] = 'appearance'
            df.loc[df['return_reason'].str.contains('changed mind|don\'t want', case=False, na=False), 'reason_category'] = 'changed_mind'
        
        if 'product_name' in df.columns:
            df['product_name_length'] = df['product_name'].str.len()
            df['product_name_words'] = df['product_name'].str.split().str.len()
        
        return df
    
    def _create_categorical_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create categorical feature encodings"""
        categorical_cols = ['category', 'condition', 'purchase_channel', 'location', 'warranty_status']
        
        for col in categorical_cols:
            if col in df.columns:
                # Frequency encoding
                freq_map = df[col].value_counts().to_dict()
                df[f'{col}_frequency'] = df[col].map(freq_map)
                
                # Target encoding (simplified - would use proper target encoding in production)
                if 'value_recovered' in df.columns:
                    target_map = df.groupby(col)['value_recovered'].mean().to_dict()
                    df[f'{col}_target_encoded'] = df[col].map(target_map)
        
        return df
    
    def _create_interaction_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create interaction features"""
        # Category-condition interaction
        if 'category' in df.columns and 'condition' in df.columns:
            df['category_condition'] = df['category'] + '_' + df['condition']
        
        # Price-age interaction
        if 'original_price' in df.columns and 'item_age_days' in df.columns:
            df['price_age_ratio'] = df['original_price'] / np.maximum(df['item_age_days'], 1)
        
        # Customer-category interaction
        if 'customer_age' in df.columns and 'category' in df.columns:
            df['customer_category_match'] = 0
            # Electronics popular with younger customers
            df.loc[(df['category'] == 'Electronics') & (df['customer_age'] < 35), 'customer_category_match'] = 1
            # Fashion popular with all ages
            df.loc[df['category'] == 'Fashion', 'customer_category_match'] = 1
            # Appliances popular with older customers
            df.loc[(df['category'] == 'Appliances') & (df['customer_age'] > 25), 'customer_category_match'] = 1
        
        return df
    
    def _create_aggregated_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create aggregated features"""
        # Customer-level aggregations
        if 'customer_id' in df.columns:
            customer_stats = df.groupby('customer_id').agg({
                'original_price': ['mean', 'std', 'count'],
                'return_date': 'count'
            }).round(2)
            
            customer_stats.columns = ['customer_avg_price', 'customer_price_std', 'customer_price_count', 'customer_return_count']
            df = df.merge(customer_stats, left_on='customer_id', right_index=True, how='left')
        
        # Location-level aggregations
        if 'location' in df.columns:
            location_stats = df.groupby('location').agg({
                'original_price': 'mean',
                'return_date': 'count'
            }).round(2)
            
            location_stats.columns = ['location_avg_price', 'location_return_count']
            df = df.merge(location_stats, left_on='location', right_index=True, how='left')
        
        # Category-level aggregations
        if 'category' in df.columns:
            category_stats = df.groupby('category').agg({
                'original_price': 'mean',
                'value_recovered': 'mean' if 'value_recovered' in df.columns else 'count'
            }).round(2)
            
            category_stats.columns = ['category_avg_price', 'category_avg_recovery']
            df = df.merge(category_stats, left_on='category', right_index=True, how='left')
        
        return df

class DataPipeline:
    """Main data pipeline orchestrator"""
    
    def __init__(self, config_path: str = "config/data_sources.json"):
        self.config_path = config_path
        self.data_sources = self._load_config()
        self.validator = DataValidator()
        self.feature_engineer = FeatureEngineer()
        self.cache = {}
    
    def _load_config(self) -> List[DataSource]:
        """Load data source configuration"""
        if os.path.exists(self.config_path):
            with open(self.config_path, 'r') as f:
                config = json.load(f)
                return [DataSource(**source) for source in config['data_sources']]
        else:
            # Default configuration
            return [
                DataSource(
                    name="returns_db",
                    type="database",
                    connection_string="sqlite:///data/returns.db",
                    query="SELECT * FROM return_items WHERE created_at >= date('now', '-30 days')"
                ),
                DataSource(
                    name="product_catalog",
                    type="api",
                    connection_string="https://api.smartreturns.com/products",
                    refresh_interval=86400  # Daily
                )
            ]
    
    async def extract_data(self, source_name: str) -> pd.DataFrame:
        """Extract data from specified source"""
        source = next((s for s in self.data_sources if s.name == source_name), None)
        if not source:
            raise ValueError(f"Data source '{source_name}' not found")
        
        # Check cache first
        cache_key = f"{source_name}_{int(datetime.now().timestamp() // source.refresh_interval)}"
        if cache_key in self.cache:
            logger.info(f"Using cached data for {source_name}")
            return self.cache[cache_key]
        
        logger.info(f"Extracting data from {source_name}")
        
        if source.type == "database":
            df = await self._extract_from_database(source)
        elif source.type == "api":
            df = await self._extract_from_api(source)
        elif source.type == "file":
            df = await self._extract_from_file(source)
        else:
            raise ValueError(f"Unsupported source type: {source.type}")
        
        # Cache the result
        self.cache[cache_key] = df
        
        return df
    
    async def _extract_from_database(self, source: DataSource) -> pd.DataFrame:
        """Extract data from database"""
        try:
            if source.connection_string.startswith("sqlite"):
                # SQLite connection
                db_path = source.connection_string.replace("sqlite:///", "")
                conn = sqlite3.connect(db_path)
                df = pd.read_sql_query(source.query or "SELECT * FROM return_items", conn)
                conn.close()
            else:
                # For other databases, would use appropriate connectors
                # PostgreSQL: psycopg2, MySQL: pymysql, etc.
                raise NotImplementedError("Only SQLite supported in this demo")
            
            logger.info(f"Extracted {len(df)} records from database")
            return df
            
        except Exception as e:
            logger.error(f"Database extraction failed: {e}")
            return pd.DataFrame()  # Return empty DataFrame on failure
    
    async def _extract_from_api(self, source: DataSource) -> pd.DataFrame:
        """Extract data from API"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(source.connection_string) as response:
                    if response.status == 200:
                        data = await response.json()
                        df = pd.DataFrame(data.get('data', []))
                        logger.info(f"Extracted {len(df)} records from API")
                        return df
                    else:
                        logger.error(f"API request failed with status {response.status}")
                        return pd.DataFrame()
        
        except Exception as e:
            logger.error(f"API extraction failed: {e}")
            return pd.DataFrame()
    
    async def _extract_from_file(self, source: DataSource) -> pd.DataFrame:
        """Extract data from file"""
        try:
            file_path = source.connection_string
            
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            elif file_path.endswith('.json'):
                df = pd.read_json(file_path)
            elif file_path.endswith('.xlsx'):
                df = pd.read_excel(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_path}")
            
            logger.info(f"Extracted {len(df)} records from file")
            return df
            
        except Exception as e:
            logger.error(f"File extraction failed: {e}")
            return pd.DataFrame()
    
    def transform_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Transform and clean data"""
        logger.info(f"Transforming {len(df)} records")
        
        # Validate and clean
        cleaned_df, validation_errors = self.validator.validate_dataframe(df)
        
        # Feature engineering
        transformed_df = self.feature_engineer.create_features(cleaned_df)
        
        logger.info(f"Transformation complete. Output: {len(transformed_df)} records, {len(transformed_df.columns)} features")
        
        return transformed_df, validation_errors
    
    def load_data(self, df: pd.DataFrame, destination: str):
        """Load transformed data to destination"""
        logger.info(f"Loading {len(df)} records to {destination}")
        
        if destination.startswith("sqlite"):
            # Save to SQLite
            db_path = destination.replace("sqlite:///", "")
            os.makedirs(os.path.dirname(db_path), exist_ok=True)
            
            conn = sqlite3.connect(db_path)
            df.to_sql('processed_returns', conn, if_exists='replace', index=False)
            conn.close()
            
        elif destination.endswith('.csv'):
            # Save to CSV
            os.makedirs(os.path.dirname(destination), exist_ok=True)
            df.to_csv(destination, index=False)
            
        elif destination.endswith('.parquet'):
            # Save to Parquet
            os.makedirs(os.path.dirname(destination), exist_ok=True)
            df.to_parquet(destination, index=False)
        
        logger.info(f"Data loaded successfully to {destination}")
    
    async def run_pipeline(self, source_name: str, destination: str) -> Dict:
        """Run complete ETL pipeline"""
        start_time = datetime.now()
        
        try:
            # Extract
            raw_data = await self.extract_data(source_name)
            
            if raw_data.empty:
                return {
                    'status': 'failed',
                    'error': 'No data extracted',
                    'duration': 0
                }
            
            # Transform
            transformed_data, errors = self.transform_data(raw_data)
            
            # Load
            self.load_data(transformed_data, destination)
            
            duration = (datetime.now() - start_time).total_seconds()
            
            return {
                'status': 'success',
                'records_processed': len(transformed_data),
                'features_created': len(transformed_data.columns),
                'validation_errors': errors,
                'duration_seconds': duration,
                'output_path': destination
            }
            
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            return {
                'status': 'failed',
                'error': str(e),
                'duration': (datetime.now() - start_time).total_seconds()
            }
    
    def create_training_dataset(self, df: pd.DataFrame, target_column: str = 'actual_disposition') -> Tuple[pd.DataFrame, pd.Series]:
        """Create training dataset for ML models"""
        # Select feature columns (exclude target and metadata)
        exclude_cols = [
            target_column, 'sku', 'product_name', 'customer_id', 
            'return_date', 'manufacturing_date'
        ]
        
        feature_cols = [col for col in df.columns if col not in exclude_cols]
        
        X = df[feature_cols]
        y = df[target_column] if target_column in df.columns else None
        
        # Handle categorical variables
        categorical_cols = X.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            X[col] = pd.Categorical(X[col]).codes
        
        # Handle missing values
        X = X.fillna(X.median())
        
        logger.info(f"Training dataset created: {X.shape[0]} samples, {X.shape[1]} features")
        
        return X, y
    
    def generate_data_quality_report(self, df: pd.DataFrame) -> Dict:
        """Generate comprehensive data quality report"""
        report = {
            'overview': {
                'total_records': len(df),
                'total_features': len(df.columns),
                'memory_usage_mb': df.memory_usage(deep=True).sum() / 1024 / 1024,
                'date_range': {
                    'start': df['return_date'].min() if 'return_date' in df.columns else None,
                    'end': df['return_date'].max() if 'return_date' in df.columns else None
                }
            },
            'missing_values': df.isnull().sum().to_dict(),
            'data_types': df.dtypes.astype(str).to_dict(),
            'categorical_distributions': {},
            'numerical_statistics': {},
            'outliers': {},
            'duplicates': df.duplicated().sum()
        }
        
        # Categorical distributions
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            report['categorical_distributions'][col] = df[col].value_counts().head(10).to_dict()
        
        # Numerical statistics
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        for col in numerical_cols:
            stats = df[col].describe()
            report['numerical_statistics'][col] = {
                'mean': stats['mean'],
                'std': stats['std'],
                'min': stats['min'],
                'max': stats['max'],
                'median': stats['50%']
            }
            
            # Detect outliers using IQR method
            Q1 = stats['25%']
            Q3 = stats['75%']
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
            report['outliers'][col] = len(outliers)
        
        return report

# Example usage and testing
async def main():
    """Example usage of the data pipeline"""
    
    # Initialize pipeline
    pipeline = DataPipeline()
    
    # Create sample data for testing
    sample_data = pd.DataFrame({
        'sku': ['SKU001', 'SKU002', 'SKU003', 'SKU004', 'SKU005'] * 20,
        'product_name': ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'] * 20,
        'category': ['Electronics', 'Fashion', 'Appliances', 'Home & Kitchen', 'Electronics'] * 20,
        'condition': ['good', 'new', 'fair', 'lightly-used', 'poor'] * 20,
        'return_reason': [
            'Defective on arrival',
            'Wrong size ordered',
            'Changed mind about purchase',
            'Better price found elsewhere',
            'Quality not as expected'
        ] * 20,
        'original_price': np.random.uniform(500, 50000, 100),
        'customer_age': np.random.randint(18, 70, 100),
        'purchase_channel': ['online', 'store', 'mobile-app'] * 33 + ['online'],
        'location': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'] * 20,
        'return_date': pd.date_range('2024-01-01', periods=100, freq='D'),
        'manufacturing_date': pd.date_range('2023-01-01', periods=100, freq='D'),
        'warranty_status': ['active', 'expired', 'n/a'] * 33 + ['active'],
        'seasonality': ['high', 'medium', 'low'] * 33 + ['medium'],
        'market_demand': ['high', 'medium', 'low'] * 33 + ['high'],
        'actual_disposition': ['resale', 'repair', 'recycle', 'donate'] * 25,
        'value_recovered': np.random.uniform(100, 30000, 100)
    })
    
    # Save sample data
    os.makedirs('data', exist_ok=True)
    sample_data.to_csv('data/sample_returns.csv', index=False)
    
    # Transform data
    transformed_data, errors = pipeline.transform_data(sample_data)
    
    print("Data Pipeline Results:")
    print(f"Original records: {len(sample_data)}")
    print(f"Transformed records: {len(transformed_data)}")
    print(f"Features created: {len(transformed_data.columns)}")
    print(f"Validation errors: {len(errors)}")
    
    if errors:
        print("\nValidation Errors:")
        for error in errors[:5]:  # Show first 5 errors
            print(f"  - {error}")
    
    # Generate data quality report
    quality_report = pipeline.generate_data_quality_report(transformed_data)
    
    print(f"\nData Quality Report:")
    print(f"Total records: {quality_report['overview']['total_records']}")
    print(f"Total features: {quality_report['overview']['total_features']}")
    print(f"Memory usage: {quality_report['overview']['memory_usage_mb']:.2f} MB")
    print(f"Duplicates: {quality_report['duplicates']}")
    
    print("\nMissing values:")
    missing_values = {k: v for k, v in quality_report['missing_values'].items() if v > 0}
    for col, count in list(missing_values.items())[:5]:
        print(f"  {col}: {count}")
    
    print("\nOutliers detected:")
    outliers = {k: v for k, v in quality_report['outliers'].items() if v > 0}
    for col, count in list(outliers.items())[:5]:
        print(f"  {col}: {count}")
    
    # Create training dataset
    X, y = pipeline.create_training_dataset(transformed_data)
    print(f"\nTraining dataset: {X.shape[0]} samples, {X.shape[1]} features")
    
    # Save processed data
    pipeline.load_data(transformed_data, 'data/processed_returns.csv')
    print("Processed data saved to data/processed_returns.csv")

if __name__ == "__main__":
    asyncio.run(main())