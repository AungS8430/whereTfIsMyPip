import requests

def get():
    r = requests.get("https://pypi.org/simple/")
    packages = r.content.split("\n")
    print(packages)

get()
