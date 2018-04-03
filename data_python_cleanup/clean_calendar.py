import csv
import sys
import json

new_data = {}
neighborhood_dict = {}
neighborhood_price_by_month_dict = {}

neighborhood_price_by_month = []

def mean(numbers):
    return float(sum(numbers)) / max(len(numbers), 1)

csv.field_size_limit(1000000)


# Dict of suburb with all listing_ids
with open('../data/listing_montreal_2016.csv', 'rt', encoding="utf8") as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', skipinitialspace=True)
    next(spamreader, None)  # skip the headers
    for row in spamreader:
        if(not row[5] in neighborhood_dict):
            neighborhood_dict[row[5]] = []
        neighborhood_dict[row[5]].append(row[0])


def getNeighborhoodName( id_listing,neighborhood_dict):
    for key, value in neighborhood_dict.items():
        #print(id_listing)
        #print(value)
        if id_listing in value:
            return key

    return "other"

# Raw calendar to dict of listing_id with one mean price for each month
with open('../data/calendar.csv', 'rt') as csvfile:
     spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
     next(spamreader, None)  # skip the headers
     for row in spamreader:

        split_row = row
        month = split_row[1][:7]
        if( not split_row[0] in new_data):
            new_data[split_row[0]] = {}

        if(not month in new_data[split_row[0]]):
            new_data[split_row[0]][month]  = []

        if(split_row[3] != ""):
            new_data[split_row[0]][month].append(float(split_row[3].replace("$", "").replace('"',"").replace(",","")))

# Raw calendar to dict of listing_id with one mean price for each month
with open('../data/calendar_2.csv', 'rt') as csvfile:
     spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
     next(spamreader, None)  # skip the headers
     for row in spamreader:

        split_row = row
        month = split_row[1][:7]
        if( not split_row[0] in new_data):
            new_data[split_row[0]] = {}

        if(not month in new_data[split_row[0]]):
            new_data[split_row[0]][month]  = []

        if(split_row[3] != ""):
            new_data[split_row[0]][month].append(float(split_row[3].replace("$", "").replace('"',"").replace(",","")))


# Get mean price of each month
for key, value in new_data.items():
    for month, prices in new_data[key].items():
        new_data[key][month] = mean(prices) if len(prices) > 0  else None

for key, value in new_data.items():
    neighborhood = getNeighborhoodName(key,neighborhood_dict)
    for month, price in new_data[key].items():
        if(not neighborhood in neighborhood_price_by_month_dict):
            neighborhood_price_by_month_dict[neighborhood] = {}
        if(not month in neighborhood_price_by_month_dict[neighborhood]):
            neighborhood_price_by_month_dict[neighborhood][month] = []
        if(not price is None):
            neighborhood_price_by_month_dict[neighborhood][month].append(price)

for key, value in neighborhood_price_by_month_dict.items():
    for month, prices in neighborhood_price_by_month_dict[key].items():
        neighborhood_price_by_month_dict[key][month] = mean(prices) if len(prices) > 0  else None

for key, value in neighborhood_price_by_month_dict.items():
    values = []
    for date, price in value.items():
        values.append({"date": date, "price" : price})
    neighborhood_object = {"quartier":key,"values":values}
    neighborhood_price_by_month.append(neighborhood_object)

with open('../data/price_by_neighborhood.json', 'w') as outfile:
    json.dump(neighborhood_price_by_month, outfile, sort_keys=True)

