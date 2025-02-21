import dataclasses
from dataclasses import dataclass
import requests
import inspect

@dataclass()
class pkgUrls:
    Documentation: str | None
    Homepage: str | None
    Source: str | None

@dataclass()
class pkgInfo:
    author: str | None
    author_email: str | None
    bugtrack_url: str | None
    classifiers: list | None
    description: str | None
    description_content_type: str | None
    docs_url: str | None
    home_page: str | None
    license: str | None
    name: str | None
    package_url: str | None
    project_url: pkgUrls | None
    requires_dist: list | None
    requires_python: str | None
    summary: str | None
    version: str | None
    @classmethod
    def from_dict(cls, env):      
        return cls(**{
            k: v for k, v in env.items() 
            if k in inspect.signature(cls).parameters
        })

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