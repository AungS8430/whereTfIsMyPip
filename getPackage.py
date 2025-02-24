from Datastruct import pkgInfo
import requests
import json
import eel


def str_to_int(txt: str, ln: int) -> int:
    txt = txt[:ln]
    tem = 0
    for idx in range(ln):
        tem += (ord(txt[idx]) if idx < len(txt) else 0) + (tem << 8)
    return tem

def lowerBound(arr: list[str], target: int, leng: int):
    lo = 0
    hi = len(arr) - 1
    res = len(arr)
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if str_to_int(arr[mid], leng) >= target:
            res = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return res

def upperBound(arr: list[str], target: int, leng: int):
    lo, hi = 0, len(arr) - 1
    res = len(arr)
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if str_to_int(arr[mid], leng) > target:
            res = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return res

@eel.expose
def get():
    r = requests.get("https://pypi.org/simple/")
    packages = str(r.content).split("\\n")[2:-2]
    for i in range(len(packages)):
        packages[i] = packages[i].split(">")[1].split("<")[0]
    return sorted(packages)

@eel.expose
def search(packages, filter=[], query="", all=False):
    count = 0
    filter = set(filter)
    result = []
    leng = len(query)
    temtxt = str_to_int(query, leng)
    left = lowerBound(packages, temtxt, leng)
    right = upperBound(packages, temtxt, leng)
    for idx in range(left, right):
        if packages[idx] not in filter:
            result.append(packages[idx])
            count += 1
            if count > 30 and all:
                break
    return result

@eel.expose
def getInfo(query):
    try:
        result = pkgInfo.from_dict(requests.get(f"https://pypi.org/pypi/{query}/json").json()["info"])
    except:
        return json.dumps(pkgInfo(name=query, summary="Error: Info not found. Return null instead.").__dict__)
    return json.dumps(result.__dict__)

@eel.expose
def getDesc(query):
    result = requests.get(f"https://pypi.org/pypi/{query}/json").json()["info"]["description"]
    return result
