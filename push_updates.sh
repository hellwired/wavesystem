
# Script to automate pushing changes to GitHub

# Navigate to the project directory to ensure we are in the right place
CDir='/var/www/html/wavesystem/wavesystem-next'
if [ "$(pwd)" != "$CDir" ]; then
    echo "Navigating to $CDir"
    cd "$CDir"
fi

# Check if there are changes to commit
if [[ -z $(git status -s) ]]; then
    echo "✅ No pending changes to save."
    exit 0
fi

# Determine commit message
MESSAGE="$1"
if [ -z "$MESSAGE" ]; then
    # If no message provided, use a timestamp
    MESSAGE="Auto-update: $(date +'%Y-%m-%d %H:%M:%S')"
fi

echo "📦 Adding files..."
git add .

echo "💾 Committing: '$MESSAGE'..."
git commit -m "$MESSAGE"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Complete! Changes uploaded successfully."
