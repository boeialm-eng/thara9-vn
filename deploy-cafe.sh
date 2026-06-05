#!/bin/bash
# รันสคริปต์นี้หลังตั้ง GEMINI_API_KEY แล้ว
# Usage: GEMINI_API_KEY="AIza..." bash deploy-cafe.sh

set -e
cd "$(dirname "$0")"

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ ต้องตั้ง GEMINI_API_KEY ก่อน:"
  echo "   GEMINI_API_KEY='AIza...' bash deploy-cafe.sh"
  exit 1
fi

echo "▶ เจนภาพ cafe event (12 รูป)..."
node generate.mjs

echo ""
echo "▶ Copy ภาพใหม่ไปที่ /tmp/thara9-vn/assets/ ..."
cp assets/cafe_event_*.png /tmp/thara9-vn/assets/

echo ""
echo "▶ Push ขึ้น GitHub..."
cd /tmp/thara9-vn
git add assets/cafe_event_*.png
git commit -m "feat: เพิ่มภาพ event 12 จุดวิกฤต ร้านสุขใจ (cafe_event_*.png)"
git push origin main

echo ""
echo "✅ เสร็จ! ดูได้ที่ https://boeialm-eng.github.io/thara9-vn/cafe-game.html"
echo "   (GitHub Pages อาจใช้เวลา 1-2 นาที)"
