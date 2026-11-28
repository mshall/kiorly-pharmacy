"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEPATIC_RULES = exports.RENAL_RULES = exports.LACTATION_RULES = exports.PREGNANCY_RULES = exports.DOSE_RULES = void 0;
const d = (ingredient, maxDailyMg, maxSingleMg, pediatricMaxMgPerKg) => ({ ingredient, maxDailyMg, maxSingleMg, pediatricMaxMgPerKg });
exports.DOSE_RULES = [
    d("paracetamol", 4000, 1000, 75), d("ibuprofen", 2400, 800, 40), d("diclofenac", 150, 75), d("naproxen", 1250, 500), d("aspirin", 4000, 1000), d("celecoxib", 400, 200),
    d("amoxicillin", 3000, 1000, 90), d("azithromycin", 500, 500, 12), d("cefixime", 400, 400, 8), d("ciprofloxacin", 1500, 750, 30), d("levofloxacin", 750, 750), d("clarithromycin", 1000, 500, 15), d("doxycycline", 200, 200),
    d("metformin", 3000, 1000), d("glimepiride", 8, 8), d("gliclazide", 320, 160), d("sitagliptin", 100, 100),
    d("atorvastatin", 80, 80), d("simvastatin", 40, 40), d("amlodipine", 10, 10), d("enalapril", 40, 40), d("lisinopril", 80, 80), d("losartan", 100, 100), d("metoprolol", 400, 200), d("bisoprolol", 20, 20), d("furosemide", 600, 200), d("spironolactone", 400, 200), d("clopidogrel", 75, 75),
    d("omeprazole", 40, 40), d("pantoprazole", 80, 40), d("loratadine", 10, 10), d("cetirizine", 10, 10), d("montelukast", 10, 10),
    d("sertraline", 200, 200), d("escitalopram", 20, 20), d("tramadol", 400, 100), d("alprazolam", 4, 2), d("diazepam", 40, 10), d("pregabalin", 600, 300),
    d("sildenafil", 100, 100), d("prednisolone", 80, 80), d("fluconazole", 400, 400), d("acyclovir", 4000, 800), d("tamsulosin", 0.8, 0.4),
];
const p = (ingredient, category, note) => ({ ingredient, category, note });
exports.PREGNANCY_RULES = [
    p("paracetamol", "B", "Preferred analgesic in pregnancy"), p("amoxicillin", "B", "Generally considered safe"), p("azithromycin", "B", "Generally considered safe"), p("cefixime", "B", "Generally considered safe"), p("ceftriaxone", "B", "Generally considered safe"),
    p("metronidazole", "B", "Avoid high single doses in 1st trimester"), p("acyclovir", "B", "Generally considered safe"), p("metformin", "B", "Often continued in gestational diabetes under supervision"), p("insulin", "B", "Preferred in pregnancy"),
    p("pantoprazole", "B", "Generally considered safe"), p("loratadine", "B", "Generally considered safe"), p("cetirizine", "B", "Generally considered safe"), p("clopidogrel", "B", "Limited data"), p("sildenafil", "B", "Limited data"), p("montelukast", "B", "Limited data"), p("enoxaparin", "B", "Preferred anticoagulant in pregnancy"),
    p("ibuprofen", "C", "Avoid from 30 weeks (premature ductus closure)"), p("ciprofloxacin", "C", "Avoid unless no alternative"), p("levofloxacin", "C", "Avoid unless no alternative"), p("clarithromycin", "C", "Use only if benefit outweighs risk"),
    p("omeprazole", "C", "Limited data"), p("amlodipine", "C", "Limited data"), p("salbutamol", "C", "Inhaled use acceptable"), p("sertraline", "C", "Specialist advice; neonatal adaptation risk"), p("escitalopram", "C", "Specialist advice"),
    p("tramadol", "C", "Avoid prolonged use; neonatal withdrawal"), p("morphine", "C", "Neonatal respiratory depression near term"), p("prednisolone", "C", "Use lowest effective dose"), p("furosemide", "C", "Only if clearly needed"), p("spironolactone", "C", "Avoid unless essential"), p("bisoprolol", "C", "Monitor fetal growth"), p("metoprolol", "C", "Monitor fetal growth"), p("pregabalin", "C", "Avoid unless benefit outweighs risk"),
    p("diclofenac", "D", "NSAID: avoid, especially from 20-30 weeks"), p("naproxen", "D", "NSAID: avoid, especially from 20-30 weeks"), p("celecoxib", "D", "NSAID: avoid"), p("aspirin", "D", "Analgesic doses: avoid (low-dose aspirin only on obstetric advice)"), p("doxycycline", "D", "Tooth/bone effects"), p("tetracycline", "D", "Tooth/bone effects"),
    p("fluconazole", "D", "Avoid, especially high-dose"), p("enalapril", "D", "Fetotoxic (2nd/3rd trimester)"), p("lisinopril", "D", "Fetotoxic (2nd/3rd trimester)"), p("losartan", "D", "Fetotoxic (2nd/3rd trimester)"), p("valsartan", "D", "Fetotoxic (2nd/3rd trimester)"), p("atenolol", "D", "Fetal growth restriction"),
    p("alprazolam", "D", "Neonatal sedation / withdrawal"), p("diazepam", "D", "Neonatal sedation / withdrawal"), p("lithium", "D", "Cardiac malformation risk"), p("valproate", "D", "Neural tube defects"), p("carbamazepine", "D", "Malformation risk"), p("phenytoin", "D", "Malformation risk"),
    p("atorvastatin", "X", "Contraindicated in pregnancy"), p("simvastatin", "X", "Contraindicated in pregnancy"), p("warfarin", "X", "Teratogenic: contraindicated"), p("methotrexate", "X", "Teratogenic: contraindicated"), p("misoprostol", "X", "Abortifacient: contraindicated"), p("isotretinoin", "X", "Teratogenic: contraindicated"), p("finasteride", "X", "Contraindicated"),
];
const q = (ingredient, severity, note) => ({ ingredient, severity, note });
exports.LACTATION_RULES = [
    q("methotrexate", "CONTRAINDICATED", "Contraindicated while breastfeeding"), q("lithium", "MAJOR", "Infant toxicity risk"), q("tramadol", "MAJOR", "Infant sedation / respiratory depression"), q("morphine", "MAJOR", "Infant sedation"),
    q("atorvastatin", "MAJOR", "Avoid: no safety data"), q("simvastatin", "MAJOR", "Avoid: no safety data"), q("diazepam", "MODERATE", "Accumulates in infant; short courses only"), q("alprazolam", "MODERATE", "Infant sedation"),
    q("ciprofloxacin", "MODERATE", "Prefer alternatives"), q("doxycycline", "MODERATE", "Short courses only"), q("fluconazole", "MODERATE", "Single dose acceptable"), q("metronidazole", "MODERATE", "Pause breastfeeding after high single dose"), q("aspirin", "MODERATE", "Avoid analgesic doses (Reye risk)"),
];
exports.RENAL_RULES = [
    q("metformin", "MAJOR", "Avoid if eGFR < 30 (lactic acidosis)"), q("ibuprofen", "MAJOR", "Nephrotoxic NSAID"), q("diclofenac", "MAJOR", "Nephrotoxic NSAID"), q("naproxen", "MAJOR", "Nephrotoxic NSAID"), q("celecoxib", "MAJOR", "Nephrotoxic NSAID"),
    q("spironolactone", "MAJOR", "Hyperkalaemia risk"), q("potassium chloride", "MAJOR", "Hyperkalaemia risk"), q("nitrofurantoin", "MAJOR", "Ineffective and toxic at low GFR"), q("digoxin", "MAJOR", "Dose reduction and levels"), q("lithium", "MAJOR", "Toxicity risk"), q("methotrexate", "MAJOR", "Reduced clearance"), q("colchicine", "MAJOR", "Toxicity risk"),
    q("aspirin", "MODERATE", "Avoid analgesic doses"), q("enalapril", "MODERATE", "Monitor potassium and creatinine"), q("lisinopril", "MODERATE", "Monitor potassium and creatinine"), q("losartan", "MODERATE", "Monitor potassium and creatinine"),
    q("ciprofloxacin", "MODERATE", "Dose adjustment"), q("levofloxacin", "MODERATE", "Dose adjustment"), q("amoxicillin", "MODERATE", "Dose adjustment in severe impairment"), q("acyclovir", "MODERATE", "Dose adjustment"), q("sitagliptin", "MODERATE", "Dose adjustment"), q("enoxaparin", "MODERATE", "Accumulation: dose adjust"), q("pregabalin", "MODERATE", "Dose adjustment"), q("tramadol", "MODERATE", "Dose adjustment"), q("fluconazole", "MODERATE", "Dose adjustment"),
];
exports.HEPATIC_RULES = [
    q("atorvastatin", "MAJOR", "Contraindicated in active liver disease"), q("simvastatin", "MAJOR", "Contraindicated in active liver disease"), q("methotrexate", "MAJOR", "Hepatotoxic"), q("ketoconazole", "MAJOR", "Hepatotoxic"), q("valproate", "MAJOR", "Hepatotoxic"), q("amiodarone", "MAJOR", "Hepatotoxic"), q("isoniazid", "MAJOR", "Hepatotoxic"), q("amoxicillin + clavulanic acid", "MAJOR", "Cholestatic hepatitis risk"),
    q("paracetamol", "MODERATE", "Limit to 2 g/day in liver impairment"), q("diclofenac", "MODERATE", "Hepatotoxic NSAID: caution"), q("ibuprofen", "MODERATE", "Caution; bleeding risk"), q("tramadol", "MODERATE", "Reduce dose"), q("alprazolam", "MODERATE", "Reduce dose"), q("diazepam", "MODERATE", "Accumulates"), q("sertraline", "MODERATE", "Reduce dose"),
    q("azithromycin", "MODERATE", "Caution"), q("fluconazole", "MODERATE", "Hepatotoxic: caution"), q("warfarin", "MODERATE", "Increased INR sensitivity"), q("metformin", "MODERATE", "Lactic acidosis risk"),
];
//# sourceMappingURL=clinical-dataset.js.map