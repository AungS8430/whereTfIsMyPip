import subprocess
from dataclasses import dataclass

@dataclass
class info:
    name: str
    version: str
    summary: str

def get_installed() -> list[tuple[str, str]]:
    results = subprocess.run(["pip", "list"], capture_output=True)
    results = results.stdout.decode('utf-8')
    results = results.splitlines()
    results.pop(0)
    results.pop(0)
    out = []
    for result in results:
        out.append(result.split())
    return out


def install_pip(package: str) -> subprocess.CompletedProcess:
    return subprocess.run(["pip", "install", package], capture_output=True)


def get_package_info(package: str):
    pass
