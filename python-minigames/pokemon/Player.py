class Player:
    pokeList = []
    bag = []
    currentPokeSelected = None
    def __init__(self, playerName):
        self.playerName = playerName

    def addPoke(self, poketoadd):
        self.pokeList.append(poketoadd)

    def showAllPokes(self):
        for poke in self.pokeList:
            print(poke.name)
        
    def selectPoke(self):
        count = 1
        for poke in self.pokeList:
            print (str(count),poke.name)
            count += 1
        selectedIndex = input("Choose pokemon to set: ")
        if int(selectedIndex) <= int(len(self.pokeList)):
            self.currentPokeSelected = self.pokeList[int(selectedIndex)]
            print("You have now " + self.currentPokeSelected.name + " as your selected pokemon")