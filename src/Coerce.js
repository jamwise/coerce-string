const builtInTypes = {
  'A': '[A-Z]',
  '9': '[0-9]',
  '*': '.',
  '+': '.*',
}

export default class Coerce {
  constructor({pattern, extend}) {
    this.pattern = pattern;
    this.extend = extend;
    // Merge built in identifiers with custom ones
    this.specialTypes = {
      ...builtInTypes,
      ...extend,
    }
    this.value = null;
  }

  static string = ({value, pattern, extend}) => {
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

  let charArray = pattern.split('');
  
  // Here we loop through all of the characters in the pattern
  for(let i = 0; i < charArray.length; i++) {
    const a = charArray[i];
    if(a in specialTypes) {

      /*
        If the pattern character is a "special type", 
        meaning it has regex in the builtInTypes or the extend.
        In this case it will try to find a match starting at
        the beginning of the string. If a match is found, it will 
        push the match to chars (if the regex was conditional, and 
        there is no character, it still returns a match, but will push '').
        It then stores whether it was an actual matched character or not to
        matches. And finally if it was an actual match, it removes the first
        character of the string (since it's successfully been added to chars[])
      */
      const regexp = new RegExp('^'+specialTypes[a], 'i');
      const match = string.match(regexp);
      chars.push(match);
      if(match && match[0] !== '') {
        matches.push(true);
        string = string.slice(match.length);
      } else {
        matches.push(false);
      }

      // Everything below is dealing with cases where there's no regex for this character
    } else if(a !== string[0]) {
      if(string[0] !== '' && !!string[0]){
        /* 
          ^ if we're currently not at the end of the input string, and the next 
          character in the string does not equal the next character in the pattern, 
          cycle through the rest of the characters in the string. So long as none are
          equal to the current pattern, put them at the end of the string, if one matches
          push it to our chars[], remove it from our reference string, mark match as true, 
          and stop cycling through the reference string.
        */
        let match = false;
        for(let b = 0; b < string.length; b++) {
          if(a !== string[0]) {
            string = string.slice(1) + string[0];
          } else {
            chars.push(string[0]);
            matches.push(true);
            string = string.slice(1);
            match = true;
            break;
          }
        }
        /*
          This next block makes it such that if there's a bunch of characters
          in sequence that aren't regex, they don't need to be manually added by the user/source
          if a string is provided that reaches this point, it will automatcially 
          add the characters so long as it doesn't hit another specialType
        */
        let shouldPush;
        if(charArray[i-1] in specialTypes) {
          shouldPush = chars[chars.length - 1];
        } else {
          shouldPush = true;
        }
        /*
          So if the for loop above didn't find any matches to this character, and the 
          previous character is not a specialType, then push it, marking this push as a
          false match (since it's not in our reference string). Otherwise break out of the
          containing for loop.
        */
        if(!match && shouldPush) {
            chars.push(a);
            matches.push(false);
        } else if(!shouldPush) {
          break;
        }
      } else {
        /*
          This section is where those extra characters that were added to the end of our
          reference string get put back in instead of being lost because they didn't match.
          If we're not at the first character (i-1 exists) and we are the last, then push (with
          a false match since it wasn't a character match). Within the class we also track the 
          value, so it it's called again (presumably someone typing), if they remove a character
          rather than add on, we won't auto-append the characters (which would make backspacing 
          impossible)
        */
        const isDelete = prevValue && prevValue.length > value.length;
        if(!isDelete && charArray[i-1] && charArray[i-1] === chars[chars.length-1]) {
          chars.push(a);
          matches.push(false);
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