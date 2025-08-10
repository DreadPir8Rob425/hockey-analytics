#!/bin/bash

# Data Migration Setup Script
# This script sets up the Python environment for data migration scripts

echo "🏒 Setting up Hockey Analytics Data Migration Environment"
echo "========================================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    echo "Please install pip and try again."
    exit 1
fi

echo "✅ pip3 found"

# Create virtual environment (optional but recommended)
read -p "🤔 Create a virtual environment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
    echo "🔧 Activating virtual environment..."
    source venv/bin/activate
    echo "✅ Virtual environment created and activated"
    echo "💡 To activate later: source venv/bin/activate"
fi

# Install required packages
echo "📦 Installing required Python packages..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ All packages installed successfully"
else
    echo "❌ Error installing packages"
    exit 1
fi

# Check for CSV file
CSV_FILE="data/shots_2024.csv"
if [ -f "$CSV_FILE" ]; then
    echo "✅ CSV file found: $CSV_FILE"
    FILE_SIZE=$(ls -lh "$CSV_FILE" | awk '{print $5}')
    echo "   📊 File size: $FILE_SIZE"
else
    echo "⚠️  CSV file not found: $CSV_FILE"
    echo "   📥 Please ensure the NHL shots data is in the data/ directory"
fi

# Create .env file from template
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file from template..."
    cp .env.template .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env file with your Supabase credentials"
    echo "   📝 Required: SUPABASE_URL and SUPABASE_ANON_KEY"
else
    echo "✅ .env file already exists"
fi

# Set executable permissions on scripts
echo "🔧 Setting executable permissions on Python scripts..."
chmod +x scripts/*.py

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file with your Supabase credentials"
echo "2. Ensure CSV file is available at: $CSV_FILE"
echo "3. Choose and run appropriate migration script:"
echo "   - For development: python3 scripts/import_now.py"
echo "   - For production: python3 scripts/import_shots_to_supabase.py"
echo "   - For fresh start: python3 scripts/clear_and_import.py"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Complete documentation"
echo "   - docs/data-schema.md - Data schema reference"
echo ""
echo "🚀 Ready to migrate your NHL data!"
