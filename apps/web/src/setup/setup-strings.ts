import i18n from "@/lib/i18n";

/** Quick-setup strings live beside the feature (merged into the app bundle at runtime) so the shared locale files stay untouched. */
const EN = {
  "title": "Welcome — quick setup",
  "subtitle": "Finish these steps to start working. Each one opens the exact screen and ticks itself when done.",
  "subtitleDone": "Everything is set up.",
  "expand": "Show steps",
  "collapse": "Hide steps",
  "progress": "Setup progress",
  "progressCount": "{{done}} of {{total}} done · {{percent}}%",
  "aggregate": "{{done}} of {{total}}",
  "showEntities": "Show {{count}}",
  "hideEntities": "Hide list",
  "start": "Start",
  "open": "Open",
  "done": "Done",
  "skipped": "Skipped",
  "skip": "Skip",
  "optional": "optional",
  "askOwner": "Ask the owner.",
  "whoCan": "Can be done by: {{roles}}.",
  "autoDetect": "Detected automatically from your data, no ticking needed.",
  "completeTitle": "You're all set",
  "completeBody": "Your organisation is fully set up. You can revisit any screen from the menu at any time.",
  "dismiss": "Dismiss",
  "bar": {
    "region": "Quick setup",
    "stepOf": "Step {{n}} of {{total}}",
    "back": "Back to checklist",
    "skipForNow": "Skip for now",
    "doneReturning": "Done. Taking you back to the checklist...",
    "alreadyDone": "This step is already done."
  },
  "steps": {
    "branch_licence": "Add the pharmacy licence and address",
    "pharmacist_licence": "Add a pharmacist with a syndicate licence",
    "drug_prices": "Set your selling prices",
    "first_stock": "Receive your first stock",
    "invite_staff": "Add a team member",
    "receipt_settings": "Set up your receipt",
    "first_sale": "Make your first sale",
    "connect_kiorex": "Connect to Kiorex"
  },
  "why": {
    "branch_licence": "The licence number and address print on receipts and labels.",
    "pharmacist_licence": "Prescriptions can only be signed off by a licensed pharmacist.",
    "drug_prices": "Price the drugs you sell in the catalogue price book.",
    "first_stock": "Receive stock into the branch so it can be sold.",
    "invite_staff": "Add a cashier, assistant or another pharmacist.",
    "receipt_settings": "Header and footer text for printed receipts.",
    "first_sale": "Ring up a sale at the counter.",
    "connect_kiorex": "Optional. Let patients find and order from you on Kiorex."
  },
  "roles": {
    "OWNER": "Owner",
    "PHARMACIST": "Pharmacist",
    "CASHIER": "Cashier",
    "BRANCH_MANAGER": "Branch manager",
    "CHAIN_OPS": "Chain operations",
    "ASSISTANT": "Assistant"
  }
};
const AR = {
  "title": "مرحبًا — الإعداد السريع",
  "subtitle": "أكمل هذه الخطوات لتبدأ العمل. كل خطوة تفتح الشاشة المناسبة وتكتمل تلقائيًا.",
  "subtitleDone": "كل شيء جاهز.",
  "expand": "عرض الخطوات",
  "collapse": "إخفاء الخطوات",
  "progress": "تقدم الإعداد",
  "progressCount": "{{done}} من {{total}} · {{percent}}٪",
  "aggregate": "{{done}} من {{total}}",
  "showEntities": "عرض {{count}}",
  "hideEntities": "إخفاء القائمة",
  "start": "ابدأ",
  "open": "افتح",
  "done": "تم",
  "skipped": "تم التخطي",
  "skip": "تخطَّ",
  "optional": "اختياري",
  "askOwner": "اطلب من المالك.",
  "whoCan": "يمكن تنفيذها بواسطة: {{roles}}.",
  "autoDetect": "تُكتشف تلقائيًا من بياناتك دون تحديد يدوي.",
  "completeTitle": "كل شيء جاهز",
  "completeBody": "تم إعداد مؤسستك بالكامل. يمكنك العودة إلى أي شاشة من القائمة في أي وقت.",
  "dismiss": "إخفاء",
  "bar": {
    "region": "الإعداد السريع",
    "stepOf": "الخطوة {{n}} من {{total}}",
    "back": "العودة إلى القائمة",
    "skipForNow": "تخطَّ الآن",
    "doneReturning": "تم. نعيدك إلى قائمة الإعداد...",
    "alreadyDone": "هذه الخطوة مكتملة بالفعل."
  },
  "steps": {
    "branch_licence": "أضف ترخيص الصيدلية وعنوانها",
    "pharmacist_licence": "أضف صيدليًا برقم ترخيص النقابة",
    "drug_prices": "حدد أسعار البيع",
    "first_stock": "استلم أول مخزون",
    "invite_staff": "أضف عضوًا في الفريق",
    "receipt_settings": "جهّز الإيصال",
    "first_sale": "نفّذ أول عملية بيع",
    "connect_kiorex": "الربط مع Kiorex"
  },
  "why": {
    "branch_licence": "رقم الترخيص والعنوان يُطبعان على الإيصالات والملصقات.",
    "pharmacist_licence": "لا يمكن اعتماد الوصفات إلا بواسطة صيدلي مرخّص.",
    "drug_prices": "سعّر الأدوية التي تبيعها في دفتر الأسعار.",
    "first_stock": "استلم مخزونًا في الفرع ليصبح قابلًا للبيع.",
    "invite_staff": "أضف كاشيرًا أو مساعدًا أو صيدليًا آخر.",
    "receipt_settings": "نص رأس الإيصال وذيله عند الطباعة.",
    "first_sale": "نفّذ عملية بيع على الكاونتر.",
    "connect_kiorex": "اختياري. دع المرضى يجدونك ويطلبون منك عبر Kiorex."
  },
  "roles": {
    "OWNER": "المالك",
    "PHARMACIST": "الصيدلي",
    "CASHIER": "أمين الصندوق",
    "BRANCH_MANAGER": "مدير الفرع",
    "CHAIN_OPS": "عمليات السلسلة",
    "ASSISTANT": "المساعد"
  }
};
i18n.addResourceBundle("en", "translation", { setup: EN }, true, true);
i18n.addResourceBundle("ar", "translation", { setup: AR }, true, true);
