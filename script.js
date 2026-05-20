const authContainer = document.getElementById('authContainer');
const appContainer = document.getElementById('appContainer');

const loginBox = document.getElementById('loginBox');
const signupBox = document.getElementById('signupBox');

const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const bookingForm = document.getElementById('bookingForm');

const bookingFormSection =
document.getElementById('bookingFormSection');

const paymentSection =
document.getElementById('paymentSection');

const payNow =
document.getElementById('payNow');

const ticketContainer =
document.getElementById('ticketContainer');

const myTicketsSection =
document.getElementById('myTickets');

const ticketList =
document.getElementById('ticketList');

const logoutBtn =
document.getElementById('logoutBtn');

const homeLink =
document.getElementById('homeLink');

const bookTicketLink =
document.getElementById('bookTicketLink');

const myTicketsLink =
document.getElementById('myTicketsLink');

let currentUser = null;

/* PAGE LOAD */

window.onload = () => {

    const user =
    JSON.parse(localStorage.getItem('railwayCurrentUser'));

    if(user){

        currentUser = user;

        authContainer.style.display = 'none';
        appContainer.style.display = 'block';

        showHome();
    }

    document.getElementById('journeyDate').value =
    new Date().toISOString().split('T')[0];
};

/* LOGIN / SIGNUP TOGGLE */

showSignup.addEventListener('click', () => {

    loginBox.style.display = 'none';
    signupBox.style.display = 'block';

});

showLogin.addEventListener('click', () => {

    signupBox.style.display = 'none';
    loginBox.style.display = 'block';

});

/* PASSWORD TOGGLE */

document
.getElementById('toggleLoginPassword')
.addEventListener('click', () => {

    togglePassword('loginPassword');

});

document
.getElementById('toggleSignupPassword')
.addEventListener('click', () => {

    togglePassword('signupPassword');

});

function togglePassword(id){

    const input = document.getElementById(id);

    if(input.type === 'password'){

        input.type = 'text';

    }else{

        input.type = 'password';

    }
}

/* SIGNUP */

signupForm.addEventListener('submit', e => {

    e.preventDefault();

    const name =
    document.getElementById('signupName').value.trim();

    const email =
    document.getElementById('signupEmail').value.trim();

    const password =
    document.getElementById('signupPassword').value.trim();

    const mobile =
    document.getElementById('signupMobile').value.trim();

    if(password.length < 6){

        alert('Password must be at least 6 characters');
        return;
    }

    const users =
    JSON.parse(localStorage.getItem('railwayUsers')) || [];

    const already =
    users.find(user => user.email === email);

    if(already){

        alert('User already exists');
        return;
    }

    const newUser = {

        name,
        email,
        password,
        mobile,
        tickets:[]
    };

    users.push(newUser);

    localStorage.setItem(
        'railwayUsers',
        JSON.stringify(users)
    );

    localStorage.setItem(
        'railwayCurrentUser',
        JSON.stringify(newUser)
    );

    currentUser = newUser;

    authContainer.style.display = 'none';
    appContainer.style.display = 'block';

    signupForm.reset();

    showHome();

    alert('Signup Successful');

});

/* LOGIN */

loginForm.addEventListener('submit', e => {

    e.preventDefault();

    const email =
    document.getElementById('loginEmail').value.trim();

    const password =
    document.getElementById('loginPassword').value.trim();

    const users =
    JSON.parse(localStorage.getItem('railwayUsers')) || [];

    const user = users.find(user => {

        return user.email === email &&
        user.password === password;

    });

    if(!user){

        alert('Invalid Email or Password');
        return;
    }

    currentUser = user;

    localStorage.setItem(
        'railwayCurrentUser',
        JSON.stringify(user)
    );

    authContainer.style.display = 'none';
    appContainer.style.display = 'block';

    loginForm.reset();

    showHome();

});

/* BOOKING */

bookingForm.addEventListener('submit', e => {

    e.preventDefault();

    const from =
    document.getElementById('fromStation').value.trim();

    const to =
    document.getElementById('toStation').value.trim();

    if(from === '' || to === ''){

        alert('Please fill all fields');
        return;
    }

    bookingFormSection.style.display = 'none';

    paymentSection.style.display = 'block';

});

/* PAYMENT */

payNow.addEventListener('click', () => {

    const upi =
    document.getElementById('upiId').value.trim();

    if(upi === ''){

        alert('Enter UPI ID');
        return;
    }

    payNow.innerText = 'Processing...';
    payNow.disabled = true;

    setTimeout(() => {

        generateTicket();

        payNow.innerText = 'Pay Now';
        payNow.disabled = false;

    },2000);

});

/* GENERATE TICKET */

