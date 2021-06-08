from Board import Board
from ExtraData import getAlpha
from Utilities import clearConsole


def processShip(board):
        ship = input("Coords: ")
        tile = board.getTileAt(ship)
        if(tile != None):
            if(tile.setShip()):
                board.show()  
                return True
            else:
                print("That ship already exists")
                return False
        else:
            print("That coordenate is wrong")
            return False

def setPlayerBoard(amount,p1b,p2b):
    options = ""
    for n in range(8):
        for a in range(8):
            options = options + getAlpha()[n] + str(a) + "  "

    for player in range(2):
        clearConsole()
        print("\nPlayer", int(player+1),"is setting his ships\n")
        for ship in range(amount):
            
            print ('Choose a coordenate with a letter and a number like so "a1" from the next options:')
            print(options)
            
            shipDone = False   
            if(int(player+1) == 1):
                while shipDone == False:
                    shipDone = processShip(p1b)
            elif(int(player+1) == 2):
                while shipDone == False:
                    shipDone = processShip(p2b)


    