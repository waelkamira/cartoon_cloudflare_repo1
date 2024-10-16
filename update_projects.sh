#!/bin/bash

# المشروع الذي يحتوي على التغييرات
source_project="J:/cartoon - Copy"

# قائمة المخازن الأخرى
repos=(
    "J:/cloudflare/cloudflare_repo1"
    "J:/cloudflare/cloudflare_repo2"
    "J:/cloudflare/cloudflare_repo3"
    "J:/cloudflare/cloudflare_repo4"
    "J:/cloudflare/cloudflare_repo5"
    "J:/cloudflare/cloudflare_repo6"
    "J:/cloudflare/cloudflare_repo7"
    "J:/cloudflare/cloudflare_repo8"
    "J:/cloudflare/cloudflare_repo9"
    "J:/cloudflare/cloudflare_repo10"
    "J:/cloudflare/cloudflare_repo11"
    "J:/cloudflare/cloudflare_repo12"
    "J:/cloudflare/cloudflare_repo13"
    "J:/cloudflare/cloudflare_repo14"
    "J:/cloudflare/cloudflare_repo15"
    "J:/cloudflare/cloudflare_repo16"
    "J:/cloudflare/cloudflare_repo17"
)

# نسخ التغييرات مع استثناء المجلدات .git و .vercel واستبدال الملفات بالكامل
for repo in "${repos[@]}"; do
    # استخدام cp مع خيارات استبدال الملفات
    cp -r "$source_project/"* "$repo/" --exclude='.git' --exclude='.vercel'

    # التحقق من نجاح العملية
    if [ $? -eq 0 ]; then
        echo "Successfully updated $repo with changes from $source_project."
    else
        echo "Failed to update $repo. Please check for errors."
    fi
done
