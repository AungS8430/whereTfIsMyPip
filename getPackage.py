from Datastruct import pkgInfo
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

def getInfo(packages, query):
    if query not in packages:
        return 1
    result = pkgInfo.from_dict(requests.get(f"https://pypi.org/pypi/{query}/json").json()["info"])
    return result
