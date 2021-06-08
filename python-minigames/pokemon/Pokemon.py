class Pokemon:
    level = 1
    currentXP = 0
    xpForNextLevel = 1
    hp = 10
    attacks = []
    isAlive = True
    def __init__(self,name):
        self.name = name

    def setAttack(self,attack):
        self.attacks.append(attack)

    def showAttacks(self):
        c = 1
        for att in self.attacks:
            name,dmg = att
            print(int(c),name,int(dmg))
            c += 1

    def getHit(self, dmg):
        self.hp -= dmg
        if(self.hp <= 0):
            self.changeStatus()
            print("this pokemon is pokeDead")
    
    def changeStatus(self):
        self.isAlive = not self.isAlive