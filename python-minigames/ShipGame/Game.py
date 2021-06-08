from Board import Board
from Utilities import clearConsole

class Game:
    turnCount = 0
    def __init__(self, p1board, p2board, turn, p2BoardOfP1, p1BoardOfP2):

        self.p1board = p1board
        self.p2board = p2board
        self.turn = turn #turn is 1 or 2
        self.p2BoardOfP1 = p2BoardOfP1
        self.p1BoardOfP2 = p1BoardOfP2 
        #this means player 1 board from the players 2 perspective

    

    def changeTurn(self):
        self.turnCount += 1
        print(" Turn count",self.turnCount)
        if self.turn == 1:
            self.turn = 2
        elif self.turn == 2:
            self.turn = 1
        print("\n Its player",self.turn,"turn \n\n")

    #RETURNING TUPLE OF ALL THINGS OF THE ACTIVE PLAYER
    def getCurrentActivePlayer(self):
        if self.turn == 1:
            return (self.p1board,self.p1BoardOfP2,self.p2board)
        else:
            return (self.p2board,self.p2BoardOfP1,self.p1board)
    
    def startGame(self):
        gameover = False
        clearConsole()
        
        while gameover == False:

            self.changeTurn()
            board, versionOfOtherBoard, otherPlayerBoard = self.getCurrentActivePlayer()
            print("     Your area \n")
            board.show()
            print("\n Your Oponents Area(Your hits) \n")
            versionOfOtherBoard.show()
            isCorrect = False 
            tile = None
            while isCorrect == False:
                play = input("Choose coordenate to hit: ")
                tile = otherPlayerBoard.getTileAt(play)
                tileForMarking = versionOfOtherBoard.getTileAt(play)
                if tile != None:
                    isCorrect = True
                    break
                print("Thats not a valid coordenate")

            clearConsole()
            hit = tile.getHit()
            #check what happened with my hit
            if(hit == "ad"):
                print ("Already destroyed")
            elif(hit == "d"):
                tileForMarking.setValue("d")
                print ("Ship Destroyed")
                gameover = otherPlayerBoard.looseShip()
            elif(hit == "y"):
                print ("You hit here already, try again.")
            elif(hit == "n"):
                tileForMarking.setValue("y")
                print ("Hit water")
        
        clearConsole()
        print("\n\n\n\n\n\n\n    (((o(*°▽°*)o)))           Player",self.turn,"Won!!!          o(>ω<)o")
        print("\n\n\n\n\n\n\n                                  GAMEOVER\n\n\n\n\n\n\n\n\n")
            

