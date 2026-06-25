from rest_framework import serializers
from .models import Trainer, Battle

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = ['id', 'name', 'level', 'xp', 'coins', 'created_at']

class BattleSerializer(serializers.ModelSerializer):
    player_name = serializers.ReadOnlyField(source='player.name')

    class Meta:
        model = Battle
        fields = ['id', 'player', 'player_name', 'opponent', 'result', 'xp_earned', 'coins_earned', 'played_at']
