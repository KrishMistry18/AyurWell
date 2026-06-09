from django.core.management.base import BaseCommand
from api.models import Badge

BADGES = [
    # STREAK
    {"slug":"first-step","name":"First Step","description":"Logged your first wellness entry","icon_emoji":"👣","category":"streak","requirement_description":"Log your first wellness entry","is_rare":False,"sort_order":1},
    {"slug":"week-warrior","name":"Week Warrior","description":"Logged 7 days in a row","icon_emoji":"🔥","category":"streak","requirement_description":"Maintain a 7-day logging streak","is_rare":False,"sort_order":2},
    {"slug":"fortnight-champion","name":"Fortnight Champion","description":"Logged 14 days in a row","icon_emoji":"⚡","category":"streak","requirement_description":"Maintain a 14-day logging streak","is_rare":False,"sort_order":3},
    {"slug":"30-day-sage","name":"30-Day Sage","description":"Logged 30 days in a row","icon_emoji":"🧘","category":"streak","requirement_description":"Maintain a 30-day logging streak","is_rare":True,"sort_order":4},
    {"slug":"100-day-yogi","name":"100-Day Yogi","description":"Logged 100 days in a row","icon_emoji":"🏆","category":"streak","requirement_description":"Maintain a 100-day logging streak","is_rare":True,"sort_order":5},
    # WELLNESS
    {"slug":"energy-master","name":"Energy Master","description":"Averaged energy above 8 for 7 days","icon_emoji":"⚡","category":"wellness","requirement_description":"Average energy score above 8/10 for 7 consecutive days","is_rare":False,"sort_order":1},
    {"slug":"sleep-champion","name":"Sleep Champion","description":"Averaged 8+ hours sleep for 7 days","icon_emoji":"😴","category":"wellness","requirement_description":"Average 8+ hours of sleep for 7 consecutive days","is_rare":False,"sort_order":2},
    {"slug":"hydration-hero","name":"Hydration Hero","description":"Drank 2000ml+ water for 7 days","icon_emoji":"💧","category":"wellness","requirement_description":"Log 2000ml+ water intake for 7 consecutive days","is_rare":False,"sort_order":3},
    {"slug":"mood-lifter","name":"Mood Lifter","description":"Averaged mood above 4 for 7 days","icon_emoji":"😄","category":"wellness","requirement_description":"Average mood score above 4/5 for 7 consecutive days","is_rare":False,"sort_order":4},
    {"slug":"pulse-pioneer","name":"Pulse Pioneer","description":"Generated your first AI Pulse Check","icon_emoji":"💓","category":"wellness","requirement_description":"Generate your first AI Pulse Check","is_rare":False,"sort_order":5},
    {"slug":"excellent-pulse","name":"Excellent Pulse","description":"Achieved an Excellent pulse score","icon_emoji":"🌟","category":"wellness","requirement_description":"Score 80+ on your AI Pulse Check","is_rare":True,"sort_order":6},
    # DIET
    {"slug":"plan-pioneer","name":"Plan Pioneer","description":"Generated your first diet plan","icon_emoji":"🥗","category":"diet","requirement_description":"Generate your first personalized diet plan","is_rare":False,"sort_order":1},
    {"slug":"seasonal-eater","name":"Seasonal Eater","description":"Generated plans for all 4 seasons","icon_emoji":"🌸","category":"diet","requirement_description":"Generate diet plans for Spring, Summer, Autumn, and Winter","is_rare":True,"sort_order":2},
    {"slug":"meal-swapper","name":"Meal Swapper","description":"Swapped 5 meals with AI alternatives","icon_emoji":"🔄","category":"diet","requirement_description":"Use the AI meal swap feature 5 times","is_rare":False,"sort_order":3},
    {"slug":"recipe-explorer","name":"Recipe Explorer","description":"Generated 10 different diet plans","icon_emoji":"📖","category":"diet","requirement_description":"Generate 10 diet plans total","is_rare":True,"sort_order":4},
    {"slug":"pdf-downloader","name":"Plan Keeper","description":"Downloaded your diet plan as PDF","icon_emoji":"📄","category":"diet","requirement_description":"Download your diet plan as a PDF","is_rare":False,"sort_order":5},
    # DOSHA
    {"slug":"self-aware","name":"Self-Aware","description":"Completed the Dosha Quiz","icon_emoji":"🧬","category":"dosha","requirement_description":"Complete the Dosha Assessment Quiz","is_rare":False,"sort_order":1},
    {"slug":"balanced-being","name":"Balanced Being","description":"Retook the quiz after 30 days","icon_emoji":"⚖️","category":"dosha","requirement_description":"Retake the Dosha Quiz after 30 days","is_rare":False,"sort_order":2},
    {"slug":"tridoshic","name":"Tridoshic","description":"Achieved near-equal dosha balance","icon_emoji":"🌀","category":"dosha","requirement_description":"Score within 10% on all three doshas in the quiz","is_rare":True,"sort_order":3},
    {"slug":"herb-explorer","name":"Herb Explorer","description":"Saved 5 herbs to your profile","icon_emoji":"🌿","category":"dosha","requirement_description":"Add 5 herbs to your preferred herbs list","is_rare":False,"sort_order":4},
    # SPECIAL
    {"slug":"early-adopter","name":"Early Adopter","description":"One of the first to join AyurWell","icon_emoji":"🌟","category":"special","requirement_description":"Create an account during the early access period","is_rare":True,"sort_order":1},
    {"slug":"night-owl","name":"Night Owl","description":"Logged wellness after 10pm","icon_emoji":"🦉","category":"special","requirement_description":"Submit a wellness log after 10:00 PM","is_rare":False,"sort_order":2},
    {"slug":"dawn-riser","name":"Dawn Riser","description":"Logged wellness before 7am","icon_emoji":"🌅","category":"special","requirement_description":"Submit a wellness log before 7:00 AM","is_rare":False,"sort_order":3},
    {"slug":"coach-user","name":"Wisdom Seeker","description":"Had your first conversation with Vaidya","icon_emoji":"🤖","category":"special","requirement_description":"Send your first message to the AI Wellness Coach","is_rare":False,"sort_order":4},
    {"slug":"tour-complete","name":"Orientation Complete","description":"Completed the onboarding tour","icon_emoji":"🎓","category":"special","requirement_description":"Complete the AyurWell onboarding tour","is_rare":False,"sort_order":5},
]


class Command(BaseCommand):
    help = "Seed the database with gamification badges"

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true")

    def handle(self, *args, **options):
        if options.get("clear"):
            Badge.objects.all().delete()
            self.stdout.write("Cleared existing badges.")

        created = 0
        for b in BADGES:
            _, was_created = Badge.objects.get_or_create(slug=b["slug"], defaults=b)
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} badges ({Badge.objects.count()} total)."))
