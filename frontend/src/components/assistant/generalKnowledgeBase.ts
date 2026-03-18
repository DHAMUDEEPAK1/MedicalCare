interface GeneralTopic {
  keywords: string[];
  response: string;
}

const GENERAL_TOPICS: GeneralTopic[] = [
  {
    keywords: ['immune system', 'immunity', 'immune', 'white blood cells', 'antibodies'],
    response: `## The Immune System

The immune system is your body's defense network — a complex collection of cells, tissues, and organs that work together to protect you from harmful pathogens like bacteria, viruses, fungi, and parasites.

### Key Components:
- **White blood cells (leukocytes)** — The primary soldiers of immunity; include T-cells, B-cells, and natural killer cells
- **Antibodies** — Proteins produced by B-cells that neutralize specific pathogens
- **Lymph nodes** — Filter lymph fluid and house immune cells
- **Bone marrow** — Produces all blood cells, including immune cells
- **Thymus** — Where T-cells mature and learn to distinguish self from non-self
- **Spleen** — Filters blood and mounts immune responses

### How It Works:
1. **Innate immunity** — Fast, non-specific first response (inflammation, fever)
2. **Adaptive immunity** — Slower but highly specific; creates memory for future encounters
3. **Immunological memory** — Why vaccines work; your body "remembers" pathogens

### Boosting Immune Health:
- Adequate sleep (7–9 hours)
- Regular moderate exercise
- Balanced nutrition rich in vitamins C, D, and zinc
- Stress management
- Avoiding smoking and excessive alcohol`,
  },
  {
    keywords: ['vaccine', 'vaccination', 'immunization', 'how vaccines work', 'herd immunity'],
    response: `## How Vaccines Work

Vaccines are one of the greatest achievements in medical history, saving millions of lives each year by training the immune system to recognize and fight specific pathogens.

### The Basic Mechanism:
1. **Introduction** — A vaccine introduces a harmless piece of a pathogen (protein, weakened virus, mRNA instructions)
2. **Immune response** — Your immune system recognizes it as foreign and mounts a response
3. **Memory formation** — B-cells and T-cells create long-lasting "memory" of the pathogen
4. **Future protection** — If you encounter the real pathogen, your immune system responds rapidly

### Types of Vaccines:
- **Live-attenuated** — Weakened form of the pathogen (MMR, chickenpox)
- **Inactivated** — Killed pathogen (flu shot, polio)
- **Subunit/protein** — Specific proteins from the pathogen (hepatitis B, HPV)
- **mRNA** — Instructions to make a protein (COVID-19 vaccines)
- **Viral vector** — Uses a modified virus to deliver instructions

### Herd Immunity:
When enough people in a community are immune (through vaccination or prior infection), the pathogen can't spread easily — protecting those who can't be vaccinated (newborns, immunocompromised individuals).

### Key Facts:
- Vaccines undergo rigorous safety testing before approval
- Side effects are usually mild (sore arm, low fever) — signs your immune system is responding
- Vaccines have eliminated or nearly eliminated diseases like smallpox, polio, and measles`,
  },
  {
    keywords: ['inflammation', 'inflammatory', 'swelling', 'redness', 'chronic inflammation'],
    response: `## Inflammation: Your Body's Defense Mechanism

Inflammation is a fundamental biological process — your body's way of protecting itself from injury, infection, and foreign substances.

### Acute vs. Chronic Inflammation:
- **Acute inflammation** — Short-term, protective response (redness, swelling, heat, pain after injury)
- **Chronic inflammation** — Long-term, low-grade inflammation that can damage healthy tissue

### The Inflammatory Process:
1. Injury or infection triggers immune cells
2. Chemical signals (cytokines) are released
3. Blood vessels dilate, increasing blood flow
4. White blood cells rush to the site
5. Healing begins

### Signs of Inflammation:
- **Redness** (rubor)
- **Heat** (calor)
- **Swelling** (tumor)
- **Pain** (dolor)
- **Loss of function** (functio laesa)

### Chronic Inflammation & Disease:
Chronic inflammation is linked to:
- Heart disease
- Type 2 diabetes
- Cancer
- Alzheimer's disease
- Autoimmune conditions (rheumatoid arthritis, lupus)

### Anti-Inflammatory Lifestyle:
- Mediterranean diet (olive oil, fish, vegetables, berries)
- Regular exercise
- Adequate sleep
- Stress management
- Avoiding smoking and excessive alcohol
- Maintaining healthy weight`,
  },
  {
    keywords: ['blood pressure', 'how blood pressure works', 'systolic diastolic', 'blood pressure reading'],
    response: `## Understanding Blood Pressure

Blood pressure measures the force of blood pushing against artery walls as your heart pumps. It's one of the most important vital signs for cardiovascular health.

### Reading Blood Pressure:
Blood pressure is expressed as two numbers: **systolic/diastolic** (e.g., 120/80 mmHg)

- **Systolic (top number)** — Pressure when your heart beats and pumps blood
- **Diastolic (bottom number)** — Pressure when your heart rests between beats

### Blood Pressure Categories:
| Category | Systolic | Diastolic |
|----------|----------|-----------|
| Normal | < 120 | < 80 |
| Elevated | 120–129 | < 80 |
| Stage 1 High | 130–139 | 80–89 |
| Stage 2 High | ≥ 140 | ≥ 90 |
| Crisis | > 180 | > 120 |

### What Affects Blood Pressure:
- Heart rate and stroke volume
- Blood vessel elasticity
- Blood volume
- Hormones (adrenaline, aldosterone)
- Kidney function

### Measuring Accurately:
- Sit quietly for 5 minutes before measuring
- Feet flat on floor, arm at heart level
- Don't smoke, exercise, or drink caffeine 30 minutes before
- Take 2–3 readings and average them`,
  },
  {
    keywords: ['cholesterol', 'ldl', 'hdl', 'triglycerides', 'lipids', 'lipid panel'],
    response: `## Understanding Cholesterol

Cholesterol is a waxy, fat-like substance found in every cell of your body. While essential for life, too much of certain types increases heart disease risk.

### Types of Cholesterol:
- **LDL (Low-Density Lipoprotein)** — "Bad" cholesterol; deposits in artery walls, causing plaque buildup
- **HDL (High-Density Lipoprotein)** — "Good" cholesterol; carries cholesterol away from arteries to the liver
- **Triglycerides** — Another type of fat in the blood; high levels increase heart disease risk
- **Total Cholesterol** — Sum of all cholesterol types

### Optimal Levels:
| Type | Optimal |
|------|---------|
| Total Cholesterol | < 200 mg/dL |
| LDL | < 100 mg/dL |
| HDL | > 60 mg/dL |
| Triglycerides | < 150 mg/dL |

### What Raises LDL:
- Saturated and trans fats
- Obesity
- Physical inactivity
- Smoking
- Genetics (familial hypercholesterolemia)
- Diabetes and hypothyroidism

### Lowering Cholesterol Naturally:
- Reduce saturated fat (red meat, full-fat dairy)
- Eliminate trans fats
- Eat soluble fiber (oats, beans, apples)
- Exercise regularly
- Lose excess weight
- Quit smoking
- Eat omega-3 rich foods (fatty fish, flaxseed)`,
  },
  {
    keywords: ['bmi', 'body mass index', 'overweight', 'obesity', 'underweight', 'healthy weight'],
    response: `## Body Mass Index (BMI)

BMI is a simple screening tool that uses height and weight to estimate body fat and categorize weight status. While useful, it has limitations and should be considered alongside other health measures.

### BMI Formula:
**BMI = weight (kg) ÷ height² (m²)**

Or in imperial: **BMI = (weight in lbs × 703) ÷ height² (inches²)**

### BMI Categories (Adults):
| BMI | Category |
|-----|----------|
| < 18.5 | Underweight |
| 18.5–24.9 | Normal weight |
| 25–29.9 | Overweight |
| 30–34.9 | Obese (Class I) |
| 35–39.9 | Obese (Class II) |
| ≥ 40 | Severely Obese (Class III) |

### Limitations of BMI:
- Doesn't distinguish between muscle and fat
- Doesn't account for fat distribution (waist circumference matters)
- May misclassify muscular athletes as overweight
- Different thresholds may apply to different ethnicities

### Better Health Indicators:
- **Waist circumference** — Men: < 40 inches; Women: < 35 inches
- **Waist-to-hip ratio**
- **Body fat percentage**
- **Metabolic health markers** (blood pressure, blood sugar, cholesterol)`,
  },
  {
    keywords: ['exercise', 'physical activity', 'workout', 'fitness', 'cardio', 'strength training', 'benefits of exercise'],
    response: `## Exercise & Physical Activity

Regular physical activity is one of the most powerful things you can do for your health. The benefits extend far beyond weight management.

### Recommended Activity Levels (Adults):
- **Moderate aerobic activity:** 150–300 minutes per week (brisk walking, cycling, swimming)
- **Vigorous aerobic activity:** 75–150 minutes per week (running, HIIT, sports)
- **Strength training:** 2+ days per week (all major muscle groups)
- **Flexibility/balance:** Daily stretching; balance exercises for older adults

### Health Benefits:
**Physical:**
- Reduces risk of heart disease, stroke, type 2 diabetes
- Strengthens bones and muscles
- Improves immune function
- Helps maintain healthy weight
- Reduces cancer risk

**Mental:**
- Reduces anxiety and depression
- Improves mood (endorphin release)
- Enhances cognitive function and memory
- Better sleep quality
- Increased energy levels

### Getting Started:
1. Start slowly and gradually increase intensity
2. Choose activities you enjoy
3. Mix cardio, strength, and flexibility
4. Find a workout partner for accountability
5. Schedule exercise like an appointment
6. Track progress to stay motivated

### Types of Exercise:
- **Aerobic/Cardio** — Walking, running, cycling, swimming, dancing
- **Strength/Resistance** — Weights, resistance bands, bodyweight exercises
- **Flexibility** — Yoga, stretching, Pilates
- **Balance** — Tai chi, single-leg exercises`,
  },
  {
    keywords: ['stress', 'stress management', 'cortisol', 'chronic stress', 'how to reduce stress'],
    response: `## Stress & Stress Management

Stress is your body's response to demands or threats. While short-term stress can be beneficial (motivating, protective), chronic stress is harmful to both physical and mental health.

### The Stress Response:
When you perceive a threat, your body releases **cortisol** and **adrenaline**, triggering the "fight-or-flight" response:
- Heart rate increases
- Blood pressure rises
- Muscles tense
- Digestion slows
- Immune function temporarily suppressed

### Effects of Chronic Stress:
- **Cardiovascular** — High blood pressure, increased heart disease risk
- **Immune** — Weakened immunity, more frequent illness
- **Digestive** — IBS, ulcers, nausea
- **Mental** — Anxiety, depression, burnout
- **Sleep** — Insomnia and poor sleep quality
- **Weight** — Cortisol promotes fat storage, especially abdominal

### Evidence-Based Stress Reduction:
1. **Exercise** — Most effective stress reliever; reduces cortisol
2. **Mindfulness meditation** — 10–20 minutes daily reduces cortisol levels
3. **Deep breathing** — Activates the parasympathetic nervous system
4. **Social connection** — Talking to friends releases oxytocin
5. **Time in nature** — Reduces cortisol and blood pressure
6. **Adequate sleep** — Sleep deprivation amplifies stress
7. **Journaling** — Processing emotions reduces rumination
8. **Limit caffeine and alcohol** — Both amplify stress response`,
  },
  {
    keywords: ['water', 'hydration', 'dehydration', 'how much water', 'drink water'],
    response: `## Hydration & Water Intake

Water is essential for virtually every function in your body. Even mild dehydration can impair physical and cognitive performance.

### Why Water Is Essential:
- Regulates body temperature
- Transports nutrients and oxygen to cells
- Flushes out waste products
- Lubricates joints
- Supports kidney function
- Aids digestion
- Maintains blood volume and pressure

### How Much Water Do You Need?
**General guidelines:**
- **Men:** ~3.7 liters (125 oz) total water per day
- **Women:** ~2.7 liters (91 oz) total water per day
- About 20% comes from food; the rest from beverages

**Factors that increase needs:**
- Hot weather or high humidity
- Exercise and physical activity
- Fever, vomiting, or diarrhea
- Pregnancy or breastfeeding
- High altitude

### Signs of Dehydration:
- Dark yellow urine (pale yellow = well hydrated)
- Thirst (already mildly dehydrated)
- Headache
- Fatigue and dizziness
- Dry mouth and lips
- Decreased urine output

### Hydration Tips:
1. Drink a glass of water when you wake up
2. Carry a reusable water bottle
3. Eat water-rich foods (cucumber, watermelon, oranges)
4. Drink before, during, and after exercise
5. Set reminders if you forget to drink`,
  },
  {
    keywords: ['vitamins', 'vitamin d', 'vitamin c', 'vitamin b12', 'supplements', 'micronutrients', 'minerals'],
    response: `## Essential Vitamins & Minerals

Vitamins and minerals are micronutrients your body needs in small amounts for hundreds of essential functions. Most people can get adequate amounts through a balanced diet.

### Key Vitamins:

**Vitamin D:**
- Essential for bone health, immune function, mood regulation
- Sources: Sunlight, fatty fish, fortified foods
- Deficiency: Very common; linked to bone loss, depression, weakened immunity

**Vitamin C:**
- Antioxidant; supports immune function, collagen synthesis, iron absorption
- Sources: Citrus fruits, bell peppers, strawberries, broccoli
- Deficiency: Scurvy (rare in developed countries)

**Vitamin B12:**
- Essential for nerve function, red blood cell formation, DNA synthesis
- Sources: Meat, fish, dairy, eggs (vegans need supplements)
- Deficiency: Fatigue, nerve damage, anemia

**Folate (B9):**
- Critical for cell division; essential during pregnancy to prevent neural tube defects
- Sources: Leafy greens, legumes, fortified grains

### Key Minerals:

**Iron:** Oxygen transport; deficiency causes anemia (fatigue, weakness)
**Calcium:** Bone and teeth health, muscle function, nerve signaling
**Magnesium:** 300+ enzymatic reactions; sleep, muscle, and nerve function
**Zinc:** Immune function, wound healing, taste and smell
**Potassium:** Blood pressure regulation, heart and muscle function

### When to Consider Supplements:
- Vitamin D (especially in northern climates or limited sun exposure)
- B12 (vegans and vegetarians)
- Iron (women with heavy periods, pregnant women)
- Folate (women planning pregnancy)

> ⚕️ *Always consult a doctor before starting supplements — more is not always better.*`,
  },
];

export function getGeneralKnowledgeResponse(input: string): string | null {
  const lower = input.toLowerCase();

  let bestMatch: GeneralTopic | null = null;
  let bestScore = 0;

  for (const topic of GENERAL_TOPICS) {
    let score = 0;
    for (const keyword of topic.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  return bestScore > 0 && bestMatch ? bestMatch.response : null;
}
