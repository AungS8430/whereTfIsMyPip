from Datastruct import pkgInfo
import requests
import json
import eel


@eel.expose
def get():
    r = requests.get("https://pypi.org/simple/")
    packages = str(r.content).split("\\n")[2:-2]
    for i in range(len(packages)):
        packages[i] = packages[i].split(">")[1].split("<")[0]
    return packages

@eel.expose
def search(packages, filter=[], query="", all=False):
    filter = set(filter)
    result = []
    count = 0
    leng = len(query)
    for package in packages:
        if package[:leng] == query and package not in filter:
            result.append(package)
            count += 1
            if count >= 30 and not all:
                break
    return result

@eel.expose
def getInfo(query):
    result = pkgInfo.from_dict(requests.get(f"https://pypi.org/pypi/{query}/json").json()["info"])
    return json.dumps(result.__dict__)

@eel.expose
def getDesc(query):
    result = requests.get(f"https://pypi.org/pypi/{query}/json").json()["info"]["description"]
    return result
