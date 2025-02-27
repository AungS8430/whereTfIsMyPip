import subprocess
from Datastruct import pkgInfo
from dataclasses import dataclass
import eel
import json

@dataclass()
class Version:
    major: int
    minor: int

    def __repr__(self):
        return f"{self.major}.{self.minor}"

    def __str__(self):
        return f"{self.major}.{self.minor}"

    def __lt__(self, obj):
        if self.major != obj.major:
            return self.major < obj.major
        return self.minor < obj.minor

    def __gt__(self, obj):
        if self.major != obj.major:
            return self.major > obj.major
        return self.minor > obj.minor

@eel.expose
def pip_list(python_version: Version | None=None) -> list[str]:
    pip_arg = ["python", "-m", "pip", "list", "--format", "json"]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    results = subprocess.run(pip_arg, capture_output=True)
    results = results.stdout.decode('utf-8')
    return [json.dumps(x) for x in json.loads(results)]

@eel.expose
def pip_install(package: str, python_version: Version | None=None) -> int | str:
    pip_arg = ["python", "-m", "pip", "install", package]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    results = subprocess.run(pip_arg, capture_output=True)
    if results.returncode != 0:
        return results.stdout.decode('utf-8')
    return 0

@eel.expose
def pip_remove(package: str, python_version: Version | None=None) -> int | str:
    pip_arg = ["python", "-m", "pip", "uninstall", "--yes", package]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    results = subprocess.run(pip_arg, capture_output=True)
    if results.returncode != 0:
        return results.stdout.decode('utf-8')
    return 0

@eel.expose
def pip_upgrade(package: str, python_version: Version | None=None) -> int | str:
    pip_arg = ["python", "-m", "pip", "install", "--upgrade", package]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    results = subprocess.run(pip_arg, capture_output=True)
    if results.returncode != 0:
        return results.stdout.decode('utf-8')
    return 0

@eel.expose
def pip_show(package: str, python_version: Version | None=None) -> str:
    pip_arg = ["python", "-m", "pip", "show", package]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    results = subprocess.run(pip_arg, capture_output=True)
    results = results.stdout.decode('utf-8')
    results = results.splitlines()
    results = [(result.split()[1] if len(result.split()) > 1 else None) for result in results]
    return json.dumps(pkgInfo(name=results[0], version=results[1], summary=results[2], home_page=results[3],
        author =results[4], author_email=results[5], license=results[6], location=results[7],
        requires_dist=results[8].split() if not results[8] == None else None).__dict__)

@eel.expose
def pip_ensure(package: str, python_version: Version | None=None) -> subprocess.CompletedProcess:
    pip_arg = ["python", "-m", "ensurepip", "install", "--upgrade"]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    return subprocess.run(pip_arg, capture_output=True)

@eel.expose
def get_all_python_version():
    results = subprocess.run(["ls", "/usr/bin"], capture_output=True)
    results = results.stdout.decode('utf-8')
    results = results.splitlines()
    out = []
    for result in results:
        if result.find("python3.") == -1:
            continue
        if result.lstrip("python3.").isdecimal():
            out.append(Version(3, int(result.lstrip("python3."))))
    out.sort(reverse=True)
    return out
