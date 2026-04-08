export const FUNGAL_DISEASES: Record<string, any> = {
    "aspergillosis": {
        "overview": "Aspergillosis is a condition caused by the Aspergillus species of mold. It primarily affects people with weakened immune systems or lung conditions.",
        "types": ["Allergic Bronchopulmonary (ABPA)", "Aspergilloma (Fungal Ball)", "Invasive Aspergillosis"],
        "symptoms": ["Coughing (often with blood)", "Wheezing", "Shortness of breath", "Fever", "Chest pain"],
        "risk_factors": ["Weakened immune system", "COPD/Tuberculosis", "Asthma", "Organ transplantation"],
        "diagnosis": ["Chest X-ray/CT scan", "Sputum culture", "Blood tests", "Bronchoscopy"],
        "treatment": ["Voriconazole/Itraconazole", "Corticosteroids", "Surgery"],
        "prevention": "Avoid dust/mold, wear masks in construction zones, maintain indoor air quality."
    },
    "blastomycosis": {
        "type": "Dimorphic fungus",
        "pathogen": "Blastomyces dermatitidis",
        "location": "Lungs",
        "description": "Lung infection from fungi in moist soil/wood",
        "symptoms": ["Fever", "Cough", "Night sweats", "Weight loss"],
        "risk_factors": ["Outdoor work", "Geographic location (Ohio/Mississippi river valleys)"],
        "treatment": ["Antifungal therapy (itraconazole, amphotericin B)"]
    },
    "candida_auris": {
        "overview": "An emerging multidrug-resistant yeast posing significant healthcare challenges. Resistant to multiple antifungal drugs and difficult to identify.",
        "symptoms": ["Fever and chills (antibiotic resistant)", "Sepsis-like illness", "Organ dysfunction"],
        "risk_factors": ["Recent surgery", "Diabetes", "Prolonged antifungal use", "Central catheters"],
        "treatment": ["Echinocandins", "Combination therapy", "Removal of infected devices"],
        "prevention": "Strict infection control, contact precautions, environmental cleaning."
    },
    "candidiasis": {
        "type": "Yeast infection",
        "pathogen": "Candida species",
        "location": "Various body sites",
        "description": "Yeast infections (thrush, vaginal)",
        "symptoms": ["White patches (oral)", "Vaginal itching/discharge", "Skin rash"],
        "risk_factors": ["Antibiotic use", "Diabetes", "Weakened immunity", "Hormonal changes"],
        "treatment": ["Topical antifungals", "Oral antifungals for systemic infections"]
    },
    "coccidioidomycosis": {
        "type": "Dimorphic fungus",
        "pathogen": "Coccidioides species",
        "location": "Southwestern United States",
        "description": "Caused by Coccidioides in soil, common in SW US",
        "symptoms": ["Fever", "Cough", "Fatigue", "Rash"],
        "risk_factors": ["Travel/exposure in endemic areas", "Construction work"],
        "treatment": ["Antifungal medications (fluconazole, itraconazole)"]
    },
    "cryptococcosis": {
        "type": "Yeast infection",
        "pathogen": "Cryptococcus neoformans",
        "location": "Lungs and brain",
        "description": "Often affects lungs or brain, associated with HIV",
        "symptoms": ["Chest pain", "Shortness of breath", "Headache", "Confusion"],
        "risk_factors": ["HIV/AIDS", "Organ transplantation", "Steroid use"],
        "treatment": ["Antifungal therapy (amphotericin B + flucytosine, fluconazole maintenance)"]
    },
    "histoplasmosis": {
        "type": "Dimorphic fungus",
        "pathogen": "Histoplasma capsulatum",
        "location": "Bird/bat droppings environments",
        "description": "Caused by inhaling fungi from bird/bat droppings",
        "symptoms": ["Fever", "Cough", "Fatigue", "Chest pain"],
        "risk_factors": ["Cave exploration", "Chicken coop cleaning", "Geographic location"],
        "treatment": ["Antifungal medications (itraconazole for mild cases, amphotericin B for severe)"]
    },
    "mucormycosis": {
        "type": "Mould infection",
        "pathogen": "Mucorales species",
        "location": "Sinuses, lungs, brain",
        "description": "Severe infection, often impacts sinuses/lungs in weak immunity",
        "symptoms": ["Facial swelling", "Black lesions", "Fever", "Headache"],
        "risk_factors": ["Diabetes (ketoacidosis)", "Immunosuppression", "Iron overload"],
        "treatment": ["Surgical debridement", "Antifungal therapy (amphotericin B)"]
    },
    "pneumocystis_pneumonia": {
        "type": "Yeast infection",
        "pathogen": "Pneumocystis jirovecii",
        "location": "Lungs",
        "description": "Caused by Pneumocystis jirovecii",
        "symptoms": ["Dry cough", "Shortness of breath", "Fever", "Chest tightness"],
        "risk_factors": ["HIV/AIDS", "Immunosuppressive therapy", "Organ transplantation"],
        "treatment": ["Antifungal medications (TMP-SMX, pentamidine, atovaquone)"]
    }
};

