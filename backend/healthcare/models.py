from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('citizen', 'Public Citizen'),
        ('asha', 'ASHA Worker'),
        ('doctor', 'Medical Officer / Doctor'),
        ('dho', 'District Health Officer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='citizen')
    phone = models.CharField(max_length=15, blank=True, null=True)
    village_block = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Doctor(models.Model):
    name = models.CharField(max_length=150)
    specialty = models.CharField(max_length=100)
    phc_name = models.CharField(max_length=200)
    experience_years = models.IntegerField(default=0)
    rating = models.FloatField(default=4.5)
    days_available = models.CharField(max_length=100, default="Mon-Fri")
    is_available_today = models.BooleanField(default=True)

    def __str__(self):
        return f"Dr. {self.name} - {self.specialty}"


class Medicine(models.Model):
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=100)
    stock_count = models.IntegerField(default=0)
    min_threshold = models.IntegerField(default=50)
    unit = models.CharField(max_length=20, default='tablets')

    def __str__(self):
        return f"{self.name} ({self.stock_count} {self.unit})"

# Alias for backwards compatibility with older views/serializers
Inventory = Medicine


class Appointment(models.Model):
    patient_name = models.CharField(max_length=150)
    patient_phone = models.CharField(max_length=15)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    appointment_type = models.CharField(max_length=20, choices=[('Physical', 'Physical'), ('Tele', 'Tele-Consultation')])
    date_time = models.DateTimeField()
    status = models.CharField(max_length=20, default='Confirmed')

    def __str__(self):
        return f"{self.patient_name} with {self.doctor.name}"


class SymptomLog(models.Model):
    SEVERITY_CHOICES = [('Low', 'Low'), ('Moderate', 'Moderate'), ('High', 'High'), ('Critical', 'Critical')]
    
    village_name = models.CharField(max_length=100)
    symptom_type = models.CharField(max_length=150)
    affected_count = models.IntegerField(default=1)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    notes = models.TextField(blank=True, null=True)
    logged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'asha'})
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.symptom_type} at {self.village_name} ({self.severity})"


class DoctorAttendance(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    check_in_time = models.TimeField(auto_now_add=True)
    check_out_time = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('Present', 'Present'), ('On Duty', 'On Duty'), ('Absent', 'Absent')])

    def __str__(self):
        return f"{self.doctor.name} - {self.date} ({self.status})"


class Grievance(models.Model):
    PRIORITY_CHOICES = [('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High'), ('Urgent', 'Urgent')]
    STATUS_CHOICES = [('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Resolved', 'Resolved'), ('Escalated', 'Escalated')]

    ticket_id = models.CharField(max_length=20, unique=True)
    citizen_name = models.CharField(max_length=150)
    phc_location = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.ticket_id}] {self.category} - {self.status}"


class AbhaRecord(models.Model):
    abha_number = models.CharField(max_length=20, unique=True)
    abha_address = models.CharField(max_length=50, unique=True)
    aadhaar_last4 = models.CharField(max_length=4)
    patient_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=10)
    dob = models.CharField(max_length=15)
    mobile = models.CharField(max_length=15)
    is_verified = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.patient_name} - {self.abha_number}"