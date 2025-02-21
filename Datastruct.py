from dataclasses import dataclass
import inspect


@dataclass()
class pkgUrls:
    Documentation: str | None
    Homepage: str | None
    Source: str | None


@dataclass()
class pkgInfo:
    author: str | None = None
    author_email: str | None = None
    bugtrack_url: str | None = None
    classifiers: list | None = None
    description: str | None = None
    description_content_type: str | None = None
    docs_url: str | None = None
    home_page: str | None = None
    license: str | None = None
    name: str | None = None
    package_url: str | None = None
    project_url: pkgUrls | None = None
    requires_dist: list | None = None
    requires_python: str | None = None
    summary: str | None = None
    version: str | None = None
    location:str | None = None
    @classmethod
    def from_dict(cls, env):
        return cls(**{
            k: v for k, v in env.items()
            if k in inspect.signature(cls).parameters
        })
