from Tile import Tile
from ExtraData import getAlpha
import random

class Board:
    shipAmount = 0
    def __init__(self,arr):
        self.arr = arr
        
    def make(self):
        alpha = getAlpha()
        for a in range(8):
            for b in range(8):
                tempTile = Tile(alpha[a], b, "n")
                self.arr.append(tempTile)

    def show(self):
        board = ""
        counter = 0
        alphaCounter = 0
        alpha = getAlpha()
        for item in self.arr:
            if(counter == 0):
                board = board + alpha [alphaCounter] + ": "
                alphaCounter += 1
            board = board + item.status + " "
            counter += 1
            if(counter == 8):
                counter = 0
                board = board + "\n"
        """ for b in range(19):
            board = board + " " """
        board = board + "\n"
        board = board + "   "
        for a in range(8):
            board = board +str(a) + " " 
        print(board)
    
    def setHitRandomTiles(self,amount):
        for i in range(amount):
            random.choice(self.arr).getHit()

    def showAllItems(self):
        for item in self.arr:
            print(item.getCoord() + " " + item.status)

    def getTileAt(self,coord):
        for tile in self.arr:
            if tile.getCoord().lower() == coord.lower():
                return tile
        return None
     
    def looseShip(self):
        self.shipAmount -= 1
        if(self.shipAmount == 0):
            return True
        return False
            
