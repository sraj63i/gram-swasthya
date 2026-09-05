from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Doctor, Medicine, Appointment, SymptomLog, DoctorAttendance, Grievance, AbhaRecord
from .serializers import (
    DoctorSerializer, MedicineSerializer, AppointmentSerializer, 
    SymptomLogSerializer, DoctorAttendanceSerializer, GrievanceSerializer, AbhaRecordSerializer
)

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy", "service": "Gram Swasthya Django API"})

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

# Backwards compatible alias for old InventoryViewSet
InventoryViewSet = MedicineViewSet

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class SymptomLogViewSet(viewsets.ModelViewSet):
    queryset = SymptomLog.objects.all().order_by('-created_at')
    serializer_class = SymptomLogSerializer

class DoctorAttendanceViewSet(viewsets.ModelViewSet):
    queryset = DoctorAttendance.objects.all()
    serializer_class = DoctorAttendanceSerializer

class GrievanceViewSet(viewsets.ModelViewSet):
    queryset = Grievance.objects.all().order_by('-created_at')
    serializer_class = GrievanceSerializer

class AbhaRecordViewSet(viewsets.ModelViewSet):
    queryset = AbhaRecord.objects.all()
    serializer_class = AbhaRecordSerializer
