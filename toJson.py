import csv
from datetime import datetime
import time
import json

__author__ = 'kojima37'

def toJson(fileName):
    #check if file name exists and its type is csv
    if fileName and isCSV(fileName):
        dataDic = {}
        headers = []
        rows = []
        with open(fileName,"rb") as f:
            reader = csv.reader(f)
            headers = reader.next()

            for row in reader:
                rows.append(row)

        for header in headers:
            if header == "year":
                continue
            rowData = []
            for row in rows:
                # row[0] -> year, row[x] -> category's value
                dt = datetime.strptime(row[0], '%Y%m')
                #dt =datetime(year=int(row[0][0:4]),month=int(row[0][-2]),day=1)
                rowData.append([int(time.mktime(dt.utctimetuple()))*1000, row[headers.index(header)]])
            dataDic[header]=rowData

        p = []
        for k, v in dataDic.iteritems():
            if (k=="Cooked.food"):
                p.append({"key":k,"values":v})

        with open('/Users/kojima37/Documents/CPI.Cooked.food.json', 'w') as output:
            json.dump(p, output)

    else:
        print "please set file path"


def isCSV(fileName):
    fileExt = fileName[-3:]
    if fileExt == "csv":
        return True
    return False

if __name__ == '__main__':
    toJson("/Users/kojima37/Documents/CPI_Data_2015_Apr.csv")
