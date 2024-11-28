import './../style.css'
import * as forge from 'node-forge'
// node forge shit
const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

function encryptWithPublicKey(text: string): string {
    const publicKey = keyPair.publicKey;
    const encrypted = publicKey.encrypt(text);
    return forge.util.encode64(encrypted);
}



// this loads all of the 'modules' (they're not actual modules) here
document.addEventListener("DOMContentLoaded", async () => {
    const carList = document.getElementById("car-list") as HTMLDivElement;
    const modal = document.getElementById("car-modal") as HTMLDivElement;
    const modalCarName = document.getElementById("modal-car-name") as HTMLDivElement;
    const modalCarStats = document.getElementById("modal-car-stats") as HTMLDivElement;
    const closeButton = document.querySelector(".close-button") as HTMLButtonElement;
    // select thingies
    const car1Select = document.getElementById("car1-select") as HTMLSelectElement;
    const car2Select = document.getElementById("car2-select") as HTMLSelectElement;
    // Images
    const modalCarImage = document.getElementById("modal-car-image") as HTMLImageElement;
    const car1Image = document.getElementById("car1-image") as HTMLImageElement;
    const car2Image = document.getElementById("car2-image") as HTMLImageElement;
    // sections
    const racesSection = document.getElementById("races-section") as HTMLDivElement;
    const statsSection = document.getElementById("stats-section") as HTMLDivElement;
    const grandSlamSection = document.getElementById("grand-slam-section") as HTMLDivElement;
    const adminSection = document.getElementById("admin-login") as HTMLDivElement;

    // initializing the tabs
    const grandSlamTab = document.getElementById("grand-slam-tab") as HTMLButtonElement;
    const statsTab = document.getElementById("stats-tab") as HTMLButtonElement;
    const racesTab = document.getElementById("races-tab") as HTMLButtonElement;
    const adminTab = document.getElementById("admin-login-button") as HTMLButtonElement;
    // Buttons
    const submitButton = document.getElementById("submit-button") as HTMLButtonElement;
    interface Car {
        Cars: string;
        ELO: number;
        Wins: number;
        Losses: number;
        Peak_ELO: number;
        Lowest_ELO: number;
        Championships: number;
        Peak_Rank: number;
        Seasons: number;
        Grand_Slam_Wins: number;
    }
    // declaring an empty array named cars
    try {
        // getting the API response from the flask server
        const response = await fetch("http://192.168.1.198:5000/top25");
        const response2 = await fetch("http://192.168.1.198:5000/order");

        // check response
        if (!response.ok) throw new Error("Network response was not ok");


        // cast the json response to the 'Car' interface
        const cars: Car[] = await response.json();
        const cars2: Car[] = await response2.json();
        console.log(cars);

        
        // implicit values of 'any' type error turned off after turning strict off in tsconfig
        cars2.forEach(cars2 => {
            const option1 = document.createElement("option");
            option1.value = cars2.Cars;
            option1.textContent = cars2.Cars;

            const option2 = option1.cloneNode(true) as HTMLOptionElement;

            car1Select.appendChild(option1);
            car2Select.appendChild(option2);
        });


        // car list (dope asf)
        cars.forEach((car, index: number) => {
            const card = document.createElement("div");
            card.className = "car-card";

            if (index === 0) {
                card.classList.add("shimmer");
            }

            card.innerHTML = `
            <h2 class="car-name">${index + 1}. ${car.Cars}</h2>
            <div class="stats">
                <div class="stat">
                    <div class="stat-label">ELO</div>
                    <div class="stat-value">${car.ELO}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Wins</div>
                    <div class="stat-value">${car.Wins}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Losses</div>
                    <div class="stat-value">${car.Losses}</div>
                </div>
                </div>
            </div>
            `;
            // Add event listener to each card
            card.addEventListener("click", () => {
                if (index === 0) {
                    modal.classList.add("shimmer");
                } else {
                    modal.classList.remove("shimmer");
                }
                modalCarName.innerText = car.Cars;
                modalCarImage.src = `images/${car.Cars.replace(/ /g, "_")}.jpg`;
                modalCarImage.alt = car.Cars;


                modalCarStats.innerHTML = `
                    <p><strong>ELO:</strong> ${car.ELO}</p>
                    <p><strong>Wins:</strong> ${car.Wins}</p>
                    <p><strong>Losses:</strong> ${car.Losses}</p>
                    <p><strong>Peak ELO:</strong> ${car.Peak_ELO}</p>
                    <p><strong>Lowest ELO:</strong> ${car.Lowest_ELO}</p>
                    <p><strong>Championships:</strong> ${car.Championships}</p>
                    <p><strong>Peak Rank:</strong> ${car.Peak_Rank}</p>
                    <p><strong>Seasons:</strong> ${car.Seasons}</p>
                    <p><strong>Grand Slam Wins:</strong> ${car.Grand_Slam_Wins}</p>
                `;

                modal.style.display = "block";
            });

            carList.appendChild(card);
        });
    } catch (error) {
        console.error("error fetching or rendering car data:", error);
        carList.innerHTML = "<p>Failed to load data</p>";
    }

    // Tab switching
    statsTab.addEventListener("click", () => {
        statsSection.style.display = "block";
        racesSection.style.display = "none";
        grandSlamSection.style.display = "none";
        adminSection.style.display = "none";
        location.reload();
    });

    racesTab.addEventListener("click", () => {
        statsSection.style.display = "none";
        racesSection.style.display = "block";
        grandSlamSection.style.display = "none";
        adminSection.style.display = "none";
    });

    grandSlamTab.addEventListener("click", () => {
        statsSection.style.display = "none";
        racesSection.style.display = "none";
        grandSlamSection.style.display = "block";
        adminSection.style.display = "none";
    });
    adminTab.addEventListener("click", () => {
        statsSection.style.display = "none";
        racesSection.style.display = "none";
        grandSlamSection.style.display = "none";
        adminSection.style.display = "block";
    });
    

    async function displayCarImage(carSelect: HTMLSelectElement, carImage: HTMLImageElement) {
        const response = await fetch("http://192.168.1.198:5000/top25");
        const cars:Car[] = await response.json();
        const selectedCar = cars.find(car => car.Cars === carSelect.value);
        if (selectedCar) {
            carImage.src = `images/${selectedCar.Cars.replace(/ /g, "_")}.jpg`;
            carImage.alt = selectedCar.Cars;
        }
    }

    car1Select.addEventListener("change", () => displayCarImage(car1Select, car1Image));
    car2Select.addEventListener("change", () => displayCarImage(car2Select, car2Image));


    car1Image.addEventListener("click", () => submitRaceResults(1));
    car2Image.addEventListener("click", () => submitRaceResults(2));



    async function submitRaceResults(winner: number) {
        const car1 = car1Select.value;
        const car2 = car2Select.value;
        console.log(car1);
        console.log(car2);

        if (car1 && car2 && car1 !== car2) {
            const response = await fetch("http://192.168.1.198:5000/updateELO", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
            },
                body: JSON.stringify({
                    car_name: car1,
                    car2_name: car2,
                    winner: winner
                })
        });

            if (response.ok) {
                alert(`${winner} won the race`);
            } else {
                alert("Failed to submit race result");
            }
        } else {
            alert("please select two different cars");
        }
    }


    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    submitButton.addEventListener("click", () => {
        const username = (<HTMLInputElement>document.getElementById("username")).value;
        const password = (<HTMLInputElement>document.getElementById("password")).value;
        console.log(username);
        // send the request with the above data to the flask sever
        const authResponse = fetch("http://192.168.1.198:5000/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: encryptWithPublicKey(password),
            })
        });
        console.log(authResponse);
    });
});
