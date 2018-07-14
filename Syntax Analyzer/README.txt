Use Python 2

1) Go to the directory in the command prompt where the Python file is downlaoded.
2) Place the input_file in the same directory as the python file
3) In the command propmt run the command as <python syntaxAnalyzer.py input_file_name.txt> 

Positve Cases:
P os.type not contains win
N os.arch match 32
P @upper(os.name) == WINDOWS2K12
N @count(os.users.java.version) context > 20
P os.java.version version not contains 8.3.104a


Negative Cases:
M os.type not contains win
N os.arch === 32
P @upper(==) == WINDOWS2K12
N @count(os.users.java.version) Context > 20
P os.java.version version not contain 8.3.104a
