import random

TYPE_CHART = {
    'normal': {'normal': 1.0, 'fire': 1.0, 'water': 1.0, 'grass': 1.0, 'electric': 1.0},
    'fire': {'normal': 1.0, 'fire': 0.5, 'water': 0.5, 'grass': 2.0, 'electric': 1.0},
    'water': {'normal': 1.0, 'fire': 2.0, 'water': 0.5, 'grass': 0.5, 'electric': 1.0},
    'grass': {'normal': 1.0, 'fire': 0.5, 'water': 2.0, 'grass': 0.5, 'electric': 1.0},
    'electric': {'normal': 1.0, 'fire': 1.0, 'water': 2.0, 'grass': 0.5, 'electric': 0.5}
}

def calculate_damage(attacker_lvl, attacker_atk, defender_def, attacker_type, defender_type, move_power, move_type, move_accuracy, atk_mult=1.0, def_mult=1.0):
    """
    Calculates damage and other attributes based on attacker/defender stats and moves.
    """
    level = attacker_lvl or 50
    attack = attacker_atk * atk_mult
    defense = defender_def * def_mult
    power = move_power

    if defense <= 0:
        defense = 1

    # Base damage calculation
    damage = int(((2 * level / 5 + 2) * power * (attack / defense)) / 50 + 2)

    # Type matchup multiplier
    attacker_element_type = move_type or attacker_type
    multiplier = TYPE_CHART.get(attacker_element_type, {}).get(defender_type, 1.0)

    is_super_effective = multiplier > 1.0
    is_not_effective = multiplier < 1.0
    damage = int(damage * multiplier)

    # Critical hit chance (12% chance, 1.8x multiplier)
    is_critical = random.random() < 0.12
    if is_critical:
        damage = int(damage * 1.8)

    # Miss chance
    miss_chance = 1 - move_accuracy
    is_miss = random.random() < miss_chance
    if is_miss:
        damage = 0

    return {
        "damage": damage,
        "is_critical": is_critical,
        "is_super_effective": is_super_effective,
        "is_not_effective": is_not_effective,
        "is_miss": is_miss
    }

def execute_battle_turn(state):
    """
    Executes a turn of Pokémon battle statelessly on the backend.
    
    Expected state fields:
      - player_poke (dict with maxHp, attack, defense, type, moves, name, etc.)
      - enemy_poke (dict with maxHp, attack, defense, type, moves, name, etc.)
      - player_hp (int)
      - enemy_hp (int)
      - player_energy (int)
      - player_atk_mult (float)
      - player_def_mult (float)
      - enemy_atk_mult (float)
      - enemy_def_mult (float)
      - action_type (str: 'move', 'rest', 'run')
      - move_key (str, required if action_type == 'move')
    """
    player_poke = state['player_poke']
    enemy_poke = state['enemy_poke']
    
    player_hp = int(state.get('player_hp', player_poke['maxHp']))
    enemy_hp = int(state.get('enemy_hp', enemy_poke['maxHp']))
    player_energy = int(state.get('player_energy', 24))
    
    player_atk_mult = float(state.get('player_atk_mult', 1.0))
    player_def_mult = float(state.get('player_def_mult', 1.0))
    enemy_atk_mult = float(state.get('enemy_atk_mult', 1.0))
    enemy_def_mult = float(state.get('enemy_def_mult', 1.0))
    
    action_type = state.get('action_type', 'move')
    move_key = state.get('move_key')
    
    player_action_res = {}
    enemy_action_res = {}
    battle_over = False
    winner = None

    # --- 1. Player Action Phase ---
    if action_type == 'run':
        player_action_res = {
            'action_type': 'run',
            'description': 'You fled from the battle!'
        }
        battle_over = True
        winner = 'enemy'
    elif action_type == 'rest':
        # Rest: heals +50 HP, fully restores energy to max (24)
        old_hp = player_hp
        player_hp = min(player_poke['maxHp'], player_hp + 50)
        player_energy = 24
        heal_amt = player_hp - old_hp
        player_action_res = {
            'action_type': 'rest',
            'heal': heal_amt,
            'description': f"{player_poke['name']} rested, recovering {heal_amt} HP and recharging energy!"
        }
    elif action_type == 'move':
        # Find player move
        move = next((m for m in player_poke['moves'] if m['key'] == move_key), None)
        if not move:
            return {"error": f"Player move '{move_key}' not found"}
        
        # Verify energy
        if player_energy < move['energyCost']:
            return {"error": "Not enough energy"}
        
        # Deduct energy
        player_energy = max(0, player_energy - move['energyCost'])
        
        if move['category'] == 'heal':
            old_hp = player_hp
            player_hp = min(player_poke['maxHp'], player_hp + move['amt'])
            heal_amt = player_hp - old_hp
            player_action_res = {
                'action_type': 'move',
                'move_name': move['name'],
                'heal': heal_amt,
                'description': f"{player_poke['name']} used {move['name']} and recovered {heal_amt} HP!"
            }
        elif move['category'] == 'buff':
            if move['stat'] == 'atk':
                player_atk_mult = move['mult']
                stat_desc = "Attack rose sharply!"
            else:
                player_def_mult = move['mult']
                stat_desc = "Defense rose sharply!"
            
            player_action_res = {
                'action_type': 'move',
                'move_name': move['name'],
                'description': f"{player_poke['name']} used {move['name']}. {stat_desc}"
            }
        else:
            # Attack move
            dmg_res = calculate_damage(
                attacker_lvl=player_poke.get('level', 50),
                attacker_atk=player_poke['attack'],
                defender_def=enemy_poke['defense'],
                attacker_type=player_poke['type'],
                defender_type=enemy_poke['type'],
                move_power=move['power'],
                move_type=move['type'],
                move_accuracy=move['accuracy'],
                atk_mult=player_atk_mult,
                def_mult=enemy_def_mult
            )
            enemy_hp = max(0, enemy_hp - dmg_res['damage'])
            
            player_action_res = {
                'action_type': 'move',
                'move_name': move['name'],
                'damage': dmg_res['damage'],
                'is_critical': dmg_res['is_critical'],
                'is_super_effective': dmg_res['is_super_effective'],
                'is_not_effective': dmg_res['is_not_effective'],
                'is_miss': dmg_res['is_miss'],
                'description': f"{player_poke['name']} used {move['name']}! Dealt {dmg_res['damage']} damage."
            }
            if dmg_res['is_miss']:
                player_action_res['description'] = f"{player_poke['name']} used {move['name']} but it MISSED!"
            elif dmg_res['is_critical']:
                player_action_res['description'] += " Critical Hit!"
            
            if enemy_hp <= 0:
                battle_over = True
                winner = 'player'

    # --- 2. Enemy Action Phase ---
    if not battle_over and enemy_hp > 0:
        # Enemy selects a random move
        moves = enemy_poke['moves']
        # Filter moves by energy cost (AI does not cost energy in client, but let's keep it simple and select any move)
        move = random.choice(moves)
        
        if move['category'] == 'heal':
            old_hp = enemy_hp
            enemy_hp = min(enemy_poke['maxHp'], enemy_hp + move['amt'])
            heal_amt = enemy_hp - old_hp
            enemy_action_res = {
                'action_type': 'move',
                'move_name': move['name'],
                'heal': heal_amt,
                'description': f"Wild {enemy_poke['name']} used {move['name']} and recovered {heal_amt} HP!"
            }
        elif move['category'] == 'buff':
            if move['stat'] == 'atk':
                enemy_atk_mult = move['mult']
                stat_desc = "Attack rose sharply!"
            else:
                enemy_def_mult = move['mult']
                stat_desc = "Defense rose sharply!"
            
            enemy_action_res = {
                'action_type': 'move',
                'move_name': move['name'],
                'description': f"Wild {enemy_poke['name']} used {move['name']}. {stat_desc}"
            }
        else:
            dmg_res = calculate_damage(
                attacker_lvl=enemy_poke.get('level', 50),
                attacker_atk=enemy_poke['attack'],
                defender_def=player_poke['defense'],
                attacker_type=enemy_poke['type'],
                defender_type=player_poke['type'],
                move_power=move['power'],
                move_type=move['type'],
                move_accuracy=move['accuracy'],
                atk_mult=enemy_atk_mult,
                def_mult=player_def_mult
            )
            player_hp = max(0, player_hp - dmg_res['damage'])
            
            enemy_action_res = {
                'action_type': 'move',
                'move_name': move['name'],
                'damage': dmg_res['damage'],
                'is_critical': dmg_res['is_critical'],
                'is_super_effective': dmg_res['is_super_effective'],
                'is_not_effective': dmg_res['is_not_effective'],
                'is_miss': dmg_res['is_miss'],
                'description': f"Wild {enemy_poke['name']} used {move['name']}! Dealt {dmg_res['damage']} damage."
            }
            if dmg_res['is_miss']:
                enemy_action_res['description'] = f"Wild {enemy_poke['name']} used {move['name']} but it MISSED!"
            elif dmg_res['is_critical']:
                enemy_action_res['description'] += " Critical Hit!"
            
            if player_hp <= 0:
                battle_over = True
                winner = 'enemy'

    # --- 3. End of Turn Phase ---
    if not battle_over:
        # Regenerate +3 energy
        player_energy = min(24, player_energy + 3)
    
    return {
        "player_action": player_action_res,
        "enemy_action": enemy_action_res,
        "updated_player_hp": player_hp,
        "updated_enemy_hp": enemy_hp,
        "updated_player_energy": player_energy,
        "updated_player_atk_mult": player_atk_mult,
        "updated_player_def_mult": player_def_mult,
        "updated_enemy_atk_mult": enemy_atk_mult,
        "updated_enemy_def_mult": enemy_def_mult,
        "battle_over": battle_over,
        "winner": winner
    }
