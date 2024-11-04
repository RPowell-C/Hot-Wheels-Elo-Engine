import pandas
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix


app = Flask(__name__)
app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
        )


CORS(app, resources={r"/*": {"origins": "*"}})


df = pandas.read_csv('cars.csv')



k = 24


def changeELO(car_name, car2_name, winner):
    car_data = df[df['Cars'] == car_name]


    car1_elo = df.loc[df['Cars'] == car_name, 'ELO']
    car1_elo = car1_elo.iloc[0]

    car2_data = df[df['Cars'] == car2_name]
    car2_elo = df.loc[df['Cars'] == car2_name, 'ELO']
    car2_elo = car2_elo.iloc[0]

    Ea = 1 / (1 + 10 ** ((car2_elo - car1_elo) / 400))
    Eb = 1 / (1 + 10 ** ((car1_elo - car2_elo) / 400))



    car1Rating = 0
    car2Rating = 0
    if winner == 1:
        # Winning Car
        car1Rating = car1_elo + k * (1 - Ea)
        print(str(car1Rating))
        car1PeakELO = df.loc[df['Cars'] == car_name, 'Peak_ELO']
        car1PeakELO = car1PeakELO.iloc[0]
        # Highest ELO
        if car1Rating > car1PeakELO:
            df.loc[df['Cars'] == car_name, 'Peak_ELO'] = int(car1Rating)
        df.loc[df['Cars'] == car_name, 'ELO'] = int(car1Rating)
        df.loc[df['Cars'] == car_name, 'Wins'] = df.loc[df['Cars'] == car_name, 'Wins'] + 1
        # Losing Car
        car2Rating = car2_elo + k * (0 - Eb)
        print(str(car2Rating))
        car2LowELO = df.loc[df['Cars'] == car2_name, 'Lowest_ELO']
        # Lowest ELO
        car2LowELO = car2LowELO.iloc[0]
        if car2Rating < car2LowELO:
            df.loc[df['Cars'] == car2_name, 'Lowest_ELO'] = int(car2Rating)
        df.loc[df['Cars'] == car2_name, 'ELO'] = int(car2Rating)
        df.loc[df['Cars'] == car2_name, 'Losses'] = df.loc[df['Cars'] == car2_name, 'Losses'] + 1
        df.to_csv('cars.csv', index=False)
    if winner == 2:
        # Winner
        car1Rating = car1_elo + k * (0 - Ea)
        print(str(car1Rating))
        car1LowELO = df.loc[df['Cars'] == car_name, 'Lowest_ELO']
        car1LowELO = car1LowELO.iloc[0]
        df.loc[df['Cars'] == car_name, 'ELO'] = int(car1Rating)
        # Lowest ELO
        if car1Rating < car1LowELO:
            df.loc[df['Cars'] == car_name, 'Lowest_ELO'] = int(car1Rating)
        df.loc[df['Cars'] == car2_name,'Wins'] = df.loc[df['Cars'] == car2_name, 'Wins'] + 1
        car2Rating = car2_elo + k * (1 - Eb)
        print(str(car2Rating))
        df.loc[df['Cars'] == car2_name, 'ELO'] = int(car2Rating)
        Car2PeakELO = df.loc[df['Cars'] == car2_name, "Peak_ELO"]
        Car2PeakELO = Car2PeakELO.iloc[0]
        # Highest ELO
        if car2Rating > Car2PeakELO:
            df.loc[df['Cars'] == car2_name, 'Peak_ELO'] = int(car1Rating)
        df.loc[df['Cars'] == car_name,'Losses'] = df.loc[df['Cars'] == car_name, "Losses"] + 1
    # write it back
        df.to_csv('cars.csv', index=False)

    if not car_data.empty:
        print("googledebunkers")
    else:
        print("Car not found")
def updateRankings():
    # get the global rankings
    counter = 0
    counter2 = 1
    cars = df.sort_values(by='ELO', ascending=False)
    while counter < len(cars):
        car = cars['Cars'].iloc[counter]
        peak_rank = cars['Peak_Rank'].iloc[counter]
        rank = df.loc[df['Cars'] == car, 'ELO']
        print(car)
        print(counter2)
        print(peak_rank)
        if counter2 < peak_rank:
          df.loc[df['Cars'] == car, 'Peak_Rank'] = counter2

        counter2 += 1
        counter += 1


@app.route('/updateELO', methods=['POST'])
def updateELO():
    data = request.get_json()
    car_name = data.get('car_name')
    car2_name = data.get('car2_name')
    winner = data.get('winner')

    print(data)
    result = changeELO(car_name, car2_name, winner)
    return jsonify({"Message": result})


@app.route('/top25', methods=['GET'])
def top25():
    updateRankings()
    top_cars = df.sort_values(by='ELO', ascending=False)
    top_cars_data = top_cars.to_dict(orient='records')
    return jsonify(top_cars_data)


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
