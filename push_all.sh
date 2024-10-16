#!/bin/bash

# قائمة المخازن التي تحتوي على "cloudflare" فقط
repos=(
    "https://github.com/waelkamira/cartoon_cloudflare"
    "https://github.com/waelkamira/cartoon_cloudflare_repo1.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo2.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo3.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo4.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo5.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo6.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo7.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo8.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo9.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo10.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo11.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo12.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo13.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo14.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo15.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo16.git"
    "https://github.com/waelkamira/cartoon_cloudflare_repo17.git"
)

# الدليل الأساسي الذي يحتوي على جميع المشاريع
base_dir="J:/cloudflare"

# التحقق من وجود الدليل
if [ ! -d "$base_dir" ]; then
    echo "The base directory does not exist: $base_dir"
    exit 1
fi

# البدء في عملية الدفع لكل مخزن
for repo in "${repos[@]}"
do
    # استخراج اسم المشروع من عنوان URL
    project_name=$(basename "$repo" .git)

    # الدليل المحلي للمشروع
    project_dir="$base_dir/$project_name"

    # التحقق من وجود الدليل المحلي للمشروع
    if [ ! -d "$project_dir" ]; then
        echo "Directory for project $project_name does not exist: $project_dir"
        continue
    fi

    # الانتقال إلى دليل المشروع
    cd "$project_dir" || exit

    # سحب آخر التحديثات من المخزن البعيد
    git pull origin main || {
        echo "Failed to pull latest changes for $project_name."
        continue
    }

    # التحقق من وجود تغييرات غير مدفوعة
    if git status --porcelain | grep .; then
        echo "Found uncommitted changes in $project_name. Committing changes..."
        git add .
        git commit -m "Auto commit changes before pushing"
    fi

    # الدفع إلى المخزن البعيد
    git push origin main || {
        echo "Failed to push to $project_name. Check your connection and permissions."
        continue
    }

    echo "Successfully pushed to $project_name."
done
