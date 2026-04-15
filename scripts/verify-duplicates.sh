#!/bin/bash
# Verify no duplicate questions exist across all JSON files

cd /root/.openclaw/workspace/projects/curiosity-hour

echo "=== Checking for duplicate questions across JSON files ==="
echo ""

# Extract all question texts and check for duplicates
all_questions=$(cat *.json 2>/dev/null | grep -o '"text": "[^"]*"' | sort | uniq -d)

if [ -z "$all_questions" ]; then
    echo "✅ No duplicate questions found across all JSON files!"
else
    echo "❌ Duplicate questions found:"
    echo "$all_questions"
    exit 1
fi

echo ""
echo "=== Checking individual files for internal duplicates ==="
for file in *.json; do
    if [ -f "$file" ]; then
        duplicates=$(cat "$file" | grep -o '"text": "[^"]*"' | sort | uniq -d)
        if [ -n "$duplicates" ]; then
            echo "❌ Duplicates in $file:"
            echo "$duplicates"
            exit 1
        fi
    fi
done

echo "✅ All files passed - no internal duplicates!"
echo ""
echo "=== Verification Complete ==="
