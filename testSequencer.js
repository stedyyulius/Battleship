const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    sort(tests) {
        const sequences = ['Rooms', 'Board'];
        const result = [];

        for (const test of tests) {
            let splited = test.path.split('\\');
            let testFileName = splited[splited.length - 1].split('.')[0];

            result[sequences.indexOf(testFileName)] = test;
        }

        return result;
    }
}

module.exports = CustomSequencer;