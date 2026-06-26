from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, ProfileView, UserDashboardView, AdminStatsView,
    ForgotPasswordView, VerifyOTPView, ResetPasswordView,
    UserListView, UserDetailView,
    AdminDashboardView, TrainerDashboardView, PlayerDashboardView
)

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('register/', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile', ProfileView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('user/dashboard', UserDashboardView.as_view()),
    path('user/dashboard/', UserDashboardView.as_view()),
    path('admin/stats', AdminStatsView.as_view()),
    path('admin/stats/', AdminStatsView.as_view()),
    
    # Dashboard Endpoints
    path('admin-dashboard', AdminDashboardView.as_view()),
    path('admin-dashboard/', AdminDashboardView.as_view()),
    path('trainer-dashboard', TrainerDashboardView.as_view()),
    path('trainer-dashboard/', TrainerDashboardView.as_view()),
    path('player-dashboard', PlayerDashboardView.as_view()),
    path('player-dashboard/', PlayerDashboardView.as_view()),
    
    # JWT Token Refresh
    path('token/refresh', TokenRefreshView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    
    # User Management Endpoints
    path('users', UserListView.as_view()),
    path('users/', UserListView.as_view()),
    path('users/<int:pk>', UserDetailView.as_view()),
    path('users/<int:pk>/', UserDetailView.as_view()),
    
    # Forgot Password Flow
    path('forgot-password', ForgotPasswordView.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view()),
    path('verify-otp', VerifyOTPView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('reset-password', ResetPasswordView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
]
