from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Trainer, Battle

class BattleArenaAPITests(APITestCase):
    def setUp(self):
        # Create a sample Trainer
        self.trainer = Trainer.objects.create(name="Ash", level=1, xp=100, coins=50)
        self.trainer_api_url = reverse('trainer-api')
        self.battle_api_url = reverse('battle-api')

    def test_get_trainers(self):
        """Test retrieving all trainer profiles."""
        response = self.client.get(self.trainer_api_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Ash")

    def test_create_trainer(self):
        """Test creating a new trainer profile."""
        data = {"name": "Red"}
        response = self.client.post(self.trainer_api_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Trainer.objects.count(), 2)
        self.assertEqual(Trainer.objects.get(name="Red").level, 1)

    def test_get_or_create_existing_trainer(self):
        """Test that posting an existing trainer name returns the profile instead of duplicating it."""
        data = {"name": "Ash"}
        response = self.client.post(self.trainer_api_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Trainer.objects.count(), 1)

    def test_get_battle_history(self):
        """Test retrieving logged battles list."""
        # Create a sample battle
        Battle.objects.create(player=self.trainer, opponent="Charizard", result="Win", xp_earned=500, coins_earned=100)
        response = self.client.get(self.battle_api_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['opponent'], "Charizard")

    def test_post_battle_victory_rewards(self):
        """Test that winning a battle logs the result and awards XP and Coins to the trainer."""
        data = {
            "player": self.trainer.id,
            "opponent": "Venusaur",
            "result": "Win",
            "xp_earned": 950,
            "coins_earned": 150
        }
        response = self.client.post(self.battle_api_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify battle was logged
        self.assertEqual(Battle.objects.count(), 1)
        battle = Battle.objects.first()
        self.assertEqual(battle.opponent, "Venusaur")
        self.assertEqual(battle.result, "Win")

        # Verify Trainer was updated securely on the backend
        self.trainer.refresh_from_db()
        self.assertTrue(1500 <= self.trainer.xp <= 1600)
        self.assertTrue(350 <= self.trainer.coins <= 380)
        self.assertEqual(self.trainer.level, 2)
        
        # Verify trainer statistics returned in response
        self.assertEqual(response.data['trainer']['level'], 2)
        self.assertEqual(response.data['trainer']['xp'], self.trainer.xp)

    def test_post_battle_loss_no_rewards(self):
        """Test that losing a battle logs the result but awards 0 XP/Coins."""
        data = {
            "player": self.trainer.id,
            "opponent": "Blastoise",
            "result": "Loss",
            "xp_earned": 0,
            "coins_earned": 0
        }
        response = self.client.post(self.battle_api_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.trainer.refresh_from_db()
        self.assertEqual(self.trainer.xp, 100) # unchanged
        self.assertEqual(self.trainer.coins, 50) # unchanged
        self.assertEqual(self.trainer.level, 1) # unchanged

    def test_damage_calculation_api(self):
        """Test Damage Calculation API."""
        url = reverse('damage-api')
        data = {
            "attacker": {"level": 50, "attack": 85, "type": "fire"},
            "defender": {"defense": 68, "type": "grass"},
            "move": {"power": 65, "accuracy": 0.85, "type": "fire"},
            "atk_mult": 1.0,
            "def_mult": 1.0
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("damage", response.data)
        self.assertIn("is_critical", response.data)
        self.assertIn("is_miss", response.data)

    def test_battle_turn_api(self):
        """Test Battle Turn Logic API."""
        url = reverse('turn-api')
        data = {
            "player_poke": {
                "name": "Charizard",
                "type": "fire",
                "maxHp": 177,
                "attack": 85,
                "defense": 68,
                "moves": [
                    {"key": "tackle", "name": "Slash", "type": "normal", "power": 35, "accuracy": 0.95, "category": "attack", "energyCost": 0},
                    {"key": "fireblast", "name": "Fire Blast", "type": "fire", "power": 65, "accuracy": 0.85, "category": "attack", "energyCost": 8}
                ]
            },
            "enemy_poke": {
                "name": "Blastoise",
                "type": "water",
                "maxHp": 184,
                "attack": 74,
                "defense": 88,
                "moves": [
                    {"key": "tackle", "name": "Bite", "type": "normal", "power": 35, "accuracy": 0.95, "category": "attack", "energyCost": 0}
                ]
            },
            "player_hp": 177,
            "enemy_hp": 184,
            "player_energy": 24,
            "player_atk_mult": 1.0,
            "player_def_mult": 1.0,
            "enemy_atk_mult": 1.0,
            "enemy_def_mult": 1.0,
            "action_type": "move",
            "move_key": "tackle"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("player_action", response.data)
        self.assertIn("enemy_action", response.data)
        self.assertIn("updated_player_hp", response.data)
        self.assertIn("updated_enemy_hp", response.data)

    def test_secure_battle_rewards(self):
        """Test that rewards are calculated securely on the backend even if frontend tries to pass arbitrary values."""
        data = {
            "player": self.trainer.id,
            "opponent": "Blastoise",
            "result": "Win",
            "xp_earned": 99999,  # Malicious frontend value
            "coins_earned": 99999,  # Malicious frontend value
            "opponent_level": 50
        }
        response = self.client.post(self.battle_api_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Assert that actual saved rewards are secure (Win reward at level 50 should be ~650 + 750 + rand = ~1400-1500, definitely not 99999)
        self.assertNotEqual(response.data['xp_earned'], 99999)
        self.assertNotEqual(response.data['coins_earned'], 99999)
        self.assertTrue(1400 <= response.data['xp_earned'] <= 1600)
        self.assertTrue(300 <= response.data['coins_earned'] <= 350)

