# String Coercion

This tool will match a source string to a patter as closely as it can manage. This can be useful for use in html input masking or in formatting strings for display.

# Basic Usage

```
const settings = {
    value: '02062016',
    pattern: '99/99/9999',
}
Coerce.string(settings);
// result: '02/06/2016'
```

# Built-in regex

You can use some built-in "special characters" in your pattern. These use regex to match characters:

```
A: '[A-Z]'
9: '[0-9]'
*: '.'
+: '.*'
```

*Special Note: Only use + at the end of a pattern.*

**Examples**
Date: '99/99/9999'
Phone: '(999) 999-9999'
Credit Card: '9999 9999 9999 9999'
Web Address: 'http://+'

# Custom regex

In some cases you'll want to expand on the built-in types. The Web address example for instance would restrict your string to non-ssl addresses. To add custom special characters just add a `extend` object to the settings object:

```
const settings = {
    pattern: 'httpS://+',
    extend: {
        S: 's?',
        5: '.{0,5}'
    }
}
const coerce = new Coerce(settings);

coerce.string('http');
// result: 'http'

coerce.string('httpabc');
// result: 'http://abc'

coerce.string('httpsabc');
// result: 'https://abc'

coerce.string('https');
// result: 'https://'

coerce.string('abc');
// result: 'http://abc'

coerce.string('sabc');
// result: 'https://abc'

coerce.string('sabcdef');
// result: 'https://abcde'
```

# Use in html input

When the input value reaches the end with a match, but there's still more pattern to go, the tool will try to fill it out:

```
Coerce.string({
    value: '212',
    pattern: '999-999-9999',
});
// result '212-'
```

This is by design, it makes filling in masked inputs easier and less confusing, but causes an issue if you're using this as-you-type since backspace will be impossible and overwritten by the added character. For this use case, you should instantiate the class:

```
const coerceInstance = new Coerce({
    pattern: '999-999-9999',
})
```

Now let's have our user paste in 21223

```
let string = coerce.string('21223');
// result '212-23'
```

Now, the user realizes they wanted to change the 3rd digit, and proceeds to hit backspace 4 times:

```
string = coerceInstance.string('212-2'); // result: '212-2'
string = coerceInstance.string('212-'); // result: '212-'
string = coerceInstance.string('212'); // result: '212'
string = coerceInstance.string('21'); // result: '21'
```

The user can now re-enter the number.  This is a very common use case and works with the instantiated version, but without it here's what happens:

```
string = Coerce.string('212-2'); // result: '212-2'
string = Coerce.string('212-'); // result: '212-'
string = Coerce.string('212'); // result: '212-'
```

And as you can see the user would be stuck with that dash. Make sure to instantiate if you're going to be using this for input masking.