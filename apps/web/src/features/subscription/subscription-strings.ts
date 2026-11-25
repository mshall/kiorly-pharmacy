import i18n from "@/lib/i18n";

/** SUB-01 wording, merged at runtime under `sub` (shared locale files stay untouched). Arabic copy review and every renewal/charging sentence are NEEDS_HUMAN (LG-SUB-2). No prices: amounts come from the plan catalog. */
const EN = {
  "title": "Plan and subscription", "intro": "See what each plan includes, manage renewal and upgrade any time. Your data is never deleted when a plan changes.",
  "loading": "Loading your plan", "loadError": "We could not load your plan.", "retry": "Try again", "current": "Current plan", "free": "Free", "priceTbd": "Price to be confirmed",
  "perMonth": "per month", "perYear": "per year", "monthly": "Monthly", "annual": "Annual", "intervalLabel": "Billing period",
  "renewsOn": "Renews automatically on {{date}}", "endsOn": "Ends on {{date}}, then moves to the free plan", "freeNow": "You are on the free plan. Upgrade to bring back more features.",
  "autoRenew": "Automatic renewal", "autoRenewOn": "On: your plan renews on its own and the saved card is charged", "autoRenewOff": "Off: your plan ends on {{date}} and moves to the free plan",
  "forcedOn": "Set to ON by Kiorly support. Contact support to change it.", "forcedOff": "Set to OFF by Kiorly support. Contact support to change it.", "ownerOnly": "Only the pharmacy owner can change renewal.",
  "offTitle": "Turn off automatic renewal?", "offLead": "You keep your current plan until {{date}}. After that your pharmacy moves to the free plan. Nothing is deleted.",
  "offWhat": "What changes on the free plan", "offLost": "Features that stop being available", "offLimits": "Limits that get lower", "offLimitRow": "{{label}}: {{from}} to {{to}} (you use {{current}})",
  "offOver": "{{count}} over the new limit. Nobody is removed; adding more is blocked until you upgrade.", "offKept": "Your stock, prescriptions, sales and records stay safe. For {{days}} days the features you lose stay readable, and they return in full when you upgrade.",
  "offCheck": "I understand that my plan moves to the free plan on {{date}}.", "offConfirm": "Turn off renewal", "keep": "Keep renewal on", "cancel": "Cancel", "offDone": "Automatic renewal is off.", "onDone": "Automatic renewal is on.",
  "unlimited": "Unlimited", "usage": "Usage against your limits", "usageRow": "{{current}} of {{limit}}", "users": "Staff users", "branches": "Branches",
  "graceTitle": "Some features are read-only", "graceBody": "After moving to the free plan, the features you no longer have stay readable until {{date}}. Upgrade to edit them again.",
  "payment": "Payment method", "noCard": "No saved card. Add one so your plan can renew.", "card": "{{brand}} ending {{last4}}", "addCard": "Add test card (mock mode)", "cardNote": "Card entry runs on the payment provider's hosted page once it is connected. Until then this adds a mock card.",
  "invoices": "Invoice history", "noInvoices": "No invoices yet.", "colNumber": "Invoice", "colPeriod": "Period", "colTotal": "Total", "colStatus": "Status",
  "compare": "Compare plans", "compareHint": "Everything below comes from the plan catalog.", "featureCol": "Feature", "included": "Included", "notIncluded": "Not included", "limits": "Limits", "features": "Features",
  "upgrade": "Upgrade", "reactivate": "Return to {{plan}}", "lowerPlan": "Lower plan", "whatLose": "If you move to this plan", "nothingLost": "You would not lose any feature.", "planNow": "Your plan",
  "confirmTitle": "Upgrade to {{plan}}?", "confirmBody": "The plan starts today and renews automatically. You can turn renewal off at any time.", "confirm": "Confirm upgrade", "upgraded": "Your plan is updated.", "needsCard": "Add a card so the first renewal can be charged.",
  "lapse": "If a payment cannot be collected we retry and remind you. After {{days}} days your pharmacy moves to the free plan; nothing is locked or deleted.", "reminders": "We remind you {{days}} days before each renewal.", "tax": "Tax of {{rate}}% is added at invoicing where it applies.",
  "status_ACTIVE": "Active", "status_PAST_DUE": "Payment overdue", "inv_PAID": "Paid", "inv_ISSUED": "Due", "inv_VOID": "Void",
  "cap_kiorex_orders": "Kiorex orders", "cap_purchasing": "Purchasing", "cap_forecasting": "Forecasting", "cap_transfers": "Branch transfers", "cap_central_price_book": "Central price book", "cap_insurer_claims": "Insurer claims", "cap_insurer_claims (add-on)": "Insurer claims (add-on)",
  "ed_LITE": "Lite", "ed_PRO": "Pro", "ed_CHAIN": "Chain", "ed_ENTERPRISE": "Enterprise", "nav": "Plan and subscription",
};
const AR: typeof EN = {
  "title": "الخطة والاشتراك", "intro": "اطّلع على ما تشمله كل خطة، وأدِر التجديد، وقم بالترقية في أي وقت. بياناتك لا تُحذف أبداً عند تغيير الخطة.",
  "loading": "جارٍ تحميل خطتك", "loadError": "تعذّر تحميل خطتك.", "retry": "حاول مرة أخرى", "current": "الخطة الحالية", "free": "مجانية", "priceTbd": "السعر سيُعلَن لاحقاً",
  "perMonth": "شهرياً", "perYear": "سنوياً", "monthly": "شهري", "annual": "سنوي", "intervalLabel": "فترة الفوترة",
  "renewsOn": "تتجدد تلقائياً في {{date}}", "endsOn": "تنتهي في {{date}} ثم تنتقل إلى الخطة المجانية", "freeNow": "أنت على الخطة المجانية. قم بالترقية لاستعادة مزيد من المزايا.",
  "autoRenew": "التجديد التلقائي", "autoRenewOn": "مفعّل: تتجدد خطتك تلقائياً ويُخصم من البطاقة المحفوظة", "autoRenewOff": "متوقف: تنتهي خطتك في {{date}} وتنتقل إلى الخطة المجانية",
  "forcedOn": "تم تفعيله من دعم كيورلي. تواصل مع الدعم لتغييره.", "forcedOff": "تم إيقافه من دعم كيورلي. تواصل مع الدعم لتغييره.", "ownerOnly": "يمكن لمالك الصيدلية فقط تغيير التجديد.",
  "offTitle": "إيقاف التجديد التلقائي؟", "offLead": "تبقى على خطتك الحالية حتى {{date}}. بعد ذلك تنتقل صيدليتك إلى الخطة المجانية. لا يُحذف أي شيء.",
  "offWhat": "ما الذي يتغير في الخطة المجانية", "offLost": "مزايا لن تكون متاحة", "offLimits": "حدود تنخفض", "offLimitRow": "{{label}}: من {{from}} إلى {{to}} (تستخدم {{current}})",
  "offOver": "{{count}} فوق الحد الجديد. لا يُزال أحد، ويُمنع إضافة المزيد إلى أن تقوم بالترقية.", "offKept": "مخزونك ووصفاتك ومبيعاتك وسجلاتك محفوظة. لمدة {{days}} يوماً تبقى المزايا التي تفقدها قابلة للقراءة، وتعود كاملة عند الترقية.",
  "offCheck": "أفهم أن خطتي تنتقل إلى الخطة المجانية في {{date}}.", "offConfirm": "إيقاف التجديد", "keep": "إبقاء التجديد مفعّلاً", "cancel": "إلغاء", "offDone": "تم إيقاف التجديد التلقائي.", "onDone": "تم تفعيل التجديد التلقائي.",
  "unlimited": "غير محدود", "usage": "الاستخدام مقابل حدودك", "usageRow": "{{current}} من {{limit}}", "users": "مستخدمو الفريق", "branches": "الفروع",
  "graceTitle": "بعض المزايا للقراءة فقط", "graceBody": "بعد الانتقال إلى الخطة المجانية تبقى المزايا التي لم تعد لديك قابلة للقراءة حتى {{date}}. قم بالترقية لتعديلها من جديد.",
  "payment": "وسيلة الدفع", "noCard": "لا توجد بطاقة محفوظة. أضف واحدة ليتمكن النظام من تجديد خطتك.", "card": "{{brand}} تنتهي بـ {{last4}}", "addCard": "إضافة بطاقة تجريبية (وضع المحاكاة)", "cardNote": "يتم إدخال البطاقة في صفحة مزوّد الدفع الآمنة بعد ربطه. إلى ذلك الحين تُضاف بطاقة تجريبية.",
  "invoices": "سجل الفواتير", "noInvoices": "لا توجد فواتير بعد.", "colNumber": "الفاتورة", "colPeriod": "الفترة", "colTotal": "الإجمالي", "colStatus": "الحالة",
  "compare": "قارن الخطط", "compareHint": "كل ما يلي مأخوذ من كتالوج الخطط.", "featureCol": "الميزة", "included": "مشمولة", "notIncluded": "غير مشمولة", "limits": "الحدود", "features": "المزايا",
  "upgrade": "ترقية", "reactivate": "العودة إلى {{plan}}", "lowerPlan": "خطة أقل", "whatLose": "إذا انتقلت إلى هذه الخطة", "nothingLost": "لن تفقد أي ميزة.", "planNow": "خطتك",
  "confirmTitle": "الترقية إلى {{plan}}؟", "confirmBody": "تبدأ الخطة اليوم وتتجدد تلقائياً. يمكنك إيقاف التجديد في أي وقت.", "confirm": "تأكيد الترقية", "upgraded": "تم تحديث خطتك.", "needsCard": "أضف بطاقة ليتم خصم أول تجديد.",
  "lapse": "إذا تعذّر تحصيل دفعة نعيد المحاولة ونذكّرك. بعد {{days}} يوماً تنتقل صيدليتك إلى الخطة المجانية؛ لا يُقفل شيء ولا يُحذف.", "reminders": "نذكّرك قبل كل تجديد بـ {{days}} أيام.", "tax": "تُضاف ضريبة {{rate}}% عند إصدار الفاتورة حيثما تنطبق.",
  "status_ACTIVE": "نشطة", "status_PAST_DUE": "دفعة متأخرة", "inv_PAID": "مدفوعة", "inv_ISSUED": "مستحقة", "inv_VOID": "ملغاة",
  "cap_kiorex_orders": "طلبات كيوركس", "cap_purchasing": "المشتريات", "cap_forecasting": "التنبؤ", "cap_transfers": "التحويل بين الفروع", "cap_central_price_book": "دفتر الأسعار المركزي", "cap_insurer_claims": "مطالبات التأمين", "cap_insurer_claims (add-on)": "مطالبات التأمين (إضافة)",
  "ed_LITE": "لايت", "ed_PRO": "برو", "ed_CHAIN": "سلسلة", "ed_ENTERPRISE": "مؤسسات", "nav": "الخطة والاشتراك",
};
i18n.addResourceBundle("en", "translation", { sub: EN }, true, false);
i18n.addResourceBundle("ar", "translation", { sub: AR }, true, false);
export const subStrings = { EN, AR };
