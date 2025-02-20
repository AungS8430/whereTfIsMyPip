import subprocess
from dataclasses import dataclass


@dataclass()
class Version:
    major: int
    minor: int

    def __repr__(self):
        return f"{self.major}.{self.minor}"

    def __str__(self):
        return f"{self.major}.{self.minor}"


@dataclass()
class Info:
    name: str | None
    version: str | None
    summary: str | None = None
    homepage: str | None = None
    author: str | None = None
    author_email: str | None = None
    license: str | None = None
    location: str | None = None
    requires: str | None = None
    required_by: str | None = None


def pip_list(python_version: Version | None=None) -> list[tuple[str, str]]:
    pip_arg = ["python", "-m", "pip", "list"]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    results = subprocess.run(pip_arg, capture_output=True)
    results = results.stdout.decode('utf-8')
    results = results.splitlines()
    results = results[2::]
    out = []
    for result in results:
        out.append(Info(result.split()[0], result.split()[1]))
    return out


def pip_install(package: str, python_version: Version | None=None) -> subprocess.CompletedProcess:
    pip_arg = ["python", "-m", "pip", "install", package]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    return subprocess.run(pip_arg, capture_output=True)


def pip_remove(package: str, python_version: Version | None=None) -> subprocess.CompletedProcess:
    pip_arg = ["python", "-m", "pip", "uninstall", package]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    return subprocess.run(pip_arg, capture_output=True)


def pip_show(package: str, python_version: Version | None=None) -> Info:
    pip_arg = ["python", "-m", "pip", "show", package]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    results = subprocess.run(pip_arg, capture_output=True)
    results = results.stdout.decode('utf-8')
    results = results.splitlines()
    results = [(result.split()[1] if len(result.split()) > 1 else None) for result in results]
    return Info(results[0], results[1], results[2], results[3], results[4], results[5], results[6], results[7], results[8], results[9])


def pip_ensure(package: str, python_version: Version | None=None) -> subprocess.CompletedProcess:
    pip_arg = ["python", "-m", "ensurepip", "install", "--upgrade"]
    if python_version != None:
        pip_arg[0] = f"python{python_version}"
    return subprocess.run(pip_arg, capture_output=True)
