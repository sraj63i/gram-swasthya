from django.core.management.base import BaseCommand
from healthcare.models import Doctor, Inventory, SymptomLog

class Command(BaseCommand):
    help = 'Seeds initial sample data for PHCs, Doctors, and Inventory'

    def handle(self, *args, **options):
        # Clear existing entries
        Doctor.objects.all().delete()
        Inventory.objects.all().delete()
        SymptomLog.objects.all().delete()

        # Seed Doctors
        phcs = ["PHC Rampur", "PHC Sundarpur", "PHC Kheda", "PHC Birpur", "PHC Anandnagar"]
        for i, phc in enumerate(phcs, start=1):
            Doctor.objects.create(
                name=f"Doctor {i}A", phc_name=phc, latitude=28.6139 + (i * 0.01), longitude=77.2090 + (i * 0.01), is_available=True
            )
            Doctor.objects.create(
                name=f"Doctor {i}B", phc_name=phc, latitude=28.6139 + (i * 0.01), longitude=77.2090 + (i * 0.01), is_available=(i % 2 == 0)
            )

        # Seed Inventory
        medicines = ["Paracetamol 500mg", "Amoxicillin", "ORS Packets", "Cetirizine", "Ibuprofen"]
        for i, med in enumerate(medicines):
            Inventory.objects.create(
                medicine_name=med, stock_count=5 + (i * 2), min_threshold=20, phc_name=phcs[i % len(phcs)]
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with PHC data.'))