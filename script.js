document.addEventListener("DOMContentLoaded", async () => {
    const carList = document.getElementById("car-list");
    const modal = document.getElementById("car-modal");
    const modalCarName = document.getElementById("modal-car-name");
    const modalCarImage = document.getElementById("modal-car-image");
    const modalCarStats = document.getElementById("modal-car-stats");
    const closeButton = document.querySelector(".close-button");
    const racesSection = document.getElementById("races-section");
    const car1Select = document.getElementById("car1-select");
    const car2Select = document.getElementById("car2-select");
    const car1Image = document.getElementById("car1-image");
    const car2Image = document.getElementById("car2-image");
    const statsSection = document.getElementById("stats-section");
    const RacesSection = document.getElementById("races-section");
    const grandSlamSection = document.getElementById("grand-slam-section");
    const grandSlamTab = document.getElementById("grand-slam-tab");


    const statsTab = document.getElementById("stats-tab");
    const racesTab = document.getElementById("races-tab");


    let cars = [];
    try {
        const response = await fetch("http://localhost:5000/top25");
        if (!response.ok) throw new Error("Network response was not ok");
        cars = await response.json();



        

        cars.forEach(car => {
            const option1 = document.createElement("option");
            option1.value = car.Cars;
            option1.textContent = car.Cars;

            const option2 = option1.cloneNode(true);

            car1Select.appendChild(option1);
            car2Select.appendChild(option2);
        });

        // car list (dope asf)
        cars.forEach((car, index) => {
            const card = document.createElement("div");
            card.className = "car-card";
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
        statsTab.classList.add("active");
        racesTab.classList.remove("active");
        grandSlamTab.classList.remove("active");
        location.reload();
    });

    racesTab.addEventListener("click", () => {
        statsSection.style.display = "none";
        racesSection.style.display = "block";
        grandSlamSection.style.display = "none";
        statsTab.classList.remove("active");
        racesTab.classList.add("active");
        grandSlamTab.classList.remove("active");
    });

    grandSlamTab.addEventListener("click", () => {
        statsSection.style.display = "none";
        racesSection.style.display = "none";
        grandSlamSection.style.display = "block";
        statsTab.classList.remove("active");
        racesTab.classList.remove("active");
        grandSlamTab.classList.add("active");
    });

    function displayCarImage(carSelect, carImage) {
        const selectedCar = cars.find(car => car.Cars === carSelect.value);
        carImage.src = `images/${selectedCar.Cars.replace(/ /g, "_")}.jpg`;
        carImage.alt = selectedCar.Cars;
    }

    car1Select.addEventListener("change", () => displayCarImage(car1Select, car1Image));
    car2Select.addEventListener("change", () => displayCarImage(car2Select, car2Image));


    car1Image.addEventListener("click", () => submitRaceResults(1));
    car2Image.addEventListener("click", () => submitRaceResults(2));



    async function submitRaceResults(winner) {
        const car1 = car1Select.value;
        const car2 = car2Select.value;
        console.log(car1);
        console.log(car2);

        if (car1 && car2 && car1 !== car2) {
            const response = await fetch("http://localhost:5000/updateELO", {
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
                alert(`Race Result Submitted`);
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
});
