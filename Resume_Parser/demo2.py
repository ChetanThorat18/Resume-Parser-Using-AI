sentence = "Windows Server administration"
entity_1 = "Windows Server administration"
entity_2 = "Spring Boot"
entity_3 = "Spring Boot"


print(len(sentence))

start_1 = sentence.find(entity_1)  # Finds the start index 
end_1 = start_1 + len(entity_1)  # Finds the end index 

start_2 = sentence.find(entity_2)  
end_2 = start_2 + len(entity_2)  

start_3 = sentence.find(entity_3)  
end_3 = start_3 + len(entity_3) 

print(f"Entity 1: {start_1}, {end_1}")
print(f"Entity 2: {start_2}, {end_2}")
print(f"Entity 3: {start_3}, {end_3}")