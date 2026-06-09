from django.core.management.base import BaseCommand
from api.models import SeasonalTip


TIPS = [
    # ── WINTER ──────────────────────────────────────────────────
    ("winter", "vata", "diet", "Eat warm, oily, and nourishing foods like soups, stews, and kitchari. Vata is aggravated by cold and dryness in winter.", "Charaka Samhita"),
    ("winter", "vata", "diet", "Include ghee, sesame oil, and warm spices like ginger, cinnamon, and cardamom in your winter meals to pacify Vata.", "Ashtanga Hridayam"),
    ("winter", "vata", "lifestyle", "Practice Abhyanga (warm oil self-massage) with sesame oil every morning before bathing to nourish dry skin and calm Vata.", "Charaka Samhita"),
    ("winter", "vata", "yoga", "Practice slow, grounding yoga poses like Child's Pose, Mountain Pose, and Warrior I to stabilize Vata energy in winter.", "Yoga Sutras"),
    ("winter", "pitta", "diet", "Winter is a good time for Pitta to enjoy slightly warming foods. Include moderate spices and avoid excessive cold foods.", "Sushruta Samhita"),
    ("winter", "pitta", "lifestyle", "Use this season to build inner warmth through meditation and pranayama. Pitta benefits from the cooling effect of winter.", "Ashtanga Hridayam"),
    ("winter", "kapha", "diet", "Kapha should avoid heavy, cold, and sweet foods in winter. Favor light, warm, spicy foods with ginger, black pepper, and turmeric.", "Charaka Samhita"),
    ("winter", "kapha", "lifestyle", "Exercise vigorously in winter to counteract Kapha's tendency toward lethargy. Morning exercise before 6am is especially beneficial.", "Ashtanga Hridayam"),
    ("winter", "kapha", "herbs", "Trikatu (ginger, black pepper, long pepper) is excellent for Kapha in winter — it kindles digestive fire and clears congestion.", "Charaka Samhita"),
    ("winter", "all", "diet", "Eat warm, freshly cooked meals in winter. Avoid cold, raw, and leftover foods which are harder to digest in cold weather.", "Charaka Samhita"),
    ("winter", "all", "lifestyle", "Maintain a consistent daily routine (Dinacharya) in winter. Wake up early, exercise, and eat meals at the same time each day.", "Ashtanga Hridayam"),
    ("winter", "all", "herbs", "Ashwagandha is the premier winter herb — it builds strength, immunity, and resilience against cold and stress.", "Charaka Samhita"),
    ("winter", "all", "yoga", "Practice Surya Namaskar (Sun Salutation) in the morning to generate internal heat and energize the body during cold winter months.", "Hatha Yoga Pradipika"),
    ("winter", "vata", "herbs", "Triphala taken with warm water before bed supports digestion and elimination — especially important for Vata in winter.", "Charaka Samhita"),
    ("winter", "pitta", "yoga", "Cooling pranayama like Sheetali (cooling breath) can be reduced in winter. Focus on Nadi Shodhana for balance instead.", "Hatha Yoga Pradipika"),

    # ── SPRING ──────────────────────────────────────────────────
    ("spring", "kapha", "diet", "Spring is Kapha season — favor light, dry, and spicy foods. Eat bitter greens, legumes, and warming spices to counter Kapha accumulation.", "Charaka Samhita"),
    ("spring", "kapha", "lifestyle", "Spring is the ideal time for Kapha to detox. Try a 3-day kitchari cleanse to clear winter's accumulated heaviness.", "Ashtanga Hridayam"),
    ("spring", "kapha", "yoga", "Practice vigorous, heating yoga in spring — Sun Salutations, backbends, and inversions help move stagnant Kapha energy.", "Yoga Sutras"),
    ("spring", "kapha", "herbs", "Trikatu and Triphala are excellent spring herbs for Kapha — they stimulate digestion and help clear accumulated mucus.", "Charaka Samhita"),
    ("spring", "vata", "diet", "As spring warms up, Vata can begin transitioning to lighter foods. Include fresh spring greens but keep meals warm and cooked.", "Sushruta Samhita"),
    ("spring", "pitta", "diet", "Spring is a good time for Pitta to enjoy cooling bitter greens like dandelion and arugula which support liver detoxification.", "Charaka Samhita"),
    ("spring", "all", "diet", "Reduce heavy, sweet, and oily foods in spring. Favor bitter, pungent, and astringent tastes to counter Kapha's seasonal dominance.", "Charaka Samhita"),
    ("spring", "all", "lifestyle", "Spring is nature's renewal season. Use this time to establish new healthy habits, declutter your space, and refresh your routine.", "Ashtanga Hridayam"),
    ("spring", "all", "herbs", "Neem is the quintessential spring herb — its bitter taste purifies the blood and supports the liver's natural detox processes.", "Charaka Samhita"),
    ("spring", "all", "yoga", "Practice Kapalabhati (skull-shining breath) in spring to clear respiratory congestion and energize the body after winter.", "Hatha Yoga Pradipika"),
    ("spring", "kapha", "diet", "Honey (raw, not heated) is the only sweet Kapha can enjoy freely in spring — it has scraping qualities that reduce Kapha.", "Charaka Samhita"),
    ("spring", "vata", "lifestyle", "Spring's unpredictable weather can aggravate Vata. Dress in layers, maintain routine, and avoid excessive travel in early spring.", "Ashtanga Hridayam"),
    ("spring", "pitta", "lifestyle", "Use spring's fresh energy for new projects and creative endeavors. Pitta's natural drive is well-supported by spring's expansive energy.", "Charaka Samhita"),
    ("spring", "all", "diet", "Eat lighter meals in spring — your digestive fire naturally decreases as the body focuses on renewal and detoxification.", "Sushruta Samhita"),
    ("spring", "all", "lifestyle", "Spend time outdoors in spring morning air. Early morning walks in nature help clear winter stagnation from all doshas.", "Ashtanga Hridayam"),

    # ── SUMMER ──────────────────────────────────────────────────
    ("summer", "pitta", "diet", "Summer is Pitta season — favor cooling foods like coconut water, cucumber, mint, coriander, and sweet fruits to prevent overheating.", "Charaka Samhita"),
    ("summer", "pitta", "lifestyle", "Avoid exercising during peak heat (10am-2pm). Exercise in the cool morning or evening. Swim in cool water to pacify Pitta.", "Ashtanga Hridayam"),
    ("summer", "pitta", "yoga", "Practice cooling yoga in summer — Moon Salutations, forward folds, and restorative poses help calm Pitta's fiery nature.", "Yoga Sutras"),
    ("summer", "pitta", "herbs", "Brahmi (Bacopa) is excellent for Pitta in summer — it cools the mind, reduces inflammation, and supports mental clarity.", "Charaka Samhita"),
    ("summer", "vata", "diet", "Summer heat can dry out Vata. Stay well-hydrated with room-temperature water, coconut water, and juicy fruits like mango and melon.", "Sushruta Samhita"),
    ("summer", "kapha", "diet", "Summer's heat naturally reduces Kapha. Enjoy lighter foods and take advantage of the season's natural Kapha-reducing effect.", "Charaka Samhita"),
    ("summer", "all", "diet", "Eat cooling, hydrating foods in summer — cucumber raita, mint chutney, coconut water, and fresh seasonal fruits are ideal.", "Charaka Samhita"),
    ("summer", "all", "lifestyle", "Stay hydrated in summer. Ayurveda recommends room-temperature or slightly cool water — avoid ice-cold drinks which shock digestion.", "Ashtanga Hridayam"),
    ("summer", "all", "herbs", "Rose water and rose petals are cooling and calming for all doshas in summer. Add rose water to drinks or use as a facial mist.", "Charaka Samhita"),
    ("summer", "all", "yoga", "Practice Sheetali pranayama (cooling breath through rolled tongue) in summer to reduce internal heat and calm the nervous system.", "Hatha Yoga Pradipika"),
    ("summer", "pitta", "diet", "Avoid spicy, fermented, and sour foods in summer as they increase Pitta's heat. Favor sweet, bitter, and astringent tastes.", "Charaka Samhita"),
    ("summer", "vata", "lifestyle", "Summer travel can aggravate Vata. If traveling, stay hydrated, maintain meal times, and carry grounding snacks like dates and nuts.", "Ashtanga Hridayam"),
    ("summer", "all", "diet", "Eat your main meal at noon in summer when digestive fire is strongest, but keep it lighter than in winter months.", "Charaka Samhita"),
    ("summer", "pitta", "lifestyle", "Moonlight walks in summer are deeply cooling for Pitta. Spend time near water — lakes, rivers, or the ocean — to reduce heat.", "Ashtanga Hridayam"),
    ("summer", "all", "lifestyle", "Wear light, natural fabrics in summer — cotton and linen allow the skin to breathe and prevent Pitta aggravation from heat.", "Charaka Samhita"),

    # ── AUTUMN ──────────────────────────────────────────────────
    ("autumn", "vata", "diet", "Autumn is Vata season — favor warm, oily, and grounding foods. Root vegetables, soups, and warm grains are ideal.", "Charaka Samhita"),
    ("autumn", "vata", "lifestyle", "Establish a strong daily routine in autumn to counter Vata's tendency toward irregularity. Consistent sleep and meal times are essential.", "Ashtanga Hridayam"),
    ("autumn", "vata", "yoga", "Practice grounding, slow yoga in autumn — Yin yoga, restorative poses, and long holds help stabilize Vata's airy nature.", "Yoga Sutras"),
    ("autumn", "vata", "herbs", "Ashwagandha and Shatavari are excellent autumn herbs for Vata — they build strength, nourish tissues, and calm the nervous system.", "Charaka Samhita"),
    ("autumn", "pitta", "diet", "Autumn's cooling temperatures help pacify Pitta. Transition from summer's cooling foods to more warming, nourishing autumn foods.", "Sushruta Samhita"),
    ("autumn", "kapha", "diet", "Kapha should continue eating light and spicy in early autumn. As temperatures drop, gradually add more warming foods.", "Charaka Samhita"),
    ("autumn", "all", "diet", "Eat warm, cooked, and slightly oily foods in autumn. Avoid cold, raw, and dry foods which aggravate the dominant Vata energy.", "Charaka Samhita"),
    ("autumn", "all", "lifestyle", "Autumn is a time for introspection and preparation. Begin building immunity for winter through herbs, warm foods, and adequate rest.", "Ashtanga Hridayam"),
    ("autumn", "all", "herbs", "Chyawanprash is the ultimate autumn tonic — this ancient herbal jam builds immunity, strength, and vitality for the coming winter.", "Charaka Samhita"),
    ("autumn", "all", "yoga", "Practice Nadi Shodhana (alternate nostril breathing) in autumn to balance the nervous system and prepare for winter's inward energy.", "Hatha Yoga Pradipika"),
    ("autumn", "vata", "diet", "Warm sesame milk with cardamom and nutmeg before bed is deeply nourishing for Vata in autumn — it promotes sound sleep.", "Charaka Samhita"),
    ("autumn", "pitta", "lifestyle", "Use autumn's reflective energy for journaling and self-assessment. Pitta benefits from reviewing goals and releasing perfectionism.", "Ashtanga Hridayam"),
    ("autumn", "all", "diet", "Harvest season brings abundance — enjoy seasonal squash, sweet potatoes, apples, and pears which are naturally balancing in autumn.", "Charaka Samhita"),
    ("autumn", "kapha", "lifestyle", "Maintain exercise intensity in autumn to prevent Kapha from becoming sluggish as temperatures drop and days shorten.", "Ashtanga Hridayam"),
    ("autumn", "all", "lifestyle", "Oil your scalp and feet with warm sesame oil in autumn to prevent Vata-related dryness, anxiety, and poor sleep.", "Charaka Samhita"),
]


class Command(BaseCommand):
    help = "Seed the database with 60 seasonal Ayurvedic tips"

    def handle(self, *args, **options):
        if SeasonalTip.objects.exists():
            self.stdout.write(self.style.WARNING("Tips already seeded. Use --clear to reset."))
            if not self.get_clear_flag(options):
                return
            SeasonalTip.objects.all().delete()
            self.stdout.write("Cleared existing tips.")

        created = 0
        for season, dosha, category, tip_text, source in TIPS:
            SeasonalTip.objects.create(
                season=season,
                dosha=dosha,
                category=category,
                tip_text=tip_text,
                source=source,
            )
            created += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created} seasonal tips."))

    def get_clear_flag(self, options):
        return options.get("clear", False)

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Clear existing tips before seeding")
