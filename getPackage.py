from Datastruct import pkgInfo
import requests
import eel

@eel.expose
def get():
    r = requests.get("https://pypi.org/simple/")
    packages = str(r.content).split("\\n")[2:-2]
    for i in range(len(packages)):
        packages[i] = packages[i].split(">")[1].split("<")[0]
    return packages

@eel.expose
def search(packages, filter=[], query=""):
    result = []
    count = 0
    for package in packages:
        if package.startswith(query) and package not in filter:
            result.append(package)
            count += 1
            if count >= 30:
                break
    return result

@eel.expose
def getInfo(packages, query):
    if query not in packages:
        return 1
    result = pkgInfo.from_dict(requests.get(f"https://pypi.org/pypi/{query}/json").json()["info"])
    return str(result.__dict__)
