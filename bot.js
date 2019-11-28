const puppeteer = require('puppeteer');

// Settings
let settingsHeadless = true;

// Text Sources
const textSalutations = require('./texts/salutations.json');
const textIntroductions = require('./texts/introductions.json');
const textOrganizations = require('./texts/organisations.json');
const textFindings = require('./texts/findings.json');
const textNames = require('./texts/names.json');
const textLastnames = require('./texts/lastnames.json');
const textMailhosts = require('./texts/mailhosts.json');
const textEndings = require('./texts/endings.json');
const textEndingSalutations = require('./texts/endingsalutations.json');

(async () => {
	console.log("===");
	console.log("Generating new Message");

	let randomSalutation = textSalutations[Math.floor(Math.random()*textSalutations.length)];
	let randomIntroduction = textIntroductions[Math.floor(Math.random()*textIntroductions.length)];
	let randomOrganization = textOrganizations[Math.floor(Math.random()*textOrganizations.length)];
	let randomFinding = textFindings[Math.floor(Math.random()*textFindings.length)];
	let randomName = textNames[Math.floor(Math.random()*textNames.length)];
	let randomLastname = textLastnames[Math.floor(Math.random()*textLastnames.length)];
	let randomMailhost = textMailhosts[Math.floor(Math.random()*textMailhosts.length)];

	let constructedMail = makeMailSave(randomName + "." + randomLastname + "@" + randomMailhost);

	randomIntroduction = randomIntroduction.replace("{NAME}", randomName + " " + randomLastname);
	randomIntroduction = randomIntroduction.replace("{ORG}", randomOrganization);
	randomIntroduction = randomIntroduction.replace("{FINDING}", randomFinding);

	let randomEnding = textEndings[Math.floor(Math.random()*textEndings.length)];
	let randomEndingsalutation = textEndingSalutations[Math.floor(Math.random()*textEndingSalutations.length)];

	let outputMessage = randomSalutation + ", \n" + randomIntroduction + "\n\n" + randomEnding + "\n\n" + randomEndingsalutation + "\n" + randomName + " " + randomLastname;

	console.log("Opening Browser");

	const browser = await puppeteer.launch({
		headless: settingsHeadless,
		defaultViewport: { width: 1280, height: 920 }
	});
	const page = await browser.newPage();
	
	console.log("Loading Page");

	// Open page.
	await page.goto('https://mainstream-aussteiger.de/');

	// Accept Cookies
	await page.click('.cookie_action_close_header');
	
	console.log("Filling Inputs");

	// Name
	await page.focus('input[name="your-name"]');
	await page.keyboard.type(randomName + " " + randomLastname);
	
	// E-Mail
	await page.focus('input[name="your-email"]');
	await page.keyboard.type(constructedMail.toLowerCase());

	// Betreff
	await page.focus('input[name="your-subject"]');
	await page.keyboard.type("");
	
	// Nachricht
	await page.focus('textarea[name="your-message"]');
	await page.keyboard.type(outputMessage);
	
	console.log("Sending Form");

	// Submit the form.
	await page.evaluate(() => document.querySelector('input[type="submit"]').click());

	setTimeout(function() {
		console.log("Done, next one!");

		// Keep the browser open.
		browser.close();
	}, 500);
})();

function makeMailSave(email) {
	return email.replace("ß", "ss").replace(" ", "").replace("ö", "oe").replace("ä", "ae").replace("ü", "ue").replace("Ö", "Oe").replace("Ä", "Ae").replace("Ü", "Ue");
}