
# ── Symptom Checker ───────────────────────────────────────────────────────────

SYMPTOM_FALLBACKS = {
    "fatigue": {
        "likely_imbalance": "Vata-Kapha Imbalance — Low Ojas (Vital Energy)",
        "affected_dosha": "vata",
        "explanation": "Fatigue in Ayurveda often signals depleted Ojas (vital essence) and weakened Agni (digestive fire). Vata imbalance disrupts the nervous system while Kapha accumulation creates heaviness and lethargy.",
        "home_remedies": [
            {"remedy": "Ashwagandha Milk", "instructions": "Mix 1 tsp Ashwagandha powder in warm milk with honey and cardamom", "frequency": "Every night before bed"},
            {"remedy": "Ginger-Lemon Morning Tonic", "instructions": "Squeeze half a lemon into warm water with a slice of fresh ginger and a pinch of rock salt", "frequency": "Every morning on empty stomach"},
            {"remedy": "Sesame Oil Abhyanga", "instructions": "Warm sesame oil and massage entire body for 10-15 minutes before bathing", "frequency": "3-4 times per week"},
        ],
        "herbs_to_try": ["Ashwagandha", "Shatavari", "Triphala"],
        "lifestyle_tips": ["Maintain consistent sleep and wake times", "Eat warm, nourishing meals at regular intervals", "Practice 10 minutes of Pranayama (Nadi Shodhana) daily"],
        "dietary_advice": "Favor warm, cooked, easily digestible foods. Include ghee, sesame seeds, dates, and warm soups. Avoid cold, raw, and processed foods that dampen digestive fire.",
        "when_to_see_doctor": "If fatigue persists for more than 2 weeks, is accompanied by unexplained weight loss, fever, or shortness of breath.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
    "bloating": {
        "likely_imbalance": "Vata Imbalance — Disturbed Apana Vayu",
        "affected_dosha": "vata",
        "explanation": "Bloating and gas are classic signs of Vata imbalance in the colon, specifically disturbed Apana Vayu (downward-moving energy). Weak digestive fire (Agni) leads to incomplete digestion and gas formation.",
        "home_remedies": [
            {"remedy": "Cumin-Coriander-Fennel Tea (CCF Tea)", "instructions": "Boil equal parts cumin, coriander, and fennel seeds (1 tsp each) in 2 cups water for 5 minutes, strain and drink", "frequency": "After each meal"},
            {"remedy": "Ginger Digestive Aid", "instructions": "Chew a small piece of fresh ginger with a pinch of rock salt and a squeeze of lemon before meals", "frequency": "15 minutes before each meal"},
            {"remedy": "Warm Castor Oil Compress", "instructions": "Apply warm castor oil to the abdomen and cover with a warm cloth for 20 minutes", "frequency": "Once daily in the evening"},
        ],
        "herbs_to_try": ["Fennel", "Ginger", "Triphala"],
        "lifestyle_tips": ["Eat slowly and chew thoroughly", "Avoid drinking cold water with meals", "Take a short 10-minute walk after meals"],
        "dietary_advice": "Avoid beans, raw vegetables, carbonated drinks, and cold foods. Favor warm soups, kitchari, cooked vegetables with digestive spices like cumin, ginger, and asafoetida.",
        "when_to_see_doctor": "If bloating is severe, persistent, accompanied by pain, blood in stool, or significant weight loss.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
    "headache": {
        "likely_imbalance": "Pitta Imbalance — Excess Heat in the Head",
        "affected_dosha": "pitta",
        "explanation": "Headaches in Ayurveda most commonly indicate Pitta imbalance with excess heat accumulating in the head and neck region. Vata-type headaches are throbbing and related to tension, while Pitta headaches are burning and intense.",
        "home_remedies": [
            {"remedy": "Brahmi Oil Head Massage", "instructions": "Warm Brahmi or coconut oil and gently massage the scalp, temples, and back of neck for 10 minutes", "frequency": "Daily or at onset of headache"},
            {"remedy": "Sandalwood Paste", "instructions": "Mix sandalwood powder with rose water to form a paste and apply to forehead and temples", "frequency": "At onset of headache, leave for 20 minutes"},
            {"remedy": "Peppermint-Ginger Tea", "instructions": "Steep fresh peppermint leaves and a slice of ginger in hot water for 5 minutes", "frequency": "2-3 times daily during headache"},
        ],
        "herbs_to_try": ["Brahmi", "Shankhpushpi", "Shatavari"],
        "lifestyle_tips": ["Avoid direct sun exposure and overheating", "Practice Sheetali pranayama (cooling breath)", "Reduce screen time and eye strain"],
        "dietary_advice": "Avoid spicy, sour, and fermented foods. Favor cooling foods like cucumber, coconut water, coriander, and mint. Stay well hydrated with room-temperature water.",
        "when_to_see_doctor": "If headache is sudden and severe ('thunderclap'), accompanied by fever, stiff neck, vision changes, or neurological symptoms.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
    "default": {
        "likely_imbalance": "General Dosha Imbalance",
        "affected_dosha": "vata",
        "explanation": "Your symptoms suggest a general imbalance that may be affecting your digestive fire (Agni) and overall vitality (Ojas). Ayurveda recommends returning to foundational practices to restore balance.",
        "home_remedies": [
            {"remedy": "Triphala Tonic", "instructions": "Mix 1 tsp Triphala powder in warm water and drink", "frequency": "Before bed daily"},
            {"remedy": "Golden Milk", "instructions": "Mix 1 tsp turmeric, pinch of black pepper, and honey in warm milk", "frequency": "Once daily"},
            {"remedy": "Warm Water Therapy", "instructions": "Sip warm water throughout the day — start morning with 2 glasses of warm water", "frequency": "Throughout the day"},
        ],
        "herbs_to_try": ["Triphala", "Ashwagandha", "Tulsi"],
        "lifestyle_tips": ["Establish a consistent daily routine (Dinacharya)", "Eat meals at the same time each day", "Get 7-8 hours of sleep at consistent times"],
        "dietary_advice": "Favor warm, freshly cooked, easily digestible foods. Eat your largest meal at noon. Avoid processed, cold, and leftover foods.",
        "when_to_see_doctor": "If symptoms persist for more than 1-2 weeks, worsen significantly, or are accompanied by fever, severe pain, or other concerning symptoms.",
        "disclaimer": "This is not medical advice. AyurWell provides general Ayurvedic wellness guidance only. Always consult a qualified healthcare provider for medical concerns.",
    },
}


def symptoms_analyze(request):
    pass


# ── Compatibility Data ────────────────────────────────────────────────────────

COMPATIBILITY_DATA = {
    ("vata", "vata"): {
        "score": 72, "rating": "Good",
        "summary": "Two Vata types share a deep creative and spontaneous connection. You understand each other's need for freedom and change, but may struggle with grounding and stability together.",
        "strengths": ["Shared love of creativity and new experiences", "Deep intellectual and spiritual connection", "Mutual understanding of sensitivity and intuition"],
        "challenges": ["Both may struggle with routine and consistency", "Financial and practical matters may be neglected"],
        "meal_plan_tip": "Cook warm, grounding meals together — kitchari, root vegetable soups, and warm spiced milk. Establish regular meal times to ground your shared Vata energy.",
        "best_activities_together": ["Creative arts and music", "Travel and exploration", "Yoga and meditation retreats"],
        "communication_tip": "Both of you tend to have racing thoughts — practice active listening and slow down conversations. Write down important decisions to avoid forgetting them.",
    },
    ("vata", "pitta"): {
        "score": 85, "rating": "Excellent",
        "summary": "Vata and Pitta create a dynamic and complementary partnership. Pitta's focus and drive grounds Vata's creativity, while Vata's flexibility softens Pitta's intensity.",
        "strengths": ["Complementary strengths — creativity meets execution", "Pitta provides direction for Vata's ideas", "Vata brings lightness to Pitta's seriousness"],
        "challenges": ["Pitta's directness can overwhelm sensitive Vata", "Vata's inconsistency can frustrate goal-oriented Pitta"],
        "meal_plan_tip": "Balance warming Vata foods with cooling Pitta foods. Try coconut-based curries, cooling coriander rice, and warm but not spicy meals that satisfy both constitutions.",
        "best_activities_together": ["Hiking and nature walks", "Cooking and trying new cuisines", "Strategic games and creative projects"],
        "communication_tip": "Pitta should soften their directness, while Vata should practice following through on commitments. Schedule regular check-ins to stay aligned.",
    },
    ("vata", "kapha"): {
        "score": 78, "rating": "Good",
        "summary": "Vata and Kapha are opposites in many ways, which creates both attraction and friction. Kapha's stability grounds Vata, while Vata's energy and enthusiasm motivates Kapha.",
        "strengths": ["Kapha provides the stability and security Vata needs", "Vata brings excitement and new experiences to Kapha's life", "Natural balance of movement and stillness"],
        "challenges": ["Very different energy levels and pace of life", "Vata's need for change conflicts with Kapha's love of routine"],
        "meal_plan_tip": "Find middle ground with warm, moderately spiced meals. Avoid Kapha-heavy foods like dairy and sweets, while ensuring Vata gets enough nourishment. Lentil soups and grain bowls work well.",
        "best_activities_together": ["Gentle hiking and nature walks", "Cooking and gardening", "Community service and nurturing activities"],
        "communication_tip": "Vata should slow down and give Kapha time to process. Kapha should be open to spontaneity. Respect each other's different rhythms.",
    },
    ("pitta", "pitta"): {
        "score": 68, "rating": "Moderate",
        "summary": "Two Pitta types share incredible drive, passion, and ambition. However, two fires together can create intense heat — both in passion and conflict. Success requires conscious cooling practices.",
        "strengths": ["Shared ambition and drive toward goals", "Deep mutual respect for competence and achievement", "Passionate and intense connection"],
        "challenges": ["Power struggles and competition can arise", "Both may be too critical and demanding of each other"],
        "meal_plan_tip": "Prioritize cooling, anti-inflammatory meals together. Coconut water, cucumber salads, mint chutneys, and sweet fruits help balance the double-Pitta heat. Avoid spicy food dates.",
        "best_activities_together": ["Swimming and water sports", "Intellectual debates and learning", "Charitable and leadership activities"],
        "communication_tip": "Establish a rule: no important discussions when either person is hungry or overheated. Practice taking turns leading and following. Celebrate each other's wins generously.",
    },
    ("pitta", "kapha"): {
        "score": 82, "rating": "Excellent",
        "summary": "Pitta and Kapha form a powerful and stable partnership. Pitta's fire and drive is beautifully balanced by Kapha's calm, nurturing nature. This is one of the most complementary pairings.",
        "strengths": ["Pitta's vision combined with Kapha's endurance creates lasting success", "Kapha's patience balances Pitta's intensity", "Deep loyalty and commitment from both sides"],
        "challenges": ["Pitta may find Kapha too slow or resistant to change", "Kapha may feel overwhelmed by Pitta's high standards"],
        "meal_plan_tip": "Enjoy warming but not overly spicy meals. Pitta benefits from Kapha's love of cooking — let Kapha prepare nourishing meals while Pitta brings the spice and variety.",
        "best_activities_together": ["Building and creating together (home, business)", "Cooking and hosting gatherings", "Outdoor activities in nature"],
        "communication_tip": "Pitta should appreciate Kapha's steady support without taking it for granted. Kapha should express needs clearly rather than silently accommodating. Regular appreciation rituals strengthen this bond.",
    },
    ("kapha", "kapha"): {
        "score": 75, "rating": "Good",
        "summary": "Two Kapha types create a deeply stable, loyal, and nurturing relationship. You share a love of comfort, routine, and deep connection. The main challenge is motivating each other toward growth and change.",
        "strengths": ["Exceptional loyalty and long-term commitment", "Deep emotional understanding and empathy", "Shared love of home, family, and comfort"],
        "challenges": ["Both may resist necessary change and growth", "Risk of becoming too comfortable and stagnant together"],
        "meal_plan_tip": "Motivate each other to eat lighter, more stimulating meals. Incorporate warming spices, bitter greens, and light grains. Avoid the temptation to indulge in heavy, sweet comfort foods together.",
        "best_activities_together": ["Vigorous exercise and fitness challenges", "Travel to new places", "Learning new skills and taking classes together"],
        "communication_tip": "Gently challenge each other to step outside comfort zones. Create shared goals that require growth. Celebrate small wins to build momentum for bigger changes.",
    },
    ("pitta", "vata"): {
        "score": 85, "rating": "Excellent",
        "summary": "Vata and Pitta create a dynamic and complementary partnership. Pitta's focus and drive grounds Vata's creativity, while Vata's flexibility softens Pitta's intensity.",
        "strengths": ["Complementary strengths — creativity meets execution", "Pitta provides direction for Vata's ideas", "Vata brings lightness to Pitta's seriousness"],
        "challenges": ["Pitta's directness can overwhelm sensitive Vata", "Vata's inconsistency can frustrate goal-oriented Pitta"],
        "meal_plan_tip": "Balance warming Vata foods with cooling Pitta foods. Try coconut-based curries, cooling coriander rice, and warm but not spicy meals that satisfy both constitutions.",
        "best_activities_together": ["Hiking and nature walks", "Cooking and trying new cuisines", "Strategic games and creative projects"],
        "communication_tip": "Pitta should soften their directness, while Vata should practice following through on commitments. Schedule regular check-ins to stay aligned.",
    },
    ("kapha", "vata"): {
        "score": 78, "rating": "Good",
        "summary": "Vata and Kapha are opposites in many ways, which creates both attraction and friction. Kapha's stability grounds Vata, while Vata's energy and enthusiasm motivates Kapha.",
        "strengths": ["Kapha provides the stability and security Vata needs", "Vata brings excitement and new experiences to Kapha's life", "Natural balance of movement and stillness"],
        "challenges": ["Very different energy levels and pace of life", "Vata's need for change conflicts with Kapha's love of routine"],
        "meal_plan_tip": "Find middle ground with warm, moderately spiced meals. Avoid Kapha-heavy foods like dairy and sweets, while ensuring Vata gets enough nourishment. Lentil soups and grain bowls work well.",
        "best_activities_together": ["Gentle hiking and nature walks", "Cooking and gardening", "Community service and nurturing activities"],
        "communication_tip": "Vata should slow down and give Kapha time to process. Kapha should be open to spontaneity. Respect each other's different rhythms.",
    },
    ("kapha", "pitta"): {
        "score": 82, "rating": "Excellent",
        "summary": "Pitta and Kapha form a powerful and stable partnership. Pitta's fire and drive is beautifully balanced by Kapha's calm, nurturing nature. This is one of the most complementary pairings.",
        "strengths": ["Pitta's vision combined with Kapha's endurance creates lasting success", "Kapha's patience balances Pitta's intensity", "Deep loyalty and commitment from both sides"],
        "challenges": ["Pitta may find Kapha too slow or resistant to change", "Kapha may feel overwhelmed by Pitta's high standards"],
        "meal_plan_tip": "Enjoy warming but not overly spicy meals. Pitta benefits from Kapha's love of cooking — let Kapha prepare nourishing meals while Pitta brings the spice and variety.",
        "best_activities_together": ["Building and creating together (home, business)", "Cooking and hosting gatherings", "Outdoor activities in nature"],
        "communication_tip": "Pitta should appreciate Kapha's steady support without taking it for granted. Kapha should express needs clearly rather than silently accommodating. Regular appreciation rituals strengthen this bond.",
    },
}
