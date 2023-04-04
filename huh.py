schedule=[
    ["huh1", "huh2", "Free", "Free", "Free", "Free"],
    ["huh1", "huh2", "Free", "Free", "Free", "Free"],
    ["huh1", "huh2", "Free", "Free", "Free", "Free"],
    ["huh1", "huh2", "Free", "Free", "Free", "Free"],
    ["huh1", "huh2", "Free", "Free", "Free", "Free"],
    ["huh1", "huh2", "Free", "Free", "Free", "Free"],
  ]
subjects=["huh1", "huh2"]


huhTable = [["free", "free", "free", "free", "free", "free"],
["free", "free", "free", "free", "free", "free"],
["free", "free", "free", "free", "free", "free"],
["free", "free", "free", "free", "free", "free"],
["free", "free", "free", "free", "free", "free"],
["free", "free", "free", "free", "free", "free"]]

sch =[]

for j in schedule: 
    day =[]
    for k in j:
        for i in subjects: 
            if k == i:
                day.append(k)
    if(day.length <6):
        for a in range(6):
            if(day[a]):
                ...
            else:
                day.append("free")
    print(day)


        
