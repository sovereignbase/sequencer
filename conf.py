"""Sphinx configuration for the generated Sequencer C++ API reference."""

from pathlib import Path


documentation_directory = Path(__file__).resolve().parent

project = "Sequencer C++ API"
author = "Jori Lehtinen"
copyright = "2026, Jori Lehtinen"
version = "0.0.2"
release = version
language = "en"

extensions = ["breathe"]
primary_domain = "cpp"
highlight_language = "cpp"

breathe_projects = {
    "sequencer": str(documentation_directory / ".doxygen" / "xml"),
}
breathe_default_project = "sequencer"
breathe_domain_by_extension = {
    "hpp": "cpp",
    "cpp": "cpp",
}
breathe_default_members = ("members",)

templates_path = []
# Temporary checkouts are independent documentation projects, not pages in this reference.
exclude_patterns = [".doxygen", ".sphinx", "temp/**"]

html_theme = "alabaster"
html_title = project
html_short_title = "C++ API"
html_extra_path = [".nojekyll"]
html_show_sourcelink = False
html_copy_source = False
html_show_sphinx = False
html_theme_options = {
    "description": "Sequencer C++ API reference",
    "fixed_sidebar": True,
}
