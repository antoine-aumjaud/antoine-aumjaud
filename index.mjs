import dateFormat from 'dateformat';
import { promises as fs } from 'fs';

const MS_IN_ONE_DAY = 1000 * 60 * 60 * 24;
const TODAY = new Date();

const generateNewContent = async() => {
  const readme = await fs.readFile('README.tpl.md');
  const readmeRows = readme.toString().split('\n');

  const updateIdentifier = (identifier, replaceText) => {
    const identifierIndex = readmeRows.findIndex( (r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));
    if(identifierIndex < 0) {
      console.error(`identifier ${identifier} not found`);
    }
    else {
      readmeRows[identifierIndex] = readmeRows[identifierIndex].replace(`<#${identifier}>`, replaceText);
    }
  };

  const identifierToUpdate = {
    age_and_birthday: getAgeAndBirthdaySentence(),
    today_date: getTodayDate(),
    bot_signing: getBotSigning(),
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
  });

  return readmeRows.join('\n');
};

const getBotSigning = () => {
  return `🚀 This README.md is updated by GitHub Actions Workflows ❤️`;
};

const getTodayDate = () => {
  return dateFormat(TODAY, "d mmmm yyyy")
};

const getAgeAndBirthdaySentence = () => {
  const birthday = new Date('1979-09-26T00:00:00.000Z');
  const diffBirthdayToToday = TODAY - birthday;
  const age = new Date(diffBirthdayToToday).getFullYear() - 1970;

  if(birthday.getDate()  === TODAY.getDate() 
  && birthday.getMonth() === TODAY.getMonth() ) {
    return `Today is my birthday 🎂! I am ${age} years old.`;
  }

  const birthdatetoday = new Date(birthday.setYear(TODAY.getFullYear()));
  const isBirthdayRaised = TODAY - birthdatetoday > 0;

  const nextBirthdayYear = birthday.getFullYear() + (isBirthdayRaised ? 1 : 0);
  const nextBirthdayDate = new Date(birthday.getTime());
  nextBirthdayDate.setYear(nextBirthdayYear);

  const timeUntilBirthday = nextBirthdayDate - TODAY;
  const dayUntilBirthday = Math.round(timeUntilBirthday / MS_IN_ONE_DAY);

  return `I am ${age} years old, I will be ${age + 1} in ${dayUntilBirthday} days 🎉.`;
};

const updateReadmeFile = async (text) => {
  await fs.writeFile('./README.md', text, { flag: "w" });
};

const main = async() => {
  const newContent = await generateNewContent();
  await updateReadmeFile(newContent);
};

main();
