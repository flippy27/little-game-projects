from Board import Board
from Game import Game
#hardcoded for now
from ExtraData import p1Ships
from ExtraData import p2Ships
from PlayerBoardSet import setPlayerBoard

p1arr = []
p2arr = []
p1for2arr = []
p2for1arr = []
p1Board = Board(p1arr)
p1Board.make()

p2Board = Board(p2arr)
p2Board.make()

p1BoardOfP2 = Board(p1for2arr)
p1BoardOfP2.make()
p2BoardOfP1 = Board(p2for1arr)
p2BoardOfP1.make()

#initialize some ships
isDev = False
if(isDev):
    for coord in p1Ships():
        tile = p1Board.getTileAt(coord)
        tile.setShip()

    for coord in p2Ships():
        tile = p2Board.getTileAt(coord)
        tile.setShip()
    p1Board.shipAmount = len(p1Ships())
    p2Board.shipAmount = len(p2Ships())
else:
    shipsamount = 3
    setPlayerBoard(shipsamount, p1Board, p2Board)
    p1Board.shipAmount = shipsamount
    p2Board.shipAmount = shipsamount


game = Game(p1Board, p2Board, 2, p2BoardOfP1, p1BoardOfP2)
game.startGame()



