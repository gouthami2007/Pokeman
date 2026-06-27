from django.contrib import admin
from .models import Trainer, Battle

@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'level', 'xp', 'coins', 'created_at')
    search_fields = ('name',)

@admin.register(Battle)
class BattleAdmin(admin.ModelAdmin):
    list_display = ('id', 'player', 'opponent', 'result', 'xp_earned', 'coins_earned', 'played_at')
    list_filter = ('result', 'played_at')
    search_fields = ('player__name', 'opponent')
