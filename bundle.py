import sys
import re
import zipfile
import os

if len(sys.argv) < 2:
    print("Usage: python package.py <version_string>")
    sys.exit(1)

excluded_file_paths = {r"^.git", r"^build", r"^.prettierrc", r"^.git",
                       r"^ts", r"^node_modules", r"LICENSE", r"^package", 
                       r"^readme", r"^tsconfig", r".vscode", r"^pnpm",
                       r"^res/webstore", r"^res/firefoxaddon", r"^bundle"}

def shouldBeAdded(file_path):
    for each_path in excluded_file_paths:
        if (re.match(each_path, file_path)):
            return False
    return True


print(f"Version string: {sys.argv[1]}")
with zipfile.ZipFile(f"./build/ghlines-{sys.argv[1]}.zip", "w") as zip_file:
    for root, _, files in os.walk("./"):
        for file in files:
            full_path = os.path.join(root, file)
            archive_path = os.path.relpath(full_path, "./")
            if (shouldBeAdded(archive_path)):
                print(f"Added: {archive_path}")
                zip_file.write(full_path, archive_path)


print("Zip created successfully.")