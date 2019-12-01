import {Colors} from '../const.js';

const DescriptionItems = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const DefaultRepeatingDays = {
  'mo': false,
  'tu': false,
  'we': false,
  'th': false,
  'fr': false,
  'sa': false,
  'su': false,
};

const Tags = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`
];

const DAY_OF_WEEK = 6;
const TAGS_MAX = 3;

const getRandomIntegerNumber = (max, min = 0) => {
  return min + Math.round((max - min) * Math.random());
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(array.length - 1);
  return array[randomIndex];
};

const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = getRandomBoolean() ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(DAY_OF_WEEK);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {
    'mo': getRandomBoolean()
  });
};

const generateTags = (tags) => {
  return tags
    .filter(getRandomBoolean)
    .slice(0, getRandomIntegerNumber(TAGS_MAX));
};

const generateTask = () => {
  const dueDate = getRandomBoolean() ? null : getRandomDate();

  return {
    description: getRandomArrayItem(DescriptionItems),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
    tags: new Set(generateTags(Tags)),
    color: getRandomArrayItem(Colors),
    isFavorite: getRandomBoolean(),
    isArchive: getRandomBoolean()
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTask, generateTasks};
