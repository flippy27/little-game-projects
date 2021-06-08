class Tile:
    def __init__(self, coordAlpha, coordNum, status):
        self.coordAlpha = coordAlpha
        self.coordNum = coordNum
        self.status = status

    def getCoord(self):
        return self.coordAlpha +  str(self.coordNum)

    def getHit(self):
        if(self.status == "d"):
            return "ad"
        elif(self.status == "S"):
            self.status = "d"
            return "d"
        elif(self.status == "y"):
            return "You hit here already, try again."
        elif(self.status == "n"):
            self.status = "y"
            return "n"

    def setShip(self):
        if(self.status != "S"):
            self.status = "S"
            return True
        else:
            return False

    def setValue(self,val):
        self.status = val
