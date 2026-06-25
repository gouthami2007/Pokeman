from django.db import models

class Trainer(models.Model):
    name = models.CharField(max_length=100, unique=True)
    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Lv. {self.level})"

class Battle(models.Model):
    RESULT_CHOICES = (
        ('Win', 'Win'),
        ('Loss', 'Loss'),
    )
    player = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name='battles')
    opponent = models.CharField(max_length=100)
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    xp_earned = models.IntegerField(default=0)
    coins_earned = models.IntegerField(default=0)
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player.name} vs {self.opponent} - {self.result}"
