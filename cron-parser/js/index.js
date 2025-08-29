import _ from 'lodash';
import * as R from 'ramda';
import Mocha from 'mocha';
import assert from 'assert';
import { parse } from '@datasert/cronjs-parser';
import util from 'util';

const mocha = new Mocha();
mocha.suite.emit('pre-require', globalThis, 'solution', mocha);

const originalLog = console.log;
console.log = (...args) => {
  const inspectedArgs = args.map(arg =>
    typeof arg === 'object' ? util.inspect(arg, { depth: null, colors: true }) : arg
  );
  originalLog(...inspectedArgs);
};

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => i + start);

const allowedValues = {
  minute: new Set(range(0, 59)),
  hour: new Set(range(0, 23)),
  day_of_month: new Set(range(1, 31)),
  month: new Set(range(1, 12)),
  day_of_week: new Set(range(0, 6)),
  year: new Set(range(1970, 2099))
};

// console.log({allowedValues});

const MONTH_TO_INT = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12
};

const DAY_OF_WEEK_TO_INT = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
};

const parseCron = (cronStr) => {
  const spaceRegex = /\s+/g;
  const split = cronStr.trim().split(spaceRegex);
  // console.log({split});

  if (split.length < 5 || split.length > 6) {
    throw new Error(`Invalid cron expression [${cronStr}]. Expected [5 to 6] fields but found [${split.length}] fields.`);
  }

  const monthStrToInt = (str) => {
    const monthInt = MONTH_TO_INT[str];
    if (monthInt === undefined) {
      throw new Error(`Invalid cron expression [${cronStr}]. Invalid month specifier [${str}]. Expected: [${Object.keys(MONTH_TO_INT).join(", ")}]`);
    } else {
      return monthInt;
    }
  };

  const dayStrToInt = (str) => {
    const dayInt = DAY_OF_WEEK_TO_INT[str];
    if (dayInt === undefined) {
      throw new Error(`Invalid cron expression [${cronStr}]. Invalid day specifier [${str}]. Expected: [${Object.keys(DAY_OF_WEEK_TO_INT).join(", ")}]`);
    } else {
      return dayInt;
    }
  };

  const convertStrFieldToInt = (fieldName, strValue) => {
    if (fieldName === "month") return monthStrToInt(strValue);
    else if (fieldName === "day_of_week") return dayStrToInt(strValue);
    else throw new Error(`Invalid cron expression [${cronStr}]. Invalid ${fieldName} specifier [${strValue}]. Expected: [${allowedValues[fieldName]}]`);
  };

  const parseValue = (fieldName) => (value) => {
    let parsedToInt = parseInt(value);
    if (Number.isNaN(parsedToInt)) {
      parsedToInt = convertStrFieldToInt(fieldName, value);
    }
    // console.log({fieldName, value, parsedToInt, has: allowedValues[fieldName].has(parsedToInt)});
    if (allowedValues[fieldName].has(parsedToInt)) {
      return parsedToInt;
    } else {
      throw new Error(`Invalid cron expression [${cronStr}]. Invalid ${fieldName} specifier [${value}]. Expected: [${Array.from(allowedValues[fieldName]).join(", ")}]`);
    }
  };

  const parseRange = (fieldName) => (value) => {
    const [from, to, ...shouldBeEmpty] = value.split("-").map(parseValue(fieldName));
    if (shouldBeEmpty.length > 0) {
      throw new Error(`Invalid cron expression [${cronStr}]. Invalid range [${value}] for field [${fieldName}].\
 Range should have two values separated by a - but got [${shouldBeEmpty.length + 2}] values..`);
    }
    if (from >= to) {
      throw new Error(`Invalid cron expression [${cronStr}]. Invalid range [${value}] for field [${fieldName}]. From value must be less than to value.`);
    }
    return { from, to };
  };

  const [minute, hour, day_of_month, month, day_of_week, year] = split;
  // console.log({
  //   minute, hour, daysOfMonth, month, dayOfWeek, year
  // });

  const parsed = {
    second: { omit: true }
  };
  for (const [field, value] of Object.entries({
    minute, hour, day_of_month, month, day_of_week, year
  })) {
    // console.log({ field, value });
    if (value === "*" || value === undefined && field === 'year') {
      parsed[field] = { all: true };
    } else {
      const values = value.split(",");
      const parsedExp = values.reduce(
        (acc, value) => {
          const isRange = value.includes("-");
          if (isRange)  {
            const parsedRange = parseRange(field)(value);
            acc.ranges = [...(acc.ranges ?? []), parsedRange];
          } else {
            const parsedValue = parseValue(field)(value);
            acc.values = [...(acc.values ?? []), parsedValue];
          }
          return acc;
        },
        {}
      );
      parsed[field] = parsedExp;
    }
  }
  return {
    pattern: split.join(" "),
    expressions: [parsed]
  };
};

