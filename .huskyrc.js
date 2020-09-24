/**
 * @param {string[]} arr
 */
const tasks = arr => arr.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks(['yarn lint', 'yarn fmt', 'yarn test']),
  },
};
