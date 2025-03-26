
function fetchMeteo(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&hourly=temperature_2m,precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min`;
  
      fetch(url)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log("Données météo reçues :", data);
  
          // === TON AFFICHAGE ICI (extrait de ton ancien code) ===
          let current = data.current_weather;
          let temp = current.temperature;
          let wind = current.windspeed;
          let direction = current.winddirection;
          let time = current.time;
          let code = current.weathercode;
          let type = weatherType(code);
  
          console.log("Code météo :", code);
          console.log("Type météo :", type);
  
          let aiguille = document.getElementById("aiguille");
          if (aiguille) {
              aiguille.style.transform = "rotate(" + direction + "deg)";
          }
  
          let weatherIcon = document.getElementById("weatherIcon");
          if (weatherIcon) {
              weatherIcon.src = "images/" + type + ".png";
              weatherIcon.alt = "Météo : " + type;
          }
  
          let desc = document.getElementById("description");
          if (desc) {
              desc.textContent = weatherDescription(code);
          }
  
          let dateObj = new Date(time);
          let hour = dateObj.getHours();
          let isDay = hour >= 6 && hour < 20;
          let dayBox = document.getElementById("dayBox");
          let nightBox = document.getElementById("nightBox");
  
          if (dayBox && nightBox) {
              if (isDay) {
              dayBox.classList.add("active");
              dayBox.classList.remove("inactive");
              nightBox.classList.add("inactive");
              nightBox.classList.remove("active");
              } else {
              nightBox.classList.add("active");
              nightBox.classList.remove("inactive");
              dayBox.classList.add("inactive");
              dayBox.classList.remove("active");
              }
          }
  
          let heures = String(hour).padStart(2, "0");
          let minutes = String(dateObj.getMinutes()).padStart(2, "0");
          let heure = heures + "h" + minutes;
          let jour = String(dateObj.getDate()).padStart(2, "0");
          let mois = String(dateObj.getMonth() + 1).padStart(2, "0");
          let annee = dateObj.getFullYear();
          let date = jour + " / " + mois + " / " + annee;
  
          document.getElementById("temperature").textContent = temp + " °C";
          document.getElementById("wind").textContent = wind + " km/h";
          document.getElementById("time").textContent = heure;
          document.getElementById("date").textContent = date;
  
          updateBackground(type);
          afficherPrevisionsHoraires(data);
          afficherPrevisionsJournalières(data);
          })
      .catch(function (error) {
        console.error("Erreur lors du fetch météo :", error);
        alert("Impossible de récupérer la météo.");
      });
  }
    
  
  function weatherType(code) {                                                    // Fonction pour déterminer le type météo
    if (code === 0 || code === 1) return "sun";                                   // Retourne "sun" si le n° de code (correspondant au type de météo actuel) est 0 ou 1
    if (code === 2 || code === 3) return "suncloud";                              // Retourne "suncloud" si le n° de code est 2 ou 3
    if (code >= 45 && code <= 48) return "fog";                                   // Retourne "fog" si le n° de code est compris entre 45 et 48
    if (code >= 51 && code <= 67) return "rain";                                  // Retourne "rain" si le n° de code est compris entre 51 et 67
    if (code >= 71 && code <= 77) return "snow";                                  // Retourne "snow" si le n° de code est compris entre 71 et 77
    if (code >= 80 && code <= 86) return "rain2";                                 // Retourne "rain2" si le n° de code est compris entre 80 et 86 (forte pluie)
    if (code >= 95) return "storm";                                               // Retoune "storm" si le n° de code est suppérieur a 95
  }
  
  function weatherDescription(code) {                                             // Fonction pour afficher une description météo
    if (code === 0) return "Ciel clair";                                          // Retourne "Ciel clair" si le code est 0
    if (code === 1) return "Principalement clair";                                // Retourne "Principalement clair" si le code est 1
    if (code === 2) return "Partiellement nuageux";                               // Retourne "Principalement nuageux" si le code est 2
    if (code === 3) return "Couvert";                                             // Retourne "Couvert" si le code est 3
    if (code >= 45 && code <= 48) return "Brouillard";                            // Retourne "Brouillard" si le code est compris entre 45 et 48
    if (code >= 51 && code <= 57) return "Légère pluie";                          // Retourne "Légère pluie" si le code est compris entre 51 et 57
    if (code >= 61 && code <= 67) return "Pluie modérée";                         // Retoune "Pluie modérée" si le code est compris entre 61 et 67
    if (code >= 71 && code <= 77) return "Chutes de neige";                       // Retoune "Chutes de neige" si le code est compris entre 71 et 77
    if (code >= 80 && code <= 86) return "Averses";                               // Retoune "Averses" si le code est compris entre 80 et 86
    if (code === 95) return "Orage";                                              // Retoune "Orage" si le code est 95
    if (code >= 96) return "Orage violent";                                       // Retoune "Orage violent" si le code est suppérieur à 96
  }
  
  function updateBackground(type) {                                               // Fonction pour changer le fond du body selon le type météo
    document.body.style.backgroundImage = "url('images/" + type + ".jpg')";   // Change le background en récupèrant le type pour l'implémenter au chemin d'acces de l'image
  }
  
  function afficherPrevisionsHoraires(data) {                                     // Fonction pour afficher les prévisions par heures
      const container = document.getElementById("hourlyForecast");                // Récupère l'ID hourlyForecast
      container.innerHTML = "";                                                   // Réinitialise le contenu
    
      const heures = data.hourly.time;                                            // Récupère les timestamps horaires depuis les données
      const temperatures = data.hourly.temperature_2m;                            // Récupère les températures horaires à 2m
      const precipitations = data.hourly.precipitation;                           // Récupère les données de précipitations horaires
    
      for (let i = 0; i < 24; i++) {                                              // Boucle sur les 24 prochaines heures
        const date = new Date(heures[i]);                                         // Crée un objet Date à partir du timestamp horaire
        const heure = date.getHours().toString().padStart(2, "0") + "h" + "00";   // Formate l'heure en "HHh00" (ex: "14h00")
    
        const card = document.createElement("div");                               // Crée un nouvel élément div pour chaque heure
        card.classList.add("hour-card");                                          // Ajoute la classe "hour-card" au div
    
        card.innerHTML = `                                                  
          <p>${Math.round(temperatures[i])} °C</p>                      
          <p>${precipitations[i]} mm</p>                                 
          <p><strong>${heure}</strong></p>                                  
        `;
    
        if (!data.hourly || !data.hourly.temperature_2m) {                        // Vérifie si les données horaires sont présentes
          throw new Error("Données horaires indisponibles.");                     // Lance une erreur si les données manquent
        }
              
        container.appendChild(card);                                              // Ajoute la carte au conteneur dans le DOM
      }
  }
  
  function afficherPrevisionsJournalières(data) {                                 // Fonction pour affichert les prévisions journalières
      const container = document.getElementById("forecastDaily");
      container.innerHTML = ""; 
    
      const dates = data.daily.time;
      const codes = data.daily.weathercode;
      const tMax = data.daily.temperature_2m_max;
      const tMin = data.daily.temperature_2m_min;
    
      for (let i = 0; i < dates.length; i++) {
        const date = new Date(dates[i]);
        const jour = String(date.getDate()).padStart(2, "0");
        const mois = String(date.getMonth() + 1).padStart(2, "0");
        const annee = date.getFullYear();
        const dateStr = jour + " / " + mois + " / " + annee;
    
        const type = weatherType(codes[i]);
        const iconPath = "images/" + type + ".png";
    
        const card = document.createElement("div");
        card.classList.add("day-card");
    
        card.innerHTML =
          "<p><strong>" + dateStr + "</strong></p>" +
          "<img src='" + iconPath + "' alt='Icône météo'>" +
          "<p><strong>Max : " + Math.round(tMax[i]) + "°C</strong></p>" +
          "<p>Min : " + Math.round(tMin[i]) + "°C</p>";
    
        container.appendChild(card);
      }
  }
  
  function rechercherVille(ville) {
      const localisation = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(ville) + "&count=1&language=fr&format=json";
    
      fetch(localisation)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.results && data.results.length > 0) {
            const { latitude, longitude, name, country } = data.results[0];
            
            document.getElementById("cityName").textContent = `${name}, ${country}`;
            
            fetchMeteo(latitude, longitude);
          } else {
            alert("Ville non trouvée !");
          }
        })
        .catch(function (err) {
          console.error("Erreur géocodage :", err);
          alert("Erreur lors de la recherche.");
        });
    }
    
  
  window.addEventListener("load", function () {
      rechercherVille("Saint-Étienne");
    });
    
  document.getElementById("searchBtn").addEventListener("click", function () {
      const city = document.getElementById("searchInput").value.trim();
      if (city) {
        rechercherVille(city);
      }
  });
    