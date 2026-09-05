from rest_framework import serializers
from .models import User, Doctor, Medicine, Appointment, SymptomLog, DoctorAttendance, Grievance, AbhaRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'village_block']

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'

# Backwards compatible alias
InventorySerializer = MedicineSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'

class SymptomLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SymptomLog
        fields = '__all__'

class DoctorAttendanceSerializer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.name')

    class Meta:
        model = DoctorAttendance
        fields = '__all__'

class GrievanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grievance
        fields = '__all__'

class AbhaRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbhaRecord
        fields = '__all__'