      document
        .getElementById("darkModeToggle")
        .addEventListener("change", () => {
          document.body.classList.toggle("dark");
        });

      async function getWeather() {
        const city = document.getElementById("cityInput").value;
        const apiKey = "e0512eac29f421d898df641389ddfa24";

        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        try {
          const currentResponse = await fetch(currentUrl);
          if (!currentResponse.ok) throw new Error("City not found");
          const currentData = await currentResponse.json();

          document.getElementById("weatherResult").innerHTML = `
            <p><strong>${currentData.name}, ${currentData.sys.country}</strong></p>
            <p>Temperature: ${currentData.main.temp} °C</p>
            <p>Weather: ${currentData.weather[0].description}</p>
            <p>Wind Speed: ${currentData.wind.speed} m/s</p>
          `;

          const forecastResponse = await fetch(forecastUrl);
          const forecastData = await forecastResponse.json();

          const daily = forecastData.list.filter((i) =>
            i.dt_txt.includes("12:00:00")
          );

          let html = "";
          daily.forEach((day) => {
            const d = new Date(day.dt_txt);
            const date = `${d.getDate().toString().padStart(2, "0")}/${(
              d.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}/${d.getFullYear()}`;
            const temp = day.main.temp;
            const desc = day.weather[0].description;
            const icon = day.weather[0].icon;

            html += `
              <div class="forecast-day">
                <p>${date}</p>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png">
                <p>${temp} °C</p>
                <p>${desc}</p>
              </div>
            `;
          });

          document.getElementById("forecast").innerHTML = html;
        } catch (err) {
          document.getElementById(
            "weatherResult"
          ).innerHTML = `<p style="color:red;">${err.message}</p>`;
          document.getElementById("forecast").innerHTML = "";
        }
      }
