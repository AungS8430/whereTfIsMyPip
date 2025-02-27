import eel
from getPackage import *
from pipStuff import *
from threading import Thread


def main():
    eel.init("gui")
    eel.start("index.html")

if __name__ == "__main__":
    f = Thread(target=get)
    f.start()
    p = Thread(target=main)
    p.start()
    f.join()
    p.join()
