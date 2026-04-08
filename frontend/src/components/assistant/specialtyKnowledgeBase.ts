export interface SpecialtyEntry {
  name: string;
  displayName: string;
  emoji: string;
  keywords: string[];
  conditions: string[];
  symptoms: string[];
  diagnosticTools: string[];
  treatments: string[];
  redFlags: string[];
  content: string;
}

export const specialtyKnowledgeBase: Record<string, SpecialtyEntry> = {
  cardiologist: {
    name: 'cardiologist',
    displayName: 'Cardiology',
    emoji: '🫀',
    keywords: [
      'heart', 'cardiac', 'chest pain', 'arrhythmia', 'palpitations',
      'blood pressure', 'hypertension', 'coronary', 'angina', 'myocardial',
      'infarction', 'heart attack', 'ecg', 'ekg', 'cholesterol',
      'atherosclerosis', 'heart failure', 'cardiomyopathy', 'valve',
      'aorta', 'tachycardia', 'bradycardia', 'atrial fibrillation',
      'cardiovascular', 'stroke risk', 'stent', 'bypass'
    ],
    conditions: [
      'Coronary Artery Disease', 'Heart Failure', 'Arrhythmia',
      'Hypertension', 'Valvular Heart Disease', 'Cardiomyopathy',
      'Atrial Fibrillation', 'Myocardial Infarction', 'Angina Pectoris',
      'Peripheral Artery Disease'
    ],
    symptoms: [
      'Chest pain or pressure', 'Shortness of breath', 'Palpitations',
      'Dizziness or fainting', 'Swollen ankles/legs', 'Fatigue',
      'Irregular heartbeat', 'Rapid or slow pulse'
    ],
    diagnosticTools: [
      'ECG/EKG', 'Echocardiogram', 'Stress Test', 'Holter Monitor',
      'Cardiac CT/MRI', 'Coronary Angiography', 'Blood tests (troponin, BNP)'
    ],
    treatments: [
      'Lifestyle modifications (diet, exercise)', 'Antihypertensives',
      'Statins', 'Anticoagulants', 'Beta-blockers', 'ACE inhibitors',
      'Angioplasty/Stenting', 'Bypass surgery', 'Pacemaker implantation',
      'Cardiac rehabilitation'
    ],
    redFlags: [
      'Sudden severe chest pain radiating to arm/jaw',
      'Sudden shortness of breath at rest',
      'Loss of consciousness',
      'Rapid irregular heartbeat with dizziness',
      'Sudden severe sweating with chest discomfort'
    ],
    content: [
      '## 🫀 Cardiology — Heart & Cardiovascular Health',
      '',
      '### Diagnosis',
      '- **ECG/EKG**: Records electrical activity; detects arrhythmias, heart attacks',
      '- **Echocardiogram**: Ultrasound of heart structure and function',
      '- **Stress Test**: Evaluates heart under physical exertion',
      '- **Blood Tests**: Troponin (heart damage), BNP (heart failure), lipid panel',
      '- **Coronary Angiography**: Gold standard for coronary artery blockages',
      '',
      '### Common Conditions & Treatment',
      '- **Hypertension**: Lifestyle changes + antihypertensives (ACE inhibitors, beta-blockers)',
      '- **Coronary Artery Disease**: Statins, aspirin, angioplasty, or bypass surgery',
      '- **Heart Failure**: Diuretics, ACE inhibitors, beta-blockers, device therapy',
      '- **Atrial Fibrillation**: Rate/rhythm control, anticoagulation to prevent stroke',
      '- **Heart Attack**: Immediate reperfusion (PCI/thrombolytics), long-term medications',
      '',
      '### Prevention',
      '- Maintain healthy weight (BMI 18.5–24.9)',
      '- Regular aerobic exercise (150 min/week)',
      '- Low-sodium, low-saturated-fat diet (Mediterranean diet)',
      '- No smoking; limit alcohol',
      '- Control blood pressure, cholesterol, and blood sugar',
      '- Regular cardiovascular screenings after age 40',
      '',
      '### ⚠️ When to See a Doctor Immediately',
      '- Sudden chest pain, pressure, or tightness',
      '- Pain radiating to left arm, jaw, or back',
      '- Sudden shortness of breath or fainting',
      '- Rapid or irregular heartbeat with dizziness',
      '',
      '*This information is educational only. Always consult a qualified cardiologist for diagnosis and treatment.*'
    ].join('\n')
  },

  dermatologist: {
    name: 'dermatologist',
    displayName: 'Dermatology',
    emoji: '🩹',
    keywords: [
      'skin', 'rash', 'acne', 'eczema', 'psoriasis', 'dermatitis',
      'mole', 'melanoma', 'hives', 'urticaria', 'itching', 'pruritus',
      'wound', 'scar', 'hair loss', 'alopecia', 'nail', 'fungal',
      'ringworm', 'wart', 'herpes', 'shingles', 'sunburn', 'skin cancer',
      'basal cell', 'squamous cell', 'seborrheic', 'rosacea', 'vitiligo',
      'biopsy', 'dermoscopy', 'patch test'
    ],
    conditions: [
      'Acne Vulgaris', 'Eczema/Atopic Dermatitis', 'Psoriasis',
      'Skin Cancer (Melanoma, BCC, SCC)', 'Rosacea', 'Vitiligo',
      'Alopecia', 'Fungal Infections', 'Contact Dermatitis', 'Urticaria'
    ],
    symptoms: [
      'Redness, rash, or inflammation', 'Itching or burning sensation',
      'Dry, flaky, or scaly skin', 'Blisters or pustules',
      'Changes in mole size/color/shape', 'Hair thinning or loss',
      'Nail discoloration or brittleness', 'Skin thickening or plaques'
    ],
    diagnosticTools: [
      'Dermoscopy', 'Skin biopsy', 'Patch testing', 'KOH preparation (fungal)',
      'Wood lamp examination', 'Allergy testing', 'Blood tests (autoimmune markers)'
    ],
    treatments: [
      'Topical corticosteroids', 'Retinoids (acne/anti-aging)',
      'Antibiotics (topical/oral)', 'Antifungals', 'Antihistamines',
      'Biologics (psoriasis/eczema)', 'Phototherapy (UV light)',
      'Cryotherapy', 'Surgical excision', 'Laser therapy'
    ],
    redFlags: [
      'Mole with asymmetry, irregular border, multiple colors, or diameter >6mm',
      'Non-healing skin ulcer or sore',
      'Rapidly spreading rash with fever',
      'Sudden widespread blistering',
      'Skin changes with unexplained weight loss'
    ],
    content: [
      '## 🩹 Dermatology — Skin, Hair & Nail Health',
      '',
      '### Diagnosis',
      '- **Dermoscopy**: Magnified skin examination for moles and lesions',
      '- **Skin Biopsy**: Tissue sample for definitive diagnosis',
      '- **Patch Testing**: Identifies contact allergens',
      '- **KOH Prep**: Detects fungal infections',
      '- **Blood Tests**: Autoimmune markers, allergy panels',
      '',
      '### Common Conditions & Treatment',
      '- **Acne**: Topical retinoids, benzoyl peroxide, antibiotics; severe cases: isotretinoin',
      '- **Eczema**: Moisturizers, topical steroids, biologics (dupilumab) for severe cases',
      '- **Psoriasis**: Topical treatments, phototherapy, biologics (TNF inhibitors)',
      '- **Skin Cancer**: Surgical excision, Mohs surgery, immunotherapy for melanoma',
      '- **Fungal Infections**: Topical/oral antifungals (clotrimazole, fluconazole)',
      '',
      '### Prevention',
      '- Apply SPF 30+ sunscreen daily; reapply every 2 hours outdoors',
      '- Perform monthly self-skin checks (ABCDE rule for moles)',
      '- Moisturize regularly to maintain skin barrier',
      '- Avoid known allergens and irritants',
      '- Annual dermatology check-up if high-risk (fair skin, family history)',
      '',
      '### ⚠️ When to See a Doctor',
      '- Mole changes (asymmetry, border, color, diameter, evolution)',
      '- Non-healing wound or ulcer lasting >2 weeks',
      '- Widespread rash with fever or difficulty breathing',
      '- Sudden severe skin blistering',
      '',
      '*This information is educational only. Always consult a qualified dermatologist.*'
    ].join('\n')
  },

  pediatrician: {
    name: 'pediatrician',
    displayName: 'Pediatrics',
    emoji: '👶',
    keywords: [
      'child', 'children', 'infant', 'baby', 'toddler', 'pediatric',
      'vaccination', 'vaccine', 'immunization', 'growth', 'development',
      'milestone', 'fever child', 'ear infection', 'otitis', 'croup',
      'RSV', 'hand foot mouth', 'chickenpox', 'measles', 'mumps',
      'rubella', 'whooping cough', 'pertussis', 'newborn', 'breastfeeding',
      'formula', 'teething', 'ADHD', 'autism', 'childhood obesity',
      'pediatric asthma', 'school age', 'adolescent'
    ],
    conditions: [
      'Ear Infections (Otitis Media)', 'Respiratory Syncytial Virus (RSV)',
      'Chickenpox', 'Hand, Foot & Mouth Disease', 'Croup',
      'Childhood Asthma', 'ADHD', 'Autism Spectrum Disorder',
      'Febrile Seizures', 'Childhood Obesity'
    ],
    symptoms: [
      'High fever (>38°C/100.4°F in infants)', 'Ear pain or tugging',
      'Difficulty breathing or wheezing', 'Rash with fever',
      'Persistent crying or irritability', 'Poor feeding or weight loss',
      'Developmental delays', 'Seizures'
    ],
    diagnosticTools: [
      'Physical examination', 'Otoscopy (ear exam)', 'Chest X-ray',
      'Blood tests (CBC, CRP)', 'Developmental screening tools',
      'Hearing and vision tests', 'Urine culture', 'Throat swab'
    ],
    treatments: [
      'Antibiotics (bacterial infections)', 'Antipyretics (fever management)',
      'Bronchodilators (asthma)', 'Oral rehydration therapy',
      'Behavioral therapy (ADHD/autism)', 'Nutritional counseling',
      'Vaccinations per schedule', 'Speech/occupational therapy'
    ],
    redFlags: [
      'Fever >38°C in infant under 3 months',
      'Difficulty breathing, stridor, or cyanosis',
      'Seizure lasting >5 minutes',
      'Signs of dehydration (no tears, dry mouth, no urination)',
      'Bulging fontanelle in infants',
      'Sudden behavioral change or loss of consciousness'
    ],
    content: [
      '## 👶 Pediatrics — Child & Infant Health',
      '',
      '### Diagnosis',
      '- **Physical Exam**: Growth charts, developmental milestones assessment',
      '- **Otoscopy**: Ear canal and eardrum examination',
      '- **Blood Tests**: CBC for infections, anemia screening',
      '- **Developmental Screening**: M-CHAT (autism), Vanderbilt (ADHD)',
      '- **Imaging**: Chest X-ray for pneumonia, respiratory conditions',
      '',
      '### Common Conditions & Treatment',
      '- **Ear Infections**: Amoxicillin (bacterial); watchful waiting for mild cases',
      '- **Fever**: Acetaminophen/ibuprofen; investigate cause if >38°C in infants',
      '- **Croup**: Cool mist, dexamethasone; epinephrine for severe cases',
      '- **Childhood Asthma**: Inhaled bronchodilators, corticosteroids',
      '- **ADHD**: Behavioral therapy first; stimulant medications if needed',
      '',
      '### Vaccination Schedule (Key Milestones)',
      '- **Birth**: Hepatitis B',
      '- **2, 4, 6 months**: DTaP, IPV, Hib, PCV, Rotavirus',
      '- **12–15 months**: MMR, Varicella, Hepatitis A',
      '- **4–6 years**: DTaP booster, MMR booster',
      '- **11–12 years**: Tdap, HPV, Meningococcal',
      '',
      '### Prevention',
      '- Follow recommended vaccination schedule',
      '- Breastfeed for at least 6 months if possible',
      '- Regular well-child visits for growth monitoring',
      '- Childproof home environment',
      '- Promote healthy diet and physical activity',
      '',
      '### ⚠️ When to Seek Immediate Care',
      '- Fever in infant under 3 months',
      '- Difficulty breathing or bluish lips',
      '- Seizure or loss of consciousness',
      '- Signs of severe dehydration',
      '',
      '*This information is educational only. Always consult a qualified pediatrician.*'
    ].join('\n')
  },

  surgeon: {
    name: 'surgeon',
    displayName: 'Surgery',
    emoji: '🔬',
    keywords: [
      'surgery', 'surgical', 'operation', 'wound', 'incision', 'suture',
      'appendix', 'appendicitis', 'hernia', 'gallbladder', 'gallstones',
      'cholecystectomy', 'laparoscopic', 'open surgery', 'biopsy',
      'tumor removal', 'amputation', 'transplant', 'post-operative',
      'pre-operative', 'anesthesia', 'recovery', 'scar', 'abscess',
      'drainage', 'bowel', 'intestine', 'colon', 'stomach', 'ulcer',
      'perforation', 'trauma', 'laceration', 'fracture repair'
    ],
    conditions: [
      'Appendicitis', 'Gallstones/Cholecystitis', 'Hernia',
      'Bowel Obstruction', 'Colorectal Cancer', 'Peptic Ulcer Disease',
      'Trauma Injuries', 'Abscesses', 'Thyroid Nodules', 'Breast Lumps'
    ],
    symptoms: [
      'Acute abdominal pain', 'Rebound tenderness', 'Nausea and vomiting',
      'Fever with localized pain', 'Inability to pass gas/stool',
      'Visible lump or swelling', 'Wound infection signs',
      'Jaundice with abdominal pain'
    ],
    diagnosticTools: [
      'Physical examination', 'Abdominal ultrasound', 'CT scan abdomen/pelvis',
      'Blood tests (WBC, amylase, lipase)', 'MRI', 'Endoscopy/Colonoscopy',
      'Laparoscopy (diagnostic)', 'Biopsy'
    ],
    treatments: [
      'Laparoscopic surgery (minimally invasive)', 'Open surgery',
      'Wound debridement and closure', 'Abscess drainage',
      'Hernia repair (mesh)', 'Appendectomy', 'Cholecystectomy',
      'Bowel resection', 'Pre/post-operative care protocols',
      'Pain management', 'Antibiotic prophylaxis'
    ],
    redFlags: [
      'Sudden severe abdominal pain (rigid abdomen)',
      'Signs of peritonitis (fever, rigid abdomen, rebound tenderness)',
      'Uncontrolled bleeding from wound',
      'Signs of bowel obstruction (no bowel movements, vomiting)',
      'Wound with spreading redness, warmth, pus (infection)',
      'Post-operative fever >38.5°C'
    ],
    content: [
      '## 🔬 Surgery — Surgical Conditions & Procedures',
      '',
      '### Diagnosis',
      '- **Physical Exam**: Abdominal palpation, rebound tenderness assessment',
      '- **Ultrasound**: First-line for gallstones, appendicitis',
      '- **CT Scan**: Detailed abdominal/pelvic imaging for complex cases',
      '- **Blood Tests**: WBC (infection), amylase/lipase (pancreatitis)',
      '- **Endoscopy**: Direct visualization of GI tract',
      '',
      '### Common Conditions & Treatment',
      '- **Appendicitis**: Appendectomy (laparoscopic preferred); antibiotics for uncomplicated cases',
      '- **Gallstones**: Laparoscopic cholecystectomy; dietary management for mild cases',
      '- **Hernia**: Surgical repair with mesh; watchful waiting for asymptomatic cases',
      '- **Bowel Obstruction**: NG tube decompression; surgery if not resolved',
      '- **Abscesses**: Incision and drainage; antibiotics',
      '',
      '### Pre-Operative Care',
      '- Fasting 6–8 hours before surgery',
      '- Medication review (stop blood thinners as directed)',
      '- Pre-operative blood tests and imaging',
      '- Informed consent and anesthesia consultation',
      '',
      '### Post-Operative Care',
      '- Wound care: Keep clean and dry; watch for infection signs',
      '- Pain management: Scheduled analgesics',
      '- Early mobilization to prevent DVT',
      '- Follow-up appointment within 1–2 weeks',
      '- Gradual return to normal activities',
      '',
      '### ⚠️ When to Seek Immediate Care',
      '- Sudden severe abdominal pain',
      '- Wound with spreading redness, warmth, or pus',
      '- Post-operative fever >38.5°C',
      '- Uncontrolled bleeding',
      '',
      '*This information is educational only. Always consult a qualified surgeon.*'
    ].join('\n')
  },

  neurologist: {
    name: 'neurologist',
    displayName: 'Neurology',
    emoji: '🧠',
    keywords: [
      'brain', 'nerve', 'neurology', 'seizure', 'epilepsy', 'migraine',
      'headache', 'stroke', 'TIA', 'Parkinson', 'Alzheimer', 'dementia',
      'multiple sclerosis', 'MS', 'neuropathy', 'numbness', 'tingling',
      'weakness', 'paralysis', 'tremor', 'dizziness', 'vertigo',
      'memory loss', 'confusion', 'meningitis', 'encephalitis',
      'spinal cord', 'sciatica', 'carpal tunnel', 'Bell palsy',
      'concussion', 'traumatic brain injury', 'TBI', 'EEG', 'MRI brain'
    ],
    conditions: [
      'Migraine', 'Epilepsy/Seizures', 'Stroke', 'Parkinson\'s Disease',
      'Alzheimer\'s Disease', 'Multiple Sclerosis', 'Peripheral Neuropathy',
      'Meningitis', 'Concussion/TBI', 'Carpal Tunnel Syndrome'
    ],
    symptoms: [
      'Severe or sudden headache', 'Seizures or convulsions',
      'Sudden weakness or numbness (one side)', 'Speech difficulties',
      'Vision changes', 'Memory loss or confusion',
      'Tremors or involuntary movements', 'Loss of balance or coordination',
      'Dizziness or vertigo'
    ],
    diagnosticTools: [
      'MRI Brain/Spine', 'CT Scan (emergency stroke)', 'EEG (seizures)',
      'Lumbar Puncture (meningitis)', 'Nerve Conduction Studies',
      'EMG (muscle/nerve function)', 'Neuropsychological testing',
      'Blood tests (B12, thyroid, autoimmune)'
    ],
    treatments: [
      'Antiepileptics (seizures)', 'Triptans/preventives (migraine)',
      'Thrombolytics/thrombectomy (stroke)', 'Levodopa (Parkinson\'s)',
      'Cholinesterase inhibitors (Alzheimer\'s)',
      'Disease-modifying therapies (MS)', 'Corticosteroids (inflammation)',
      'Physical/occupational/speech therapy', 'Pain management'
    ],
    redFlags: [
      'Sudden severe "thunderclap" headache (worst of life)',
      'Sudden one-sided weakness, numbness, or facial drooping',
      'Sudden speech difficulty or confusion',
      'Seizure lasting >5 minutes or first-ever seizure',
      'Sudden vision loss',
      'High fever with stiff neck and headache (meningitis)',
      'Loss of consciousness'
    ],
    content: [
      '## 🧠 Neurology — Brain, Nerve & Spinal Health',
      '',
      '### Diagnosis',
      '- **MRI Brain/Spine**: Detailed soft tissue imaging; gold standard for most neurological conditions',
      '- **CT Scan**: Fast; used in emergency stroke assessment',
      '- **EEG**: Records brain electrical activity; diagnoses epilepsy',
      '- **Lumbar Puncture**: CSF analysis for meningitis, MS, subarachnoid hemorrhage',
      '- **Nerve Conduction Studies/EMG**: Evaluates peripheral nerve and muscle function',
      '',
      '### Common Conditions & Treatment',
      '- **Migraine**: Triptans (acute), topiramate/propranolol (prevention), lifestyle triggers',
      '- **Epilepsy**: Antiepileptic drugs (levetiracetam, valproate); surgery for refractory cases',
      '- **Stroke**: tPA within 4.5 hours; mechanical thrombectomy; rehabilitation',
      '- **Parkinson\'s**: Levodopa/carbidopa; dopamine agonists; deep brain stimulation',
      '- **Multiple Sclerosis**: Interferons, natalizumab, ocrelizumab; symptom management',
      '',
      '### Prevention',
      '- Control cardiovascular risk factors (stroke prevention)',
      '- Wear helmets and seatbelts (TBI prevention)',
      '- Manage stress and sleep (migraine prevention)',
      '- Regular cognitive engagement (dementia prevention)',
      '- Avoid neurotoxins (alcohol, certain medications)',
      '',
      '### ⚠️ FAST Stroke Signs — Call Emergency Immediately',
      '- **F**ace drooping on one side',
      '- **A**rm weakness (one side)',
      '- **S**peech difficulty or slurred speech',
      '- **T**ime to call emergency services',
      '- Also: sudden severe headache, vision loss, confusion',
      '',
      '*This information is educational only. Always consult a qualified neurologist.*'
    ].join('\n')
  },

  generalPractitioner: {
    name: 'generalPractitioner',
    displayName: 'General Practice',
    emoji: '🩺',
    keywords: [
      'general', 'GP', 'primary care', 'family doctor', 'cold', 'flu',
      'fever', 'cough', 'sore throat', 'fatigue', 'tiredness', 'checkup',
      'physical exam', 'blood test', 'routine', 'prevention', 'screening',
      'vaccination adult', 'diabetes management', 'hypertension management',
      'weight', 'BMI', 'lifestyle', 'diet', 'exercise', 'smoking cessation',
      'referral', 'chronic disease', 'follow up', 'prescription',
      'urinary tract infection', 'UTI', 'sinusitis', 'bronchitis'
    ],
    conditions: [
      'Upper Respiratory Infections', 'Urinary Tract Infections',
      'Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia',
      'Obesity', 'Depression/Anxiety', 'Sinusitis', 'Bronchitis',
      'Chronic Disease Management'
    ],
    symptoms: [
      'Fever and chills', 'Persistent cough', 'Fatigue or weakness',
      'Sore throat', 'Nasal congestion', 'Burning urination',
      'Unexplained weight changes', 'General malaise'
    ],
    diagnosticTools: [
      'Physical examination', 'Blood pressure measurement',
      'Blood glucose testing', 'Lipid panel', 'Complete blood count',
      'Urinalysis', 'Throat swab', 'Chest X-ray', 'ECG'
    ],
    treatments: [
      'Antibiotics (bacterial infections)', 'Antivirals (influenza)',
      'Antidiabetics (metformin)', 'Antihypertensives',
      'Statins (cholesterol)', 'Lifestyle counseling',
      'Smoking cessation support', 'Mental health referrals',
      'Preventive screenings and vaccinations'
    ],
    redFlags: [
      'High fever (>39.5°C) not responding to antipyretics',
      'Chest pain or difficulty breathing',
      'Sudden unexplained weight loss',
      'Blood in urine, stool, or sputum',
      'Persistent symptoms >2 weeks without improvement'
    ],
    content: [
      '## 🩺 General Practice — Primary Care & Preventive Health',
      '',
      '### Diagnosis',
      '- **Physical Exam**: Vital signs, auscultation, palpation',
      '- **Blood Tests**: CBC, metabolic panel, lipids, glucose, HbA1c',
      '- **Urinalysis**: Detects UTI, kidney disease, diabetes',
      '- **Blood Pressure**: Screening for hypertension',
      '- **Imaging**: Chest X-ray, referral for specialized imaging',
      '',
      '### Common Conditions & Treatment',
      '- **Cold/Flu**: Rest, fluids, antipyretics; antivirals (oseltamivir) for influenza',
      '- **UTI**: Antibiotics (trimethoprim, nitrofurantoin); increased fluid intake',
      '- **Type 2 Diabetes**: Metformin first-line; lifestyle modification; monitoring',
      '- **Hypertension**: Lifestyle changes; ACE inhibitors, ARBs, calcium channel blockers',
      '- **Sinusitis**: Saline rinse, decongestants; antibiotics only if bacterial (>10 days)',
      '',
      '### Preventive Care Schedule',
      '- **Annual**: Blood pressure, BMI, cholesterol (adults 35+), diabetes screening',
      '- **Women**: Pap smear (21–65 every 3 years), mammogram (40+ annually)',
      '- **Men**: PSA discussion (50+), abdominal aortic aneurysm screening (65+)',
      '- **All Adults**: Colorectal cancer screening (45+), flu vaccine annually',
      '',
      '### Prevention',
      '- Maintain healthy weight and regular exercise',
      '- Balanced diet rich in fruits, vegetables, whole grains',
      '- No smoking; moderate alcohol consumption',
      '- Stress management and adequate sleep (7–9 hours)',
      '- Stay up to date with vaccinations',
      '',
      '### ⚠️ When to See a Doctor',
      '- Symptoms persisting >2 weeks',
      '- High fever not responding to treatment',
      '- Any sudden or severe symptom change',
      '- Blood in urine, stool, or sputum',
      '',
      '*This information is educational only. Always consult a qualified general practitioner.*'
    ].join('\n')
  },

  anesthesiologist: {
    name: 'anesthesiologist',
    displayName: 'Anesthesiology',
    emoji: '💉',
    keywords: [
      'anesthesia', 'anesthetic', 'sedation', 'pain management',
      'epidural', 'spinal block', 'general anesthesia', 'local anesthesia',
      'regional anesthesia', 'intubation', 'ventilator', 'ICU',
      'critical care', 'pain relief', 'opioid', 'nerve block',
      'pre-anesthesia', 'post-anesthesia', 'PACU', 'recovery room',
      'propofol', 'ketamine', 'fentanyl', 'morphine', 'chronic pain',
      'palliative', 'pain clinic', 'CRPS', 'fibromyalgia pain'
    ],
    conditions: [
      'Acute Post-Operative Pain', 'Chronic Pain Syndrome',
      'Complex Regional Pain Syndrome (CRPS)', 'Cancer Pain',
      'Neuropathic Pain', 'Back Pain (interventional)',
      'Anesthesia Complications', 'Malignant Hyperthermia',
      'Post-Dural Puncture Headache', 'Awareness Under Anesthesia'
    ],
    symptoms: [
      'Severe acute pain', 'Chronic persistent pain',
      'Burning or shooting nerve pain', 'Post-operative nausea/vomiting',
      'Difficulty breathing post-procedure', 'Muscle rigidity (malignant hyperthermia)',
      'Headache after spinal/epidural'
    ],
    diagnosticTools: [
      'Pain assessment scales (VAS, NRS)', 'Pre-anesthesia evaluation',
      'Airway assessment (Mallampati)', 'Pulmonary function tests',
      'Blood tests (coagulation, metabolic)', 'ECG', 'Nerve conduction studies',
      'Fluoroscopy (guided injections)'
    ],
    treatments: [
      'General anesthesia (inhalational/IV)', 'Regional anesthesia (epidural, spinal)',
      'Local anesthetic blocks', 'Multimodal analgesia',
      'Opioid analgesics (acute pain)', 'NSAIDs and acetaminophen',
      'Nerve blocks (chronic pain)', 'Spinal cord stimulation',
      'Intrathecal drug delivery', 'Ketamine infusions'
    ],
    redFlags: [
      'Difficulty breathing or airway obstruction post-procedure',
      'Sudden high fever with muscle rigidity (malignant hyperthermia)',
      'Severe chest pain after regional anesthesia',
      'Prolonged unconsciousness after procedure',
      'Severe allergic reaction to anesthetic agents',
      'Uncontrolled severe pain despite medication'
    ],
    content: [
      '## 💉 Anesthesiology — Anesthesia & Pain Management',
      '',
      '### Types of Anesthesia',
      '- **General Anesthesia**: Complete unconsciousness; used for major surgeries',
      '- **Regional Anesthesia**: Numbs a region (epidural, spinal, nerve blocks)',
      '- **Local Anesthesia**: Small area numbing for minor procedures',
      '- **Sedation**: Varying levels of consciousness reduction',
      '',
      '### Diagnosis & Assessment',
      '- **Pre-Anesthesia Evaluation**: Medical history, airway assessment, medication review',
      '- **Mallampati Score**: Predicts intubation difficulty',
      '- **Pain Scales**: VAS/NRS for pain quantification',
      '- **Blood Tests**: Coagulation studies, metabolic panel',
      '',
      '### Pain Management',
      '- **Acute Pain**: Multimodal approach (NSAIDs + opioids + regional blocks)',
      '- **Chronic Pain**: Nerve blocks, spinal cord stimulation, medications',
      '- **Cancer Pain**: WHO analgesic ladder (non-opioid → weak opioid → strong opioid)',
      '- **Neuropathic Pain**: Gabapentin, pregabalin, tricyclic antidepressants',
      '',
      '### Pre-Operative Instructions',
      '- Fast 6–8 hours before general anesthesia',
      '- Disclose all medications, supplements, allergies',
      '- Stop blood thinners as directed by your doctor',
      '- Arrange transportation home after procedure',
      '',
      '### ⚠️ When to Seek Immediate Care',
      '- Difficulty breathing after procedure',
      '- Sudden high fever with muscle stiffness',
      '- Severe allergic reaction (hives, swelling, breathing difficulty)',
      '- Uncontrolled severe pain',
      '',
      '*This information is educational only. Always consult a qualified anesthesiologist.*'
    ].join('\n')
  },

  oncologist: {
    name: 'oncologist',
    displayName: 'Oncology',
    emoji: '🎗️',
    keywords: [
      'cancer', 'tumor', 'malignant', 'benign', 'chemotherapy', 'chemo',
      'radiation', 'radiotherapy', 'immunotherapy', 'targeted therapy',
      'oncology', 'biopsy', 'staging', 'metastasis', 'lymphoma',
      'leukemia', 'breast cancer', 'lung cancer', 'colon cancer',
      'prostate cancer', 'skin cancer melanoma', 'cervical cancer',
      'ovarian cancer', 'pancreatic cancer', 'remission', 'palliative',
      'hospice', 'tumor marker', 'PET scan', 'bone marrow', 'stem cell'
    ],
    conditions: [
      'Breast Cancer', 'Lung Cancer', 'Colorectal Cancer',
      'Prostate Cancer', 'Lymphoma (Hodgkin/Non-Hodgkin)',
      'Leukemia', 'Melanoma', 'Cervical Cancer',
      'Pancreatic Cancer', 'Ovarian Cancer'
    ],
    symptoms: [
      'Unexplained weight loss', 'Persistent fatigue',
      'Unexplained pain', 'Lump or thickening in tissue',
      'Changes in bowel/bladder habits', 'Persistent cough or hoarseness',
      'Unusual bleeding or discharge', 'Non-healing sores',
      'Changes in mole appearance'
    ],
    diagnosticTools: [
      'Biopsy (tissue diagnosis)', 'CT/MRI/PET scan',
      'Blood tests (tumor markers: PSA, CA-125, CEA)',
      'Bone marrow biopsy', 'Endoscopy/Colonoscopy',
      'Mammography', 'Genetic testing (BRCA1/2)',
      'Pathology and staging workup'
    ],
    treatments: [
      'Surgery (tumor resection)', 'Chemotherapy',
      'Radiation therapy', 'Immunotherapy (checkpoint inhibitors)',
      'Targeted therapy (tyrosine kinase inhibitors)',
      'Hormone therapy (breast/prostate cancer)',
      'Stem cell transplant', 'Palliative care',
      'Clinical trials'
    ],
    redFlags: [
      'Unexplained weight loss >10% body weight in 6 months',
      'Persistent lump or swelling anywhere in body',
      'Blood in urine, stool, or sputum without explanation',
      'Non-healing ulcer or sore',
      'Persistent hoarseness or difficulty swallowing',
      'Abnormal tumor marker results'
    ],
    content: [
      '## 🎗️ Oncology — Cancer Diagnosis & Treatment',
      '',
      '### Diagnosis',
      '- **Biopsy**: Definitive tissue diagnosis; determines cancer type and grade',
      '- **Imaging**: CT, MRI, PET scan for staging and spread assessment',
      '- **Tumor Markers**: PSA (prostate), CA-125 (ovarian), CEA (colorectal)',
      '- **Genetic Testing**: BRCA1/2 (breast/ovarian), Lynch syndrome (colorectal)',
      '- **Staging**: TNM system (Tumor, Node, Metastasis) guides treatment',
      '',
      '### Treatment Approaches',
      '- **Surgery**: Curative resection; debulking for advanced disease',
      '- **Chemotherapy**: Systemic cell-killing agents; often combined regimens',
      '- **Radiation**: Targeted high-energy beams; curative or palliative',
      '- **Immunotherapy**: Checkpoint inhibitors (pembrolizumab, nivolumab)',
      '- **Targeted Therapy**: Attacks specific cancer mutations (imatinib, trastuzumab)',
      '- **Hormone Therapy**: Blocks hormones feeding cancer (tamoxifen, enzalutamide)',
      '',
      '### Cancer Screening Guidelines',
      '- **Breast**: Mammogram annually from age 40–50 (varies by guidelines)',
      '- **Cervical**: Pap smear every 3 years (21–65); HPV co-test every 5 years',
      '- **Colorectal**: Colonoscopy every 10 years from age 45',
      '- **Prostate**: PSA discussion with doctor from age 50',
      '- **Lung**: Low-dose CT for heavy smokers aged 50–80',
      '',
      '### Prevention',
      '- No smoking (causes 30% of cancers)',
      '- Limit alcohol consumption',
      '- Maintain healthy weight and exercise regularly',
      '- HPV and Hepatitis B vaccination',
      '- Sun protection (skin cancer)',
      '- Regular cancer screenings',
      '',
      '### ⚠️ Warning Signs — See a Doctor',
      '- Unexplained weight loss or persistent fatigue',
      '- New lump or swelling',
      '- Blood in urine, stool, or sputum',
      '- Non-healing sore or ulcer',
      '',
      '*This information is educational only. Always consult a qualified oncologist.*'
    ].join('\n')
  },

  gynecologist: {
    name: 'gynecologist',
    displayName: 'Gynecology',
    emoji: '🌸',
    keywords: [
      'gynecology', 'gynecologist', 'pregnancy', 'pregnant', 'menstruation',
      'period', 'menstrual', 'ovary', 'uterus', 'cervix', 'vagina',
      'PCOS', 'PCOD', 'polycystic ovary', 'polycystic ovarian syndrome', 'endometriosis', 'fibroids', 'menopause',
      'perimenopause', 'contraception', 'birth control', 'IUD', 'fertility',
      'infertility', 'IVF', 'prenatal', 'antenatal', 'postpartum',
      'pap smear', 'HPV', 'STI', 'STD', 'pelvic pain', 'vaginal discharge',
      'breast exam', 'mammogram', 'ovarian cyst', 'ectopic pregnancy'
    ],
    conditions: [
      'Polycystic Ovary Syndrome (PCOS)', 'Endometriosis',
      'Uterine Fibroids', 'Ovarian Cysts', 'Cervical Cancer',
      'Ovarian Cancer', 'Menstrual Disorders', 'Menopause',
      'Ectopic Pregnancy', 'Pelvic Inflammatory Disease'
    ],
    symptoms: [
      'Irregular or painful periods', 'Pelvic pain or pressure',
      'Abnormal vaginal discharge', 'Bleeding between periods',
      'Painful intercourse', 'Difficulty conceiving',
      'Hot flashes and night sweats (menopause)',
      'Abdominal bloating', 'Urinary symptoms'
    ],
    diagnosticTools: [
      'Pelvic examination', 'Pap smear (cervical screening)',
      'Transvaginal ultrasound', 'Blood tests (hormones: FSH, LH, estrogen)',
      'Colposcopy', 'Hysteroscopy', 'Laparoscopy',
      'Pregnancy test (hCG)', 'STI screening'
    ],
    treatments: [
      'Hormonal contraceptives (PCOS, endometriosis)',
      'Progestins (fibroids, menstrual disorders)',
      'Fertility treatments (IVF, IUI, ovulation induction)',
      'Surgical options (laparoscopy, hysterectomy)',
      'HRT (hormone replacement therapy for menopause)',
      'Antibiotics (PID, STIs)', 'Cervical procedures (LEEP, cone biopsy)',
      'Prenatal care and monitoring'
    ],
    redFlags: [
      'Sudden severe pelvic pain (possible ectopic pregnancy)',
      'Heavy bleeding soaking >1 pad/hour',
      'Missed period with positive pregnancy test and pain',
      'Abnormal Pap smear results',
      'Postmenopausal bleeding',
      'Rapidly growing pelvic mass'
    ],
    content: [
      '## 🌸 Gynecology — Women\'s Reproductive Health',
      '',
      '### Diagnosis',
      '- **Pelvic Exam**: Physical assessment of reproductive organs',
      '- **Pap Smear**: Cervical cancer screening (every 3 years, age 21–65)',
      '- **Transvaginal Ultrasound**: Ovaries, uterus, fibroids, cysts',
      '- **Hormone Tests**: FSH, LH, estrogen, progesterone, AMH (fertility)',
      '- **Laparoscopy**: Definitive diagnosis for endometriosis',
      '',
      '### Common Conditions & Treatment',
      '- **PCOS**: Hormonal contraceptives, metformin, lifestyle changes; fertility treatment if needed',
      '- **Endometriosis**: NSAIDs, hormonal therapy, laparoscopic surgery',
      '- **Fibroids**: Watchful waiting, hormonal therapy, myomectomy, or hysterectomy',
      '- **Menopause**: HRT (estrogen ± progesterone), lifestyle management, SSRIs for hot flashes',
      '- **PID**: Antibiotics (doxycycline + metronidazole); hospitalization if severe',
      '',
      '### Prenatal Care',
      '- First trimester: Confirm pregnancy, dating ultrasound, blood tests, genetic screening',
      '- Second trimester: Anatomy scan (18–20 weeks), glucose tolerance test',
      '- Third trimester: Group B strep screening, birth planning, fetal monitoring',
      '',
      '### Preventive Care',
      '- Annual gynecological exam',
      '- Pap smear per guidelines',
      '- HPV vaccination (up to age 45)',
      '- STI screening if sexually active',
      '- Breast self-examination monthly',
      '',
      '### ⚠️ When to Seek Immediate Care',
      '- Sudden severe pelvic pain',
      '- Heavy vaginal bleeding',
      '- Positive pregnancy test with pain/bleeding (ectopic risk)',
      '- Postmenopausal bleeding',
      '',
      '*This information is educational only. Always consult a qualified gynecologist.*'
    ].join('\n')
  },

  radiologist: {
    name: 'radiologist',
    displayName: 'Radiology',
    emoji: '🔭',
    keywords: [
      'X-ray', 'xray', 'MRI', 'CT scan', 'ultrasound', 'imaging',
      'radiology', 'radiologist', 'scan', 'PET scan', 'nuclear medicine',
      'mammogram', 'fluoroscopy', 'angiography', 'contrast', 'DEXA',
      'bone density', 'interventional radiology', 'biopsy guided',
      'radiation dose', 'radiograph', 'sonogram', 'echocardiogram imaging',
      'SPECT', 'bone scan', 'lymphoscintigraphy', 'MRA', 'CTA',
      'image guided', 'diagnostic imaging', 'report interpretation'
    ],
    conditions: [
      'Fractures and Bone Injuries', 'Pulmonary Embolism',
      'Pneumonia (imaging)', 'Brain Tumors', 'Liver/Kidney Masses',
      'Vascular Disease', 'Osteoporosis', 'Appendicitis (imaging)',
      'Breast Lesions', 'Spinal Disc Disease'
    ],
    symptoms: [
      'Requires imaging for diagnosis', 'Abnormal findings on prior imaging',
      'Need for image-guided procedures', 'Monitoring treatment response',
      'Screening for cancer or disease'
    ],
    diagnosticTools: [
      'X-ray (plain radiograph)', 'CT Scan (computed tomography)',
      'MRI (magnetic resonance imaging)', 'Ultrasound',
      'PET Scan (positron emission tomography)', 'Mammography',
      'DEXA Scan (bone density)', 'Fluoroscopy',
      'Nuclear Medicine Scans', 'Interventional procedures'
    ],
    treatments: [
      'Image-guided biopsy', 'Interventional radiology procedures',
      'Angioplasty and stenting', 'Embolization',
      'Radiofrequency ablation', 'Drainage procedures',
      'Vertebroplasty/Kyphoplasty', 'TIPS procedure',
      'Radiation therapy planning'
    ],
    redFlags: [
      'Imaging showing large mass or tumor',
      'Signs of pulmonary embolism on CT',
      'Intracranial hemorrhage on CT',
      'Aortic dissection or aneurysm on imaging',
      'Tension pneumothorax on chest X-ray'
    ],
    content: [
      '## 🔭 Radiology — Medical Imaging & Diagnostics',
      '',
      '### Imaging Modalities',
      '- **X-Ray**: Fast, low-cost; best for bones, chest (pneumonia, fractures)',
      '- **CT Scan**: Detailed cross-sections; excellent for trauma, chest, abdomen',
      '- **MRI**: Best soft tissue detail; brain, spine, joints, no radiation',
      '- **Ultrasound**: Real-time, no radiation; abdomen, pelvis, vascular, obstetric',
      '- **PET Scan**: Metabolic activity; cancer staging and treatment response',
      '- **Mammography**: Breast cancer screening; 2D or 3D (tomosynthesis)',
      '',
      '### When Each Imaging Is Used',
      '- **Chest X-Ray**: Pneumonia, heart size, rib fractures, lung masses',
      '- **CT Head**: Stroke, bleeding, trauma, headache investigation',
      '- **MRI Brain/Spine**: Tumors, MS, disc herniation, nerve compression',
      '- **Abdominal Ultrasound**: Gallstones, liver, kidneys, appendicitis',
      '- **CT Angiography**: Blood vessel disease, pulmonary embolism',
      '- **DEXA Scan**: Bone density, osteoporosis screening',
      '',
      '### Radiation Safety',
      '- X-ray: Low dose (~0.1 mSv chest X-ray)',
      '- CT: Moderate dose (2–20 mSv); benefits usually outweigh risks',
      '- MRI/Ultrasound: No ionizing radiation',
      '- Contrast agents: Inform doctor of kidney disease or allergies',
      '- Pregnancy: Avoid ionizing radiation when possible; ultrasound/MRI preferred',
      '',
      '### Interventional Radiology',
      '- Image-guided biopsies (less invasive than surgery)',
      '- Angioplasty and stenting for blocked vessels',
      '- Tumor ablation (radiofrequency, microwave)',
      '- Embolization (stop bleeding, treat tumors)',
      '',
      '### ⚠️ Important Notes',
      '- Always inform radiologist of allergies, kidney disease, pregnancy',
      '- Bring previous imaging for comparison',
      '- Contrast reactions: mild (nausea) to severe (anaphylaxis) — report immediately',
      '',
      '*This information is educational only. Always consult a qualified radiologist.*'
    ].join('\n')
  }
};

export function getSpecialtyByKey(key: string): SpecialtyEntry | undefined {
  return specialtyKnowledgeBase[key];
}

export function getAllSpecialties(): SpecialtyEntry[] {
  return Object.values(specialtyKnowledgeBase);
}
