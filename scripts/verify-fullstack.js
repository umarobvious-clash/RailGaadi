async function runTestSuite() {
  console.log('========================================');
  console.log('RAILGAADI END-TO-END RUNTIME VERIFICATION');
  console.log('========================================\n');

  // 1. Health Checks
  const health1 = await fetch('http://localhost:3001/api/health').then(r => r.json());
  const health2 = await fetch('http://localhost:3001/api/v1/health').then(r => r.json());
  console.log('1. HEALTH ENDPOINTS:');
  console.log('   /api/health   :', health1.status === 'ok' ? 'PASS' : 'FAIL', JSON.stringify(health1));
  console.log('   /api/v1/health:', health2.status === 'ok' ? 'PASS' : 'FAIL', JSON.stringify(health2));

  // 2. Train Search
  console.log('\n2. TRAIN SEARCH:');
  const searchQueries = ['12393', '12295', '12301', 'Rajdhani'];
  for (const q of searchQueries) {
    const res = await fetch('http://localhost:3001/api/v1/trains/search?q=' + encodeURIComponent(q)).then(r => r.json());
    console.log(`   Search "${q}":`, res.data?.length ? `PASS (${res.data.length} results: ${res.data[0].name} #${res.data[0].number})` : 'FAIL');
  }

  // 3. Live Train Tracking
  console.log('\n3. LIVE TRAIN TRACKING:');
  const testTrains = ['12393', '12295', '12301'];
  for (const t of testTrains) {
    const live = await fetch('http://localhost:3001/api/v1/trains/' + t + '/live').then(r => r.json());
    if (live.data) {
      console.log(`   Train ${t} (${live.data.train.name}):`);
      console.log(`     Status: ${live.data.status.state} | Delay: ${live.data.status.delayMinutes} min`);
      console.log(`     Location GPS: [${live.data.location?.lng}, ${live.data.location?.lat}]`);
      console.log(`     Current Station: ${live.data.currentStation?.name} (${live.data.currentStation?.code})`);
      console.log(`     Next Station: ${live.data.nextStation?.name} (${live.data.nextStation?.code})`);
      console.log(`     Progress: ${live.data.distanceTravelledKm} / ${live.data.totalDistanceKm} km (${live.data.completionPercent}%)`);
    } else {
      console.log(`   Train ${t}: FAIL`, live);
    }
  }

  // 4. Route Geometry & Map Data
  console.log('\n4. ROUTE GEOMETRY & COORDINATES:');
  for (const t of testTrains) {
    const route = await fetch('http://localhost:3001/api/v1/trains/' + t + '/route').then(r => r.json());
    if (route.data) {
      const coords = route.data.geometry?.coordinates || [];
      const first = coords[0];
      const last = coords[coords.length - 1];
      const isLngLat = first && first[0] > 68 && first[0] < 98 && first[1] > 6 && first[1] < 38;
      console.log(`   Train ${t} Route:`);
      console.log(`     Geometry Type: ${route.data.geometry?.type}`);
      console.log(`     Total Coordinates: ${coords.length}`);
      console.log(`     First Coord [lng, lat]: ${JSON.stringify(first)}`);
      console.log(`     Last Coord [lng, lat]:  ${JSON.stringify(last)}`);
      console.log(`     Valid Indian Bounding Box: ${isLngLat ? 'PASS' : 'FAIL'}`);
      console.log(`     Total Stations: ${route.data.stations?.length}`);
    } else {
      console.log(`   Train ${t} Route: FAIL`, route);
    }
  }

  // 5. Weather Integration (OpenWeather API)
  console.log('\n5. WEATHER INTEGRATION (OpenWeather):');
  const weather = await fetch('http://localhost:3001/api/v1/journeys/12393/weather').then(r => r.json());
  if (weather.data) {
    console.log(`   Current:     ${weather.data.current?.locationName} - ${weather.data.current?.temperatureC}°C, ${weather.data.current?.condition}`);
    console.log(`   Next:        ${weather.data.next?.locationName} - ${weather.data.next?.temperatureC}°C, ${weather.data.next?.condition}`);
    console.log(`   Destination: ${weather.data.destination?.locationName} - ${weather.data.destination?.temperatureC}°C, ${weather.data.destination?.condition}`);
    console.log(`   OpenWeather Live Status: PASS`);
  } else {
    console.log(`   Weather: FAIL`, weather);
  }

  // 6. Elevation Integration (OpenTopography / SRTM)
  console.log('\n6. ELEVATION INTEGRATION (OpenTopography / SRTM):');
  const elev = await fetch('http://localhost:3001/api/v1/routes/12393/elevation').then(r => r.json());
  if (elev.data) {
    console.log(`   Total Profile Points: ${elev.data.points?.length}`);
    console.log(`   Highest Elevation: ${elev.data.highest?.elevationMeters}m @ ${elev.data.highest?.distanceKm}km`);
    console.log(`   Sample Points: ${JSON.stringify(elev.data.points.slice(0, 5).map(p => p.distanceKm + 'km:' + p.elevationMeters + 'm'))}`);
    console.log(`   Elevation Status: PASS`);
  } else {
    console.log(`   Elevation: FAIL`, elev);
  }

  // 7. MapTiler Vector Basemap Authentication
  console.log('\n7. MAPTILER BASEMAP & TILES:');
  const key = '8IP9mXyG1YNXPzrkgg8p';
  const styleRes = await fetch('https://api.maptiler.com/maps/streets-v2-dark/style.json?key=' + key);
  const styleJson = await styleRes.json();
  const tileUrl = styleJson.sources?.maptiler_planet?.url;
  const tileRes = await fetch(tileUrl);
  console.log(`   MapTiler Style (streets-v2-dark) HTTP Status: ${styleRes.status} (${styleRes.status === 200 ? 'PASS' : 'FAIL'})`);
  console.log(`   MapTiler Vector Tiles HTTP Status: ${tileRes.status} (${tileRes.status === 200 ? 'PASS' : 'FAIL'})`);

  // 8. Frontend Serving
  console.log('\n8. FRONTEND SERVER ACCESSIBILITY:');
  const feHome = await fetch('http://localhost:5173/');
  const feJourney = await fetch('http://localhost:5173/journey/12393');
  console.log(`   Frontend Home (http://localhost:5173/) Status: ${feHome.status} (${feHome.status === 200 ? 'PASS' : 'FAIL'})`);
  console.log(`   Frontend Journey (http://localhost:5173/journey/12393) Status: ${feJourney.status} (${feJourney.status === 200 ? 'PASS' : 'FAIL'})`);

  console.log('\n========================================');
  console.log('ALL RUNTIME VERIFICATIONS COMPLETED');
  console.log('========================================');
}

runTestSuite().catch(console.error);
