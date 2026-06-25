from django.views.generic import TemplateView
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Trainer, Battle
from .serializers import TrainerSerializer, BattleSerializer
from .utils import calculate_damage, execute_battle_turn
import random

class ArenaIndexView(TemplateView):
    template_name = 'battle_arena/index.html'

class TrainerListCreateAPIView(APIView):
    def get(self, request):
        trainers = Trainer.objects.all().order_by('-created_at')
        serializer = TrainerSerializer(trainers, many=True)
        return Response(serializer.data)

    def post(self, request):
        name = request.data.get('name', '').strip()
        if not name:
            return Response({"error": "Trainer name cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Support get or create
        trainer, created = Trainer.objects.get_or_create(name=name)
        serializer = TrainerSerializer(trainer)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

class BattleListCreateAPIView(APIView):
    def get(self, request):
        battles = Battle.objects.all().order_by('-played_at')
        serializer = BattleSerializer(battles, many=True)
        return Response(serializer.data)

    def post(self, request):
        player_id = request.data.get('player')
        player_name = request.data.get('player_name', '').strip()
        opponent = request.data.get('opponent', '').strip()
        result = request.data.get('result', '').strip()

        if not opponent or not result:
            return Response({"error": "Opponent and Result are required fields"}, status=status.HTTP_400_BAD_REQUEST)

        if result not in ['Win', 'Loss']:
            return Response({"error": "Result must be either 'Win' or 'Loss'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Find trainer by ID or name
                if player_id:
                    trainer = Trainer.objects.get(id=player_id)
                elif player_name:
                    trainer, _ = Trainer.objects.get_or_create(name=player_name)
                else:
                    return Response({"error": "Either player ID or player_name must be provided"}, status=status.HTTP_400_BAD_REQUEST)

                # Calculate rewards securely on the backend instead of relying on frontend params
                if result == 'Win':
                    opponent_level = 50
                    if opponent.lower() == 'pikachu':
                        opponent_level = 48
                    
                    if 'opponent_level' in request.data:
                        try:
                            opponent_level = int(request.data['opponent_level'])
                        except ValueError:
                            pass
                    
                    xp_earned = 650 + (opponent_level * 15) + random.randint(0, 99)
                    coins_earned = 100 + (opponent_level * 4) + random.randint(0, 30)
                else:
                    xp_earned = 0
                    coins_earned = 0

                # Log battle outcome
                battle = Battle.objects.create(
                    player=trainer,
                    opponent=opponent,
                    result=result,
                    xp_earned=xp_earned,
                    coins_earned=coins_earned
                )

                # Award trainer rewards
                trainer.xp += xp_earned
                trainer.coins += coins_earned
                
                # Level up logic: 1000 XP per level (level = xp // 1000 + 1)
                new_level = max(1, (trainer.xp // 1000) + 1)
                if new_level > trainer.level:
                    trainer.level = new_level
                
                trainer.save()

                # Serialize response
                battle_serializer = BattleSerializer(battle)
                response_data = battle_serializer.data
                response_data['trainer'] = TrainerSerializer(trainer).data
                
                return Response(response_data, status=status.HTTP_201_CREATED)

        except Trainer.DoesNotExist:
            return Response({"error": f"Trainer with ID {player_id} not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DamageCalculationAPIView(APIView):
    def post(self, request):
        try:
            attacker = request.data.get('attacker', {})
            defender = request.data.get('defender', {})
            move = request.data.get('move', {})
            atk_mult = float(request.data.get('atk_mult', 1.0))
            def_mult = float(request.data.get('def_mult', 1.0))

            attacker_lvl = int(attacker.get('level', 50))
            attacker_atk = int(attacker.get('attack', 50))
            attacker_type = attacker.get('type', 'normal')

            defender_def = int(defender.get('defense', 50))
            defender_type = defender.get('type', 'normal')

            move_power = int(move.get('power', 40))
            move_type = move.get('type', 'normal')
            move_accuracy = float(move.get('accuracy', 1.0))

            res = calculate_damage(
                attacker_lvl=attacker_lvl,
                attacker_atk=attacker_atk,
                defender_def=defender_def,
                attacker_type=attacker_type,
                defender_type=defender_type,
                move_power=move_power,
                move_type=move_type,
                move_accuracy=move_accuracy,
                atk_mult=atk_mult,
                def_mult=def_mult
            )
            return Response(res, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class BattleTurnAPIView(APIView):
    def post(self, request):
        try:
            state = request.data
            res = execute_battle_turn(state)
            if "error" in res:
                return Response(res, status=status.HTTP_400_BAD_REQUEST)
            return Response(res, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

from django.http import FileResponse
from django.conf import settings
import os

def download_project_zip(request):
    zip_path = os.path.join(settings.BASE_DIR, 'pokemon-battle-kingdom.zip')
    if os.path.exists(zip_path):
        return FileResponse(open(zip_path, 'rb'), as_attachment=True, filename='pokemon-battle-kingdom.zip')
    else:
        from django.http import Http404
        raise Http404("ZIP file not found")