function generateTicket(){

    const from =
    document.getElementById('fromStation').value;

    const to =
    document.getElementById('toStation').value;

    const date =
    document.getElementById('journeyDate').value;

    const passengers =
    document.getElementById('passengers').value;

    const trainType =
    document.getElementById('trainType').value;

    const ticketClass =
    document.getElementById('ticketClassSelect').value;

    const bookingDate =
    new Date().toLocaleDateString('en-IN');

    const pnr =
    'UTS' + Math.floor(
        10000000 + Math.random() * 90000000
    );

    /* DISPLAY DATA */

    document.getElementById('ticketFrom')
    .innerHTML = from.toUpperCase();

    document.getElementById('ticketTo')
    .innerHTML = to.toUpperCase();

    document.getElementById('ticketDate')
    .innerHTML = date;

    document.getElementById('ticketPassengers')
    .innerHTML = passengers;

    document.getElementById('ticketTrainType')
    .innerHTML = trainType;

    document.getElementById('ticketClass')
    .innerHTML = ticketClass;

    document.getElementById('ticketPnr')
    .innerHTML = pnr;

    document.getElementById('ticketBookingDate')
    .innerHTML = bookingDate;

    document.getElementById('ticketQr')
    .src =
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${pnr}`;

    const ticket = {

        from,
        to,
        date,
        passengers,
        trainType,
        ticketClass,
        bookingDate,
        pnr
    };

    if(!currentUser.tickets){

        currentUser.tickets = [];
    }

    currentUser.tickets.push(ticket);

    updateUserData();

    bookingFormSection.style.display = 'none';

    paymentSection.style.display = 'none';

    myTicketsSection.style.display = 'none';

    ticketContainer.style.display = 'block';

    loadTickets();

    bookingForm.reset();

    alert('Ticket Booked Successfully');
}

/* UPDATE STORAGE */

function updateUserData(){

    const users =
    JSON.parse(localStorage.getItem('railwayUsers')) || [];

    const updatedUsers = users.map(user => {

        if(user.email === currentUser.email){

            return currentUser;
        }

        return user;
    });

    localStorage.setItem(
        'railwayUsers',
        JSON.stringify(updatedUsers)
    );

    localStorage.setItem(
        'railwayCurrentUser',
        JSON.stringify(currentUser)
    );
}

/* LOAD TICKETS */

function loadTickets(){

    ticketList.innerHTML = '';

    const latestUser =
    JSON.parse(localStorage.getItem('railwayCurrentUser'));

    if(latestUser){

        currentUser = latestUser;
    }

    if(
        !currentUser ||
        !currentUser.tickets ||
        currentUser.tickets.length === 0
    ){

        ticketList.innerHTML = `
        <p style="text-align:center;">
        No tickets booked yet
        </p>
        `;

        return;
    }

    currentUser.tickets.forEach(ticket => {

        const div =
        document.createElement('div');

        div.className = 'booking-form';

        div.innerHTML = `

        <h3>
        ${ticket.from} → ${ticket.to}
        </h3>

        <br>

        <p><b>Date:</b> ${ticket.date}</p>

        <p><b>Passengers:</b> ${ticket.passengers}</p>

        <p><b>Train:</b> ${ticket.trainType}</p>

        <p><b>Class:</b> ${ticket.ticketClass}</p>

        <p><b>PNR:</b> ${ticket.pnr}</p>

        <br>

        <button
        class="btn btn-orange"
        onclick="viewTicket('${ticket.pnr}')">

        View Ticket

        </button>

        `;

        ticketList.appendChild(div);

    });
}

/* VIEW TICKET */

function viewTicket(pnr){

    const ticket =
    currentUser.tickets.find(
        t => t.pnr === pnr
    );

    if(!ticket) return;

    document.getElementById('ticketFrom')
    .innerHTML = ticket.from;

    document.getElementById('ticketTo')
    .innerHTML = ticket.to;

    document.getElementById('ticketDate')
    .innerHTML = ticket.date;

    document.getElementById('ticketPassengers')
    .innerHTML = ticket.passengers;

    document.getElementById('ticketTrainType')
    .innerHTML = ticket.trainType;

    document.getElementById('ticketClass')
    .innerHTML = ticket.ticketClass;

    document.getElementById('ticketPnr')
    .innerHTML = ticket.pnr;

    document.getElementById('ticketBookingDate')
    .innerHTML = ticket.bookingDate;

    document.getElementById('ticketQr')
    .src =
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.pnr}`;

    bookingFormSection.style.display = 'none';

    paymentSection.style.display = 'none';

    myTicketsSection.style.display = 'none';

    ticketContainer.style.display = 'block';
}

/* NAVIGATION */

homeLink.addEventListener('click', e => {

    e.preventDefault();

    showHome();

});

bookTicketLink.addEventListener('click', e => {

    e.preventDefault();

    bookingFormSection.style.display = 'block';

    paymentSection.style.display = 'none';

    ticketContainer.style.display = 'none';

    myTicketsSection.style.display = 'none';

});

myTicketsLink.addEventListener('click', e => {

    e.preventDefault();

    bookingFormSection.style.display = 'none';

    paymentSection.style.display = 'none';

    ticketContainer.style.display = 'none';

    myTicketsSection.style.display = 'block';

    loadTickets();

});

/* HOME */

function showHome(){

    bookingFormSection.style.display = 'block';

    paymentSection.style.display = 'none';

    ticketContainer.style.display = 'none';

    myTicketsSection.style.display = 'none';

    document.getElementById('journeyDate').value =
    new Date().toISOString().split('T')[0];
}

/* LOGOUT */

logoutBtn.addEventListener('click', () => {

    localStorage.removeItem('railwayCurrentUser');

    currentUser = null;

    appContainer.style.display = 'none';

    authContainer.style.display = 'flex';

    loginBox.style.display = 'block';

    signupBox.style.display = 'none';

    loginForm.reset();

    signupForm.reset();

});

/* PRINT */

function printTicket(){

    window.print();

}
