const DB = '/api/data';


async function fetchData(endpoint, query = '') {
  const url = query ? `${endpoint}?name=${encodeURIComponent(query)}` : endpoint;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function fetchAllUsers() {
  const users = await fetchData(DB);
  displayUsers(users);
  
}

export async function fetchUser(name = 'jessica taylor') {
  const user = await fetchData(DB, name);
  displayUserDetails(user);
  // need return for chart data
  return user;
}

function displayUsers(users) {

  const patientsList = document.getElementById('patient-list');
  patientsList.innerHTML = '';

  users.forEach(user => {
    const listItem = document.createElement('li');
    listItem.classList.add('thumbnail-container');

    const thumbnail = document.createElement('img');
    thumbnail.src = user.profile_picture;
    thumbnail.alt = `${user.name} profile picture`;
    thumbnail.classList.add('thumbnail');
    thumbnail.setAttribute('role', 'img');
    listItem.appendChild(thumbnail);

    const patientData = document.createElement('div');
    patientData.classList.add('patient-data');

    const nameParagraph = document.createElement('p');
    nameParagraph.textContent = user.name;
    nameParagraph.classList.add('thumbnail-name');
    patientData.appendChild(nameParagraph);

    const dataParagraph = document.createElement('p');
    dataParagraph.textContent = `${user.gender}, ${user.age}`;
    dataParagraph.classList.add('thumbnail-data');
    patientData.appendChild(dataParagraph);

    listItem.appendChild(patientData);

    const moreIcon = document.createElement('img');
    moreIcon.src = '/public/icons/more_horiz_FILL0_wght300_GRAD0_opsz24.svg';
    moreIcon.alt = 'More options';
    moreIcon.classList.add('more-icon');
    moreIcon.setAttribute('aria-label', 'More options');
    listItem.appendChild(moreIcon);

    if (user.name.includes('Jessica Taylor')) {
      listItem.classList.add('selected');
    }

    patientsList.appendChild(listItem);
  });
  
}

function displayUserDetails(user) {
  console.log(user)

  const name = document.getElementById('user-name');
  const profile_picture = document.getElementById('profile-image');
  const birthday = document.getElementById('user__birthday');
  const gender = document.getElementById('user__gender');
  const contact = document.getElementById('user__contact');
  const emergencyContact = document.getElementById('user__emergency');
  const insurance = document.getElementById('user__insurance');
  const respiratoryValue = document.getElementById('respiratory-value');
  const temperatureValue = document.getElementById('temperature-value');
  const heartRateValue = document.getElementById('heart-rate-value');
  const respiratoryLevel = document.getElementById('respiratory-level');
  const temperatureLevel = document.getElementById('temperature-level');
  const heartRateLevel = document.getElementById('heart-rate-level');
  const systolicValue = document.getElementById('systolic-item__value');
  const systolicLevel = document.getElementById('systolic-item__level');
  const diastolicValue = document.getElementById('diastolic-item__value');
  const diastolicLevel = document.getElementById('diastolic-item__level');

  const formattedDate = moment(user.date_of_birth).format('MMMM D, YYYY');

  name.textContent = user.name;
  profile_picture.src = user.profile_picture;
  profile_picture.alt = `${user.name}'s profile picture`;
  profile_picture.setAttribute('role', 'img');
  birthday.textContent = formattedDate;
  gender.textContent = user.gender;
  contact.textContent = user.phone_number;
  emergencyContact.textContent = user.emergency_contact;
  insurance.textContent = user.insurance_type;

  const diagnosis = user.diagnosis_history[0];
  const bloodPressure = diagnosis.blood_pressure;

  respiratoryValue.textContent = `${diagnosis.respiratory_rate.value} bpm`;
  temperatureValue.textContent = `${diagnosis.temperature.value}°F`;
  heartRateValue.textContent = `${diagnosis.heart_rate.value} bpm`;
  systolicValue.textContent = bloodPressure.systolic.value;
  diastolicValue.textContent = bloodPressure.diastolic.value;

  temperatureLevel.textContent = diagnosis.temperature.levels;
  respiratoryLevel.textContent = diagnosis.respiratory_rate.levels;
  heartRateLevel.textContent = diagnosis.heart_rate.levels;
  systolicLevel.textContent = bloodPressure.systolic.levels;
  diastolicLevel.textContent = bloodPressure.diastolic.levels;


  function isLevelNormal(level, parentElement) {
    if (level !== 'Normal') {
      const imageItem = document.createElement('img');
      imageItem.classList.add('arrow-icon');
      imageItem.alt = `Blood pressure level`;
      if (level.includes('Lower')) {
        imageItem.src = '/public/icons/ArrowDown.svg';
        
      } else {
        imageItem.src = '/public/icons/ArrowUp.svg';
      };
      parentElement.prepend(imageItem);
    }
  }

  isLevelNormal(diagnosis.heart_rate.levels, heartRateLevel);
  isLevelNormal(bloodPressure.systolic.levels, systolicLevel);
  isLevelNormal(bloodPressure.diastolic.levels, diastolicLevel)

  const table = document.querySelector('#diagnosis-table tbody');
  const resultsList = document.getElementById('lab-results-list');
  resultsList.innerHTML = '';
  table.innerHTML = '';

  const diagnosisData = user.diagnostic_list.forEach(data => {

    const row = document.createElement('tr');
    row.classList.add('table-rows');
    const problemCell = document.createElement('td');
    problemCell.textContent = data.name;
    row.appendChild(problemCell);


    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = data.description;
    row.appendChild(descriptionCell);

    const statusCell = document.createElement('td');
    statusCell.textContent = data.status;
    row.appendChild(statusCell);

    table.appendChild(row)
  });

  const labResults = user.lab_results.forEach(result => {
    const listItem = document.createElement('li');
    listItem.classList.add('results-container');

    const labResult = document.createElement('p');
    labResult.classList.add('result')
    labResult.textContent = result;
    listItem.appendChild(labResult);

    if (result.includes('CT')) {
      labResult.classList.add('selected');
    };

    const downloadIcon = document.createElement('img');
    downloadIcon.classList.add('icon');
    downloadIcon.src ='/public/icons/download_FILL0_wght300_GRAD0_opsz24 (1).svg';
    downloadIcon.alt = 'Download lab result';
    labResult.appendChild(downloadIcon);

    resultsList.appendChild(listItem);
  })
  
};

fetchAllUsers();
fetchUser();