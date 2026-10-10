# backend/seed_data.py
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from services.models import Service, Barber
from store.models import Category, Product
from reviews.models import Review
# from ai_advisor.models import Hairstyle

def seed_data():
    print("🚀 Starting database seeding...")

    # 1. Create Services
    services_data = [
        {'name': 'Classic Haircut', 'description': 'Precision cut tailored to your style', 'duration': 30, 'price': 25.00, 'icon': '✂️', 'order': 1},
        {'name': 'Beard Grooming', 'description': 'Shape, trim & condition your beard', 'duration': 20, 'price': 15.00, 'icon': '🧔', 'order': 2},
        {'name': 'Hot Towel Shave', 'description': 'Traditional straight razor experience', 'duration': 25, 'price': 30.00, 'icon': '🪒', 'order': 3},
        {'name': 'Hair + Beard Combo', 'description': 'Complete grooming package', 'duration': 45, 'price': 35.00, 'icon': '💇', 'order': 4},
        {'name': 'Kids Haircut', 'description': 'Fun & friendly cuts for young ones', 'duration': 20, 'price': 18.00, 'icon': '🧒', 'order': 5},
        {'name': 'Hair Coloring', 'description': 'Bold or subtle color transformations', 'duration': 60, 'price': 45.00, 'icon': '🎨', 'order': 6},
    ]

    services = []
    for s in services_data:
        service, created = Service.objects.get_or_create(name=s['name'], defaults=s)
        services.append(service)
        print(f"✅ Service: {s['name']} ({'Created' if created else 'Exists'})")

    # 2. Create Barbers
    barbers_data = [
        {'name': 'Marcus Johnson', 'specialty': 'Fade Specialist', 'rating': 4.9, 'years_experience': 8, 'is_available': True},
        {'name': 'David Chen', 'specialty': 'Beard Expert', 'rating': 4.8, 'years_experience': 6, 'is_available': True},
        {'name': 'James Wilson', 'specialty': 'Classic Cuts', 'rating': 4.9, 'years_experience': 10, 'is_available': True},
        {'name': 'Carlos Rivera', 'specialty': 'Creative Stylist', 'rating': 4.7, 'years_experience': 5, 'is_available': True},
    ]

    for b in barbers_data:
        barber, created = Barber.objects.get_or_create(name=b['name'], defaults=b)
        barber.services.set(services)
        print(f"✅ Barber: {b['name']} ({'Created' if created else 'Exists'})")

    # 3. Create Store Categories & Products
    cat, _ = Category.objects.get_or_create(name='Styling', defaults={'slug': 'styling'})
    Product.objects.get_or_create(name='Premium Hair Pomade', defaults={
        'category': cat, 'price': 24.99, 'brand': 'BLADE & CROWN', 'stock': 50, 'is_active': True, 'slug': 'premium-pomade'
    })
    print("✅ Products & Categories seeded")

    # 4. Create AI Hairstyles
    # hairstyles = ['Textured Crop', 'Classic Fade', 'Quiff', 'Side Part']
    # for h in hairstyles:
    #     Hairstyle.objects.get_or_create(name=h, defaults={'description': f'Great {h} style', 'suitable_face_shapes': ['oval', 'square']})
    # print("✅ AI Hairstyles seeded")

    print("\n🎉 ALL DATA SEEDED SUCCESSFULLY!")

if __name__ == "__main__":
    seed_data()