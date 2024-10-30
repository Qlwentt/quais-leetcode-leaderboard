import json
import csv

def read_usernames_from_file(filename):
    names_by_usernames = {} # key: username, value: name
    username_row = 'What is your leetcode username'
    name_row = 'What is your name' 

    with open(filename, 'r', newline='') as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            names_by_usernames[row[username_row].strip()] = row[name_row]
    return names_by_usernames

    

def load_existing_users(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def update_json(filename, users):
    with open(filename, 'w') as file:
        json.dump(users, file, indent=4)

def add_users_to_json(usernames_file, json_file):

    all_names_by_username = read_usernames_from_file(usernames_file)
    existing_users = load_existing_users(json_file)
    usernames = set([user['username'] for user in existing_users])
    for username, name in all_names_by_username.items():
        if username not in usernames:
            new_user = {
                "name": name,
                "username": username,
                "elo": 0,
                "prev_elo": 0,
                "prev_problem_count": 0,
                "current_problem_delta": 0,
                "problems_each_week": [],
                "current_problem_count": 0
            }
            existing_users.append(new_user)
    update_json(json_file, existing_users)

if __name__ == "__main__":
    usernames_file = 'users.csv'
    json_file = "../leetcode-elo/public/users_by_elo.json"
    add_users_to_json(usernames_file, json_file)
    print("New users added successfully.")
