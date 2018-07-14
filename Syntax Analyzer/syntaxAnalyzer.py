import sys

def P_N_check(character):
    if (character == 'P' or character == 'N'):
        return True
    else:
        return False

def property_check(word):
    if '.' in word:
        dotSeperated = word.split(".")
        if (dotSeperated[0].isalnum() and dotSeperated[1].isalnum()):
            return True
        else:
            return False

    
def operator_check(word):
    if (word.startswith(operation)):
        bracketSeperated = word.split("(")
        propertyCheck = bracketSeperated[1].split(")")[0]
        if (property_check(propertyCheck)):
            return True
        else:
            return False

def context_check(word):
    if (word.islower()):
        return True
    else:
        return False

def singlecomparator_check(word):
    if word in oneStringComparator:
        return True
    else:
        return False

def doublecomparator_check(word):
    if word in twoStringComparator:
        return True
    else:
        return False

def value_check(word):
    if (len(word.split()) == 1):
        return True
    else:
        return False

def syntaxAnalyzer(file_name):
    syntax = []
    try:
        fp = open(file_name, 'r')
        lines = fp.readlines()
        for line in lines:
            seperateWords = line.split()
            if seperateWords == []:
                syntax.append('syntax err')
            elif (P_N_check(seperateWords[0])):
                if (operator_check(seperateWords[1]) or (property_check(seperateWords[1]))):
                    if (singlecomparator_check(seperateWords[2])):
                        afterComparison = line.split(seperateWords[2])[1]
                        if (value_check(afterComparison) or (operator_check(afterComparison))):
                            syntax.append('syntax ok')
                        else:
                            syntax.append('syntax err')
                    elif(doublecomparator_check(seperateWords[2] + " " + seperateWords[3])):
                        afterComparison = line.split(seperateWords[2] + " " + seperateWords[3])[1]
                        if (value_check(afterComparison) or (operator_check(afterComparison))):
                            syntax.append('syntax ok')
                        else:
                            syntax.append('syntax err')
                    elif context_check(seperateWords[2]):
                        if (singlecomparator_check(seperateWords[3])):
                            afterComparison = line.split(seperateWords[3])[1]
                            if (value_check(afterComparison) or (operator_check(afterComparison))):
                                syntax.append('syntax ok')
                            else:
                                syntax.append('syntax err')

                        elif(doublecomparator_check(seperateWords[3] + " " + seperateWords[4])):
                            afterComparison = line.split(seperateWords[3] + " " + seperateWords[4])[1]
                            if (value_check(afterComparison) or (operator_check(afterComparison))):
                                syntax.append('syntax ok')
                            else:
                                syntax.append('syntax err')
                        else:
                            syntax.append('syntax err')
                    else:
                        syntax.append('syntax err')       
                else:
                    syntax.append('syntax err')
            else:
                syntax.append('syntax err')
        return syntax          
                 
            
    except Exception as e:
        print e
        return syntax

inputFileName = sys.argv[1]
oneStringComparator = ['==', '>', '<', '>=', '<=', '!=', 'has', 'in', 'contains', 'match', 'added', 'removed']
twoStringComparator = ['not has', 'not in', 'not contains', 'not match']
operation = ('@count', '@lower', '@upper')
syntax = syntaxAnalyzer(inputFileName)
for i in range(len(syntax)):
    print "Line",i+1,":",syntax[i]
