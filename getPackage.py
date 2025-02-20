import requests

def get():
    r = requests.get("https://pypi.org/simple/")
    packages = str(r.content).split("\\n")[2:-2]
    for i in range(len(packages)):
        packages[i] = packages[i].split(">")[1].split("<")[0]
    return packages

def search(packages, query):
    result = [package for package in packages if package[0:len(query)] == query]
    return result