from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DoctorViewSet, MedicineViewSet, InventoryViewSet, AppointmentViewSet,
    SymptomLogViewSet, DoctorAttendanceViewSet, GrievanceViewSet, 
    AbhaRecordViewSet, health_check
)

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'inventory', InventoryViewSet, basename='inventory')
router.register(r'medicines', MedicineViewSet, basename='medicine')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'symptoms', SymptomLogViewSet, basename='symptom')
router.register(r'attendance', DoctorAttendanceViewSet, basename='attendance')
router.register(r'grievances', GrievanceViewSet, basename='grievance')
router.register(r'abha', AbhaRecordViewSet, basename='abha')

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('', include(router.urls)),
]