export const INFECTIOUS_AGENTS: Record<string, any> = {
    "viruses": {
        "overview": "Microscopic infectious agents that replicate inside living host cells, consisting of genetic material (DNA/RNA) in a protein coat.",
        "examples": {
            "HIV": "Attacks the immune system; transmitted via sexual contact or blood.",
            "COVID-19": "SARS-CoV-2 causing respiratory illness; spread via droplets.",
            "Influenza": "Seasonal flu causing annual epidemics.",
            "Herpes (HSV)": "Causes oral and genital infections; spread via direct contact."
        },
        "treatment_approaches": ["Antiviral medications", "Supportive care", "Vaccination", "Monoclonal antibodies"],
        "prevention": ["Vaccination programs", "Hand hygiene", "Safe sex practices", "Vector control"]
    },
    "bacteria": {
        "overview": "Single-celled microorganisms with cell walls made of peptidoglycan. While many are beneficial, some cause life-threatening infections.",
        "examples": {
            "Staph Aureus": "Causes skin abscesses, pneumonia, or MRSA infections.",
            "Strep Pneumoniae": "Leading cause of bacterial pneumonia and meningitis.",
            "Salmonella": "Foodborne pathogen causing gastroenteritis.",
            "E. Coli": "Intestinal bacteria with pathogenic (EHEC) strains."
        },
        "treatment_approaches": ["Antibiotics (Penicillins, Cephalosporins)", "Sensitivity testing", "Surgical drainage"],
        "resistance_concerns": ["Antibiotic stewardship", "Combination therapy", "Infection control"]
    },
    "parasites": {
        "examples": ["Malaria (Plasmodium)", "Giardia", "Tapeworms", "Scabies"],
        "characteristics": ["Multi-cellular organisms", "Often require intermediate hosts"],
        "transmission": ["Contaminated food/water", "Vector bites", "Direct contact"],
        "prevention": ["Safe water practices", "Vector control", "Personal hygiene"]
    }
};

export const FUNGAL_PATHOGENS: Record<string, any> = {
    "yeasts": {
        "examples": ["Candida species"],
        "characteristics": ["Single-celled fungi", "Reproduce by budding"],
        "common_infections": ["Thrush", "Vaginal yeast infections", "Systemic candidiasis"],
        "treatment": ["Azole antifungals", "Echinocandins"]
    },
    "moulds": {
        "examples": ["Aspergillus species"],
        "characteristics": ["Multi-cellular fungi with branching filaments (hyphae)"],
        "common_infections": ["Aspergillosis", "Allergic bronchopulmonary aspergillosis"],
        "treatment": ["Triazoles", "Amphotericin B"]
    }
};

export const CHRONIC_CONDITIONS: Record<string, any> = {
    "hypertension": {
        "system": "Cardiovascular",
        "description": "High blood pressure that can lead to heart disease.",
        "symptoms": ["Headaches", "Shortness of breath", "Nosebleeds", "Dizziness"],
        "management": ["Low-sodium diet", "Regular exercise", "Weight management", "Stress reduction"],
        "red_flags": ["Sudden chest pain", "Severe headache", "Vision changes", "Shortness of breath"]
    },
    "diabetes": {
        "system": "Endocrine",
        "description": "Condition where body can't properly process blood sugar.",
        "symptoms": ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision"],
        "management": ["Blood sugar monitoring", "Carbohydrate control", "Metformin or Insulin", "Regular physical activity"],
        "red_flags": ["Extreme thirst", "Confusion", "Fruity breath odor", "Unconsciousness"]
    },
    "headache": {
        "system": "Neurological",
        "description": "Pain in the head/neck region. Common types include Tension, Migraine, and Cluster headaches.",
        "symptoms": ["Throbbing pain", "Sensitivity to light/sound", "Nausea", "Neck stiffness"],
        "management": ["Hydration", "Stress management", "OTC pain relief (Acetaminophen/Ibuprofen)", "Dark/quiet room rest"],
        "red_flags": ["Sudden 'thunderclap' headache", "Stiff neck with fever", "Confusion or seizures", "Weakness on one side"]
    },
    "fever": {
        "system": "Immune/Systemic",
        "description": "Temporary increase in body temperature, often due to an underlying infection or inflammation.",
        "symptoms": ["Sweating", "Chills", "Aching muscles", "Loss of appetite", "Weakness"],
        "management": ["Rest", "Fluid intake", "Antipyretics (Acetaminophen/Ibuprofen)", "Light clothing"],
        "red_flags": ["Fever >104°F (40°C)", "Difficulty breathing", "Stiff neck", "Persistent vomiting"]
    },
    "cough": {
        "system": "Respiratory",
        "description": "Protective reflex to clear the airways. Can be 'dry' (non-productive) or 'wet' (productive).",
        "symptoms": ["Sore throat", "Chest discomfort", "Shortness of breath", "Phlegm production"],
        "management": ["Hydration", "Honey or throat lozenges", "Humidifier use", "Rest"],
        "red_flags": ["Coughing up blood", "Severe shortness of breath", "Wheezing", "High-grade fever"]
    },
    "nausea": {
        "system": "Gastrointestinal",
        "description": "Unpleasant sensation of needing to vomit. Often caused by infection, food sensitivity, or motion sickness.",
        "symptoms": ["Dizziness", "Abdominal discomfort", "Loss of appetite", "Increased salivation"],
        "management": ["Clear fluids (sipping slowly)", "Bland foods (BRAT diet)", "Ginger tea", "Rest"],
        "red_flags": ["Persistent vomiting >24h", "Severe abdominal pain", "Signs of dehydration", "Blood in vomit"]
    },
    "flu": {
        "system": "Infectious/Respiratory",
        "description": "Influenza is a viral infection that attacks your respiratory system — your nose, throat and lungs.",
        "symptoms": ["High fever", "Body aches", "Fatigue", "Dry cough", "Sore throat"],
        "management": ["Strict rest", "Antivirals (if started early)", "Hydration", "Fever reducers"],
        "red_flags": ["Shortness of breath", "Chest pain", "Confusion", "Bluish lips/face"]
    }
};
