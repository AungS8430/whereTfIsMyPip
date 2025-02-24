#Enter your venv path (ie ./bin/python)
PATH_TO_PYTHON="./bin/python"

#run main program
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
./bin/python main.py
