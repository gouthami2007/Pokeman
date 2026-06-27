from django.urls import path
from .views import (
    ArenaIndexView,
    TrainerListCreateAPIView,
    BattleListCreateAPIView,
    DamageCalculationAPIView,
    BattleTurnAPIView,
    download_project_zip
)

urlpatterns = [
    path('', ArenaIndexView.as_view(), name='index'),
    path('api/trainers/', TrainerListCreateAPIView.as_view(), name='trainer-api'),
    path('api/battles/', BattleListCreateAPIView.as_view(), name='battle-api'),
    path('api/battle/damage/', DamageCalculationAPIView.as_view(), name='damage-api'),
    path('api/battle/turn/', BattleTurnAPIView.as_view(), name='turn-api'),
    path('download-zip/', download_project_zip, name='download-zip'),
]
