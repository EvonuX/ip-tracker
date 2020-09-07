const form = document.getElementById('form')
const results = document.getElementById('results')
const loader = document.getElementById('loading')

const marker = L.icon({ iconUrl: '/images/icon-location.svg' })
const map = L.map('map').setView([51.505, -0.09], 13)

L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.LEAFLY_ACCESS_TOKEN}`, {
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map)

const API_URL = `https://geo.ipify.org/api/v1?apiKey=${process.env.IP_API_KEY}&ipAddress=`

form.addEventListener('submit', (e) => {
  e.preventDefault()
  results.innerHTML = `<h2>Loading...</h2>`

  const val = e.target.children.search.value

  fetch(API_URL + val)
    .then((res) => res.json())
    .then((data) => {
      const { ip, isp, location } = data

      const markup = `
        <div class="results__group">
          <p class="muted">IP Address</p>
          <p class="lead">${ip}</p>
        </div>
        <div class="results__group">
          <p class="muted">Location</p>
          <p class="lead">${location.city}, ${location.region}, ${location.country}</p>
        </div>
        <div class="results__group">
          <p class="muted">Timezone</p>
          <p class="lead">${location.timezone}</p>
        </div>
        <div class="results__group">
          <p class="muted">ISP</p>
          <p class="lead">${isp}</p>
        </div>
      `

      results.innerHTML = markup

      L.marker([location.lat, location.lng], { icon: marker }).addTo(map)
      map.setView([location.lat, location.lng], 14)
    })
    .catch((err) => {
      console.error(err)
      results.innerHTML = `<h2>Something went wrong! Please enter a valid IP address.</h2>`
    })
})
