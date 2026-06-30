import os

def compile_offline():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path mappings
    html_path = os.path.join(base_dir, 'battle_arena', 'templates', 'battle_arena', 'index.html')
    bootstrap_path = os.path.join(base_dir, 'battle_arena', 'static', 'battle_arena', 'css', 'bootstrap.min.css')
    styles_path = os.path.join(base_dir, 'battle_arena', 'static', 'battle_arena', 'css', 'styles.css')
    audio_path = os.path.join(base_dir, 'battle_arena', 'static', 'battle_arena', 'js', 'audio.js')
    battle_path = os.path.join(base_dir, 'battle_arena', 'static', 'battle_arena', 'js', 'battle.js')
    
    # Read HTML
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Read CSS files
    with open(bootstrap_path, 'r', encoding='utf-8') as f:
        bootstrap = f.read()
    with open(styles_path, 'r', encoding='utf-8') as f:
        styles = f.read()
        
    # Read JS files
    with open(audio_path, 'r', encoding='utf-8') as f:
        audio = f.read()
    with open(battle_path, 'r', encoding='utf-8') as f:
        battle = f.read()
        
    # Mocking Django API references in battle.js to use browser localStorage
    mock_js = """
  fetchTrainers() {
    let trainers = JSON.parse(localStorage.getItem('pokemon_trainers') || '[]');
    if (trainers.length === 0) {
      trainers = [{ id: 1, name: 'Ash Ketchum', level: 5, xp: 4500, coins: 850, created_at: new Date().toISOString() }];
      localStorage.setItem('pokemon_trainers', JSON.stringify(trainers));
    }
    this.trainersList = trainers;
    const select = document.getElementById('trainer-profile-select');
    select.innerHTML = '<option value="">-- Create New Trainer Profile --</option>';
    trainers.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.name} (Lv. ${t.level})`;
      select.appendChild(opt);
    });
    if (this.trainerId) {
      select.value = this.trainerId;
    }
  }

  fetchBattleHistory() {
    let battles = JSON.parse(localStorage.getItem('pokemon_battles') || '[]');
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    if (battles.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No battles logged yet.</td></tr>';
      return;
    }
    battles.slice().reverse().slice(0, 10).forEach(b => {
      const tr = document.createElement('tr');
      const resultBadge = b.result === 'Win' ? '<span class="badge-result win">Victory</span>' : '<span class="badge-result loss">Defeat</span>';
      const rewardsText = b.result === 'Win' ? `+${b.xp_earned} XP, +${b.coins_earned} C` : '0 XP';
      tr.innerHTML = `
        <td class="fw-bold">${b.player_name}</td>
        <td class="text-info">${b.opponent}</td>
        <td>${resultBadge}</td>
        <td class="text-warning">${rewardsText}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  postBattleResult(resultStr, xpEarned, coinsEarned) {
    let trainers = JSON.parse(localStorage.getItem('pokemon_trainers') || '[]');
    let activeTrainer = null;

    if (this.trainerId) {
      activeTrainer = trainers.find(t => t.id == this.trainerId);
    } else {
      activeTrainer = trainers.find(t => t.name.toLowerCase() === this.trainerName.toLowerCase());
      if (!activeTrainer) {
        activeTrainer = {
          id: Date.now(),
          name: this.trainerName,
          level: 1,
          xp: 0,
          coins: 0,
          created_at: new Date().toISOString()
        };
        trainers.push(activeTrainer);
      }
    }

    if (activeTrainer) {
      activeTrainer.xp += xpEarned;
      activeTrainer.coins += coinsEarned;
      
      const newLevel = Math.max(1, Math.floor(activeTrainer.xp / 1000) + 1);
      if (newLevel > activeTrainer.level) {
        activeTrainer.level = newLevel;
      }
      this.trainerId = activeTrainer.id;
      this.trainerLevel = activeTrainer.level;
      
      // Update UI level badge
      document.getElementById('reward-level').textContent = `Lv. ${activeTrainer.level}`;
      const lvlAlert = document.getElementById('levelup-alert');
      if (newLevel > activeTrainer.level) {
        lvlAlert.style.display = 'flex';
      }
    }

    localStorage.setItem('pokemon_trainers', JSON.stringify(trainers));

    let battles = JSON.parse(localStorage.getItem('pokemon_battles') || '[]');
    battles.push({
      id: Date.now(),
      player_name: activeTrainer ? activeTrainer.name : this.trainerName,
      opponent: this.enemyPoke.name,
      result: resultStr,
      xp_earned: xpEarned,
      coins_earned: coinsEarned,
      played_at: new Date().toISOString()
    });
    localStorage.setItem('pokemon_battles', JSON.stringify(battles));

    this.fetchBattleHistory();
    this.fetchTrainers();
  }
"""

    # Injecting local storage trainer creation logic on game start
    mock_start = """
    // Choose opponent Pokémon
    if (!this.trainerId) {
      let trainers = JSON.parse(localStorage.getItem('pokemon_trainers') || '[]');
      let existing = trainers.find(t => t.name.toLowerCase() === this.trainerName.toLowerCase());
      if (existing) {
        this.trainerId = existing.id;
        this.trainerLevel = existing.level;
      } else {
        let newTrainer = {
          id: Date.now(),
          name: this.trainerName,
          level: 1,
          xp: 0,
          coins: 0,
          created_at: new Date().toISOString()
        };
        trainers.push(newTrainer);
        localStorage.setItem('pokemon_trainers', JSON.stringify(trainers));
        this.trainerId = newTrainer.id;
        this.trainerLevel = newTrainer.level;
      }
    }
    let availableEnemies = POKEMON_DB.filter(p => p.id !== this.playerPoke.id);
"""

    # Perform JS mocks replacements
    # 1. Replace fetchTrainers, fetchBattleHistory and postBattleResult
    # Find start and end of these functions to replace them cleanly
    import re
    
    # We replace the REST call versions of these three methods with our local storage versions
    battle = re.sub(r'fetchTrainers\(\)\s*\{.*?\}\s*fetchBattleHistory\(\)\s*\{.*?\}\s*renderSetupSquad\(\)', 'renderSetupSquad()', battle, flags=re.DOTALL)
    battle = re.sub(r'postBattleResult\(resultStr, xpEarned, coinsEarned\)\s*\{.*?\}\s*resetToSelection\(\)', 'resetToSelection()', battle, flags=re.DOTALL)
    
    # Append the mocked functions at the bottom of the BattleArena class or right before ResetToSelection
    battle = battle.replace('resetToSelection()', mock_js + '\n  resetToSelection()')
    
    # Replace the start transition to auto-create trainers offline
    battle = battle.replace('// Choose opponent Pokémon\r\n    let availableEnemies = POKEMON_DB.filter(p => p.id !== this.playerPoke.id);', mock_start)
    battle = battle.replace('// Choose opponent Pokémon\n    let availableEnemies = POKEMON_DB.filter(p => p.id !== this.playerPoke.id);', mock_start)
    
    # Assemble styles and scripts
    styles_combined = f"<style>\n{bootstrap}\n{styles}\n</style>"
    scripts_combined = f"<script>\n{audio}\n{battle}\n</script>"
    
    # Clean HTML django template tags
    html = html.replace('{% load static %}', '')
    
    # Replace stylesheets
    html = re.sub(r'<link[^>]*bootstrap\.min\.css[^>]*>', styles_combined, html)
    html = re.sub(r'<link[^>]*styles\.css[^>]*>', '', html) # remove main styles since bundled above
    
    # Replace script references
    html = re.sub(r'<script[^>]*audio\.js[^>]*>\s*</script>', scripts_combined, html)
    html = re.sub(r'<script[^>]*battle\.js[^>]*>\s*</script>', '', html)
    
    # Remove ZIP download button since this IS the offline file itself
    html = re.sub(r'<div class="mt-3 text-center">\s*<a href="/download-zip/"[^>]*>.*?</a>\s*</div>', '', html, flags=re.DOTALL)
    
    # Write standalone HTML file
    desktop_dest = os.path.join('c:\\', 'Users', 'HP', 'OneDrive', 'Desktop', 'Play_Pokemon.html')
    with open(desktop_dest, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print(f"Successfully compiled standalone offline game: {desktop_dest}")

if __name__ == '__main__':
    compile_offline()