describe('Cron parser test suite', () => {
  const testCases = [
    {
      description: 'All wildcards with 5 fields',
      cronString: '* * * * *',
      expectError: false
    },
    {
      description: 'All wildcards with 6 fields including year',
      cronString: '* * * * * 2025',
      expectError: false
    },
    {
      description: 'Single values and ranges in fields',
      cronString: '15 10 1-15 3,5 MON-FRI',
      expectError: false
    },
    {
      description: 'Multiple comma separated values and ranges',
      cronString: '0,30 8-17 10,20,30 1-3,5,7 MON,WED,FRI',
      expectError: false
    },
    {
      description: 'Valid month names and day names',
      cronString: '0 12 1 JAN,MAR,MAY MON,WED,FRI',
      expectError: false
    },
    {
      description: 'Valid mixed numeric and string day of week',
      cronString: '0 0 * * 1,3,5',
      expectError: false
    },
    {
      description: 'Invalid month string',
      cronString: '0 12 1 FAKEMON MON',
      expectError: true
    },
    {
      description: 'Invalid day of week string',
      cronString: '0 12 1 JAN FOOBAR',
      expectError: true
    },
    {
      description: 'Invalid range syntax with 3 elements',
      cronString: '0 12 1 1-3-5 MON',
      expectError: true
    },
    {
      description: 'Range with from >= to',
      cronString: '0 12 1 5-1 MON',
      expectError: true
    },
    {
      description: 'Hour field out of range',
      cronString: '0 25 1 1 MON',
      expectError: true
    },
    {
      description: 'Day of month field out of range',
      cronString: '0 12 32 1 MON',
      expectError: true
    },
    {
      description: 'Day of week number out of range',
      cronString: '0 12 1 1 7',
      expectError: true
    },
    {
      description: 'Year field missing (5 fields) should default all',
      cronString: '0 12 1 1 MON',
      expectError: false
    },
    {
      description: 'Year field specified and valid',
      cronString: '0 12 1 1 MON 2025',
      expectError: false
    },
    {
      description: 'Year field out of range',
      cronString: '0 12 1 1 MON 3000',
      expectError: true
    },
    {
      description: 'Empty string',
      cronString: '',
      expectError: true
    },
    {
      description: 'Too few fields',
      cronString: '* * * *',
      expectError: true
    },
    {
      description: 'Too many fields',
      cronString: '* * * * * * *',
      expectError: true
    },
    {
      description: 'Mix of single values and ranges with string days',
      cronString: '5,15 8-10 2-5 3,6 MON-THU',
      expectError: false
    }
  ];

  testCases.forEach(({ description, cronString, expectError }) => {
    it(description, () => {
      let libError = null;
      let myError = null;
      let libParsed = null;
      let myParsed = null;

      try {
        libParsed = parse(cronString);
      } catch (e) {
        libError = e;
      }

      try {
        myParsed = parseCron(cronString);
      } catch (e) {
        myError = e;
      }

      if (expectError) {
        assert(libError, `Expected library parser to throw for cron string: ${cronString} returned ${libParsed}`);
        assert(myError, `Expected custom parser to throw for cron string: ${cronString} returned ${myParsed}`);
      } else {
        assert(!libError, `Did not expect library parser error for cron string: ${cronString}`);
        assert(!myError, `Did not expect custom parser error for cron string: ${cronString}`);
        assert.deepStrictEqual(myParsed, libParsed, 'Custom parser output should deep equal library output');
      }
    });
  });
});

mocha.run();
