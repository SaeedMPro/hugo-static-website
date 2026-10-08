# وب‌سایت گروه پژوهشی شبکه‌های کامپیوتری، دانشگاه بوعلی سینا (نسخهٔ نمایشی)

سایت ایستا و دوزبانه (فارسی و انگلیسی) ساخته‌شده با [Hugo](https://gohugo.io). نام‌ها و داده‌های این نسخه ساختگی هستند.

## انتشار روی GitHub Pages

1. یک مخزن جدید در GitHub بسازید (مثلاً `netlab-demo`).
2. محتوای این پوشه را در آن push کنید:
   ```bash
   git init
   git add .
   git commit -m "Initial demo"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/netlab-demo.git
   git push -u origin main
   ```
3. در مخزن به **Settings ← Pages** بروید و در بخش **Build and deployment** گزینهٔ **Source** را روی **GitHub Actions** بگذارید.
4. در تب **Actions** صبر کنید تا اجرای «Deploy Hugo site to Pages» سبز شود. سایت روی `https://<USERNAME>.github.io/netlab-demo/` در دسترس است.

از این به بعد هر push به شاخهٔ `main` سایت را دوباره می‌سازد و منتشر می‌کند.

## اجرای محلی

[Hugo Extended](https://gohugo.io/installation/) نسخهٔ 0.139.0 یا بالاتر را نصب کنید، سپس:

```bash
hugo server
```

سایت روی `http://localhost:1313` باز می‌شود.

## افزودن و ویرایش محتوا

| کار | فایل |
| --- | --- |
| عضو جدید | یکی از فایل‌های `data/people/` را کپی کنید، نام فایل را شناسهٔ انگلیسی عضو بگذارید و فیلدها را پر کنید |
| عکس عضو | فایل عکس را در `static/people/` بگذارید (مثلاً `karimi.jpg`، ترجیحاً مربعی و حدود ۴۰۰×۴۰۰ پیکسل) و در فایل عضو بنویسید `photo: "people/karimi.jpg"`. اگر خالی بماند عکس پیش‌فرض نمایش داده می‌شود |
| رزومهٔ عضو | فایل PDF را در `static/cv/` بگذارید و در فایل عضو بنویسید `cv: "cv/karimi.pdf"` |
| فارغ‌التحصیلی عضو | در فایل همان عضو `status: alumni` بگذارید و `end_year` و `position_fa`/`position_en` را پر کنید |
| مقاله | یک مورد به `data/publications.yaml` اضافه کنید؛ در `authors` شناسهٔ اعضای گروه را بنویسید تا به صفحهٔ آن‌ها پیوند بخورد |
| پروژه | یک فایل در `data/projects/` |
| خبر | یک فایل Markdown در `content/fa/news/` (و در صورت نیاز `content/en/news/`) |
| صفحه‌های ثابت | `content/fa/about.md`، `join.md`، `contact.md` و نسخه‌های انگلیسی در `content/en/` |
| متن‌های رابط کاربری | `i18n/fa.toml` و `i18n/en.toml` |

برای حذف نوار «نسخهٔ نمایشی»، در `hugo.toml` مقدار `demo` را `false` کنید.

## ساختار

```
data/            داده‌های اعضا، پروژه‌ها و انتشارات
content/fa, en   صفحه‌ها و اخبار هر زبان
layouts/         قالب‌ها
assets/css/      استایل (واکنش‌گرا، حالت تیره خودکار)
static/fonts/    فونت وزیرمتن (مجوز SIL OFL)
```
