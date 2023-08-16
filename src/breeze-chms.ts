import Breeze from 'breeze-chms';
const breeze = new Breeze('SUBDOMAIN', 'APIKEY');

async () => {
    const person = await breeze.people.get('PERSONID');
    console.log(person.id);
}
