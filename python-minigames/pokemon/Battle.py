from Utilities import clearConsole
from Utilities import OptionArray

class Battle:
    def __init__(self,player,enemy):
        self.player = player
        self.enemy = enemy
        clearConsole()
        print("starting battle")

    

    def setupPokes(self,theplayer):
        poke = theplayer.currentPokeSelected
        hpstring = ''
        for i in range(poke.hp):
            hpstring = hpstring + "*"
        print(theplayer.playerName +"'s pokemon")
        print("HP: ",hpstring)
        print(poke.name)
        print("\n")

    def showOptions(self,optArr):
        print("\n")
        print("Choose an option")
        c = 1
        for opt in optArr:
            print(str(c),opt)
            c += 1
        option = '5'
        while int(option) > 4 and option != None:
            option = int(input(":: "))
            
        if(int(option) == 1):
            self.showAttackOptions(self.player.currentPokeSelected.attacks)
        elif(int(option) == 2):
            for poke in self.player.pokeList:
                print(poke)
        elif(int(option) == 3):
            print("opt3")
        elif(int(option) == 4):
            print("opt4")


    def showAttackOptions(self, attArr):
        print("\n")
        print("Choose an option")
        c = 1
        for att in attArr:
            print(str(c),att)
            c += 1
        option = '5'
        while int(option) > 4 and option != '' and option != None:
            option = int(input(":: "))
            
        clearConsole()

        if(int(option) == 1):
            self.enemy.currentPokeSelected.getHit(attArr[0][1])
            self.printLog(self.player,self.player.currentPokeSelected,attArr[0][0])
        elif(int(option) == 2):
            self.enemy.currentPokeSelected.getHit(attArr[1][1])
            self.printLog(self.player,self.player.currentPokeSelected,attArr[1][0])
        elif(int(option) == 3):
            self.enemy.currentPokeSelected.getHit(attArr[2][1])
            self.printLog(self.player,self.player.currentPokeSelected,attArr[2][0])
        elif(int(option) == 4):
            self.enemy.currentPokeSelected.getHit(attArr[3][1])
            self.printLog(self.player,self.player.currentPokeSelected,attArr[3][0])

        self.drawBattle()

    def printLog(self,playerWhoAttacked,pokeWhoAttacked,Att):
        print(playerWhoAttacked.playerName+"'s",pokeWhoAttacked.name,"attacked with",Att)

    def drawBattle(self):
        
        print("\n")

        res = all(p.isAlive for p in self.enemy.pokeList)
        if(not res):
            print("You Win")
            return
        res = all(p.isAlive for p in self.player.pokeList)
        if(not res):
            print("You Lost")
            return
            
        self.setupPokes(self.player)
        self.setupPokes(self.enemy)
        self.showOptions(OptionArray())
        
        