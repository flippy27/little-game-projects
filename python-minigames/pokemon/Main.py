from Player import Player
from Pokemon import Pokemon
from Battle import Battle
from Attacks import Attacks

player = Player("Flippy")


poke1 = Pokemon("bbb")
poke1.setAttack(Attacks()[0])
poke1.setAttack(Attacks()[1])
poke1.setAttack(Attacks()[2])

player.addPoke(poke1)

enemy = Player("Enemy")
enemy.pokeList = []
enemyPoke = Pokemon("aaa")
enemy.addPoke(enemyPoke)

player.currentPokeSelected = player.pokeList[0]
enemy.currentPokeSelected = enemy.pokeList[0]


battle = Battle(player,enemy)
battle.drawBattle()
