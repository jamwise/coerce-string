const builtInTypes = {
  'A': '[A-Z]',
  '9': '[0-9]',
  '*': '.',
  '+': '.*',
}

export default class Coerce {
  constructor({
    pattern,
    extend
  }) {
    this.pattern = pattern;
    this.extend = extend;
    // Merge built in identifiers with custom ones
    this.specialTypes = {
      ...builtInTypes,
      ...extend,
    }
    this.value = null;
  }

  static string = ({
    value,
    pattern,
    extend
  }) => {
    const specialTypes = {
      ...builtInTypes,
      ...extend,
    }
    return stringResult(value, pattern, specialTypes);
  }

  string(value) {
    this.value = stringResult(value, this.pattern, this.specialTypes, this.value);
    return this.value;
  }
}

function stringResult(value, pattern, specialTypes, prevValue) {
  // Set up an array to push characters to
  let chars = [];

  // Set up an array to push in whether the character was added because of a match or not
  let matches = [];

  let string = value;

  let patternArray = pattern.split('');

  // Here we loop through all of the characters in the pattern
  for (let i = 0; i < patternArray.length; i++) {
    const a = patternArray[i];
    if (a in specialTypes) {
      const regexp = new RegExp('^' + specialTypes[a], 'i');
      const match = string.match(regexp);
      chars.push(match !== null ? match[0] : null);
      if (match && match[0] !== '') {
        matches.push(true);
        string = string.slice(match.length);
      } else {
        matches.push(false);
        break;
      }
    } else if (a !== string[0]) {
      if (string[0] !== '' && !!string[0]) {
        /* 
          ^ if we're currently not at the end of the input string, and the next 
          character in the string does not equal the next character in the pattern, 
          cycle through the rest of the characters in the string. So long as none are
          equal to the current pattern, put them at the end of the string, if one matches
          push it to our chars[], remove it from our reference string, mark match as true, 
          and stop cycling through the reference string.
        */
        let match;
        for (let b = 0; b < string.length; b++) {
          if (a !== string[0]) {
            string = string.slice(1) + string[0];
            match = false;
            break;
          } else {
            chars.push(string[0]);
            matches.push(true);
            string = string.slice(1);
            match = true;
            break;
          }
        }
        if (match === false) {
          break;
        }
      }
    } else {
      /* 
        Here we know that there was a match, push to char[] and remove the character
        from the reference string
      */
      chars.push(string[0]);
      matches.push(true);
      string = string.slice(1);
    }
  }
  return chars.join('');
}