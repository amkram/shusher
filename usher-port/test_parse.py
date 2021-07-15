import sys

program = sys.stdin.readlines()

for line in program:
	clean_line = line.strip().replace()
	for char in line:
		print(char)