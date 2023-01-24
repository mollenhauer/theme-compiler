# Little Library to
* Uses `tinycolor` internally and passes it down:

```typescript
import { Theme, tinycolor2 as color } from "@mollbe/theme-compiler";
const [theme, format] = Theme.create([
    'include/some.jsonc'
])

const String = "hsl(175, 100%, 35%)"
format( 'string.quoted', String);
format( 'string.quoted.sinlge', color(Selection).setAlpha(.2));
format( 'keyword.control.import', 'red', 'bold');
format( 'keyword.control.foo', 'blue' );
format( 'colors.editor.foreground', 'red');
format( 'semantic.class.definiton', color('blue').desaturate(50) );

console.log(
    theme.combine() // valid theme.json for Visual Studio Code
);
